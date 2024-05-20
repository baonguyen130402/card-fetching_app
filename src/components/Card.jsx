import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";
import axios from "axios";

export const CardRender = (props) => {
  const { data, type, dataLength, cardId, setCardId } = props;

  const [shouldFocusThisUser, setShouldFocusThisUser] = useState(false);
  const [shouldFocusThisProduct, setShouldFocusThisProduct] = useState(false);

  const { setProductData } = useContext(ProductCartContext);

  let itemId, setItemId;

  if (type === "users") {
    // const userId = Number(searchParams.get("userId"));
    const { userId, setUserId } = useContext(UserIdContext);
    itemId = userId;
    setItemId = (value) => setUserId(value);
  } else {
    // const productId = Number(searchParams.get("productId"));
    const { productId, setProductId } = useContext(ProductIdContext);
    itemId = productId;
    setItemId = (value) => setProductId(value);
  }

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const getProductData = async (endpoint) => {
    if (type === "users") {
      const dataGetFromEndPoint = await axios.get(endpoint);
      const d = dataGetFromEndPoint.data.carts;

      console.log("run");

      setProductData(d);
    }
  };

  useEffect(() => {
    (async () => {
      if (cardId !== "") {
        sessionStorage.setItem(`focus-${type}-id`, Number(cardId));

        if (type === "users") {
          await getProductData(
            `https:dummyjson.com/users/${cardId}/carts`,
          );
        }
      }
    })();
  }, []);

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
  }, [data, property.id]);

  const handleClick = (type) => {
    sessionStorage.setItem(`focus-${type}-id`, property.id);

    if (property !== undefined) {
      setCardId(property.id);
      setItemId(property.id);
    }

    sessionStorage.removeItem("lastQuery");
  };

  return (
    <>
      {shouldFocusThisUser && type === "users" ||
        shouldFocusThisProduct && type === "products"
        ? (
          <Card
            draggable="true"
            onDragStart={() => console.log(property.id)}
            onDragEnd={() => console.log(property.id)}
            bg="cardBgWhenActive"
            boxShadow="lg"
            rounded="md"
            onClick={() => {
              handleClick(props.type);
            }}
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
            draggable="true"
            bg="cardBg"
            rounded="md"
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
