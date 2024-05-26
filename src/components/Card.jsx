import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";
import axios from "axios";

export const CardRender = (props) => {
  const {
    currentCard,
    data,
    type,
    dataLength,
    setCardId,
    onDragOver,
    onDragStart,
    onDragEnd,
  } = props;

  const [shouldFocusThisUser, setShouldFocusThisUser] = useState(false);
  const [shouldFocusThisProduct, setShouldFocusThisProduct] = useState(false);

  const { setProductData } = useContext(ProductCartContext);

  let setItemId;

  if (type === "users") {
    const { setUserId } = useContext(UserIdContext);
    setItemId = (value) => setUserId(value);
  } else {
    const { setProductId } = useContext(ProductIdContext);
    setItemId = (value) => setProductId(value);
  }

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const getProductData = async (endpoint) => {
    if (type === "users") {
      await axios.get(endpoint).then((res) => {
        const d = res.data.carts;
        setProductData(d);
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(() => {
    const shouldFocusThisItem = sessionStorage.getItem(`focus-${type}-id`);

    if (type === "products") {
      setShouldFocusThisProduct(
        property.id === JSON.parse(shouldFocusThisItem),
      );
    } else {
      if (dataLength !== 1) {
        setShouldFocusThisUser(
          property.id === JSON.parse(shouldFocusThisItem),
        );
      } else {
        setShouldFocusThisUser(true);
      }
    }
  }, [property.id]);

  const handleClick = (type) => {
    sessionStorage.setItem(`focus-${type}-id`, property.id);

    if (property !== undefined) {
      setCardId(property.id);
      setItemId(property.id);
      console.log(property);
    }

    sessionStorage.removeItem("lastQuery");
  };

  return (
    <>
      {shouldFocusThisUser && type === "users" ||
        shouldFocusThisProduct && type === "products"
        ? (
          <Card
            bg="cardBgWhenActive"
            boxShadow="lg"
            rounded="md"
            background={"rgba(255, 255, 255, .25)"}
            backdropFilter={"auto"}
            backdropBlur="5.5px"
            border="solid"
            borderColor={"rgba(255, 255 , 255, .18)"}
            borderWidth={"thin"}
            draggable
            onDragStart={() => onDragStart(currentCard + 1)}
            onDragOver={() => onDragOver(currentCard + 1)}
            onDragEnd={onDragEnd}
            onClick={() => handleClick(props.type)}
          >
            <CardBody>
              <Stack align="center" direction="column" spacing={2}>
                <Avatar
                  size="lg"
                  src={property.imageUrl}
                  name={property.name}
                />
                <Text
                  align="center"
                  fontSize="md"
                >
                  {property.name}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        )
        : (
          <Card
            bg="cardBg"
            rounded="md"
            background={"rgba(255, 255, 255, .05)"}
            backdropFilter={"auto"}
            backdropBlur="5.5px"
            border="solid"
            borderColor={"rgba(255, 255 , 255, .18)"}
            borderWidth={"thin"}
            draggable
            onDragStart={() => onDragStart(currentCard + 1)}
            onDragEnter={() => onDragOver(currentCard + 1)}
            onDragEnd={onDragEnd}
            onClick={async () => {
              handleClick(props.type);
              await getProductData(
                `https:dummyjson.com/users/${property.id}/carts`,
              );
            }}
          >
            <CardBody>
              <Stack align="center" direction="column" spacing={2}>
                <Avatar
                  bg="light.50"
                  size="lg"
                  src={property.imageUrl}
                  title={property.name}
                />
                <Text
                  align="center"
                  fontSize="md"
                  noOfLines={2}
                >
                  {property.name}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        )}
    </>
  );
};
