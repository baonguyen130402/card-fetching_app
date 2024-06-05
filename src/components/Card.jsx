import { memo, useContext, useEffect, useState } from "react";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";
import { fetchProductData } from "../lib/data.js";

const CardRender = (props) => {
  const {
    type,
    name,
    image,
    data,
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
    id: data?.id,
  };

  console.log("re-render");

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
      {shouldFocusThisUser || shouldFocusThisProduct
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
            draggabl
            onDragStart={() => onDragStart(property.id)}
            onDragOver={() => onDragOver(property.id)}
            onDragEnd={onDragEnd}
            onClick={() => handleClick(props.type)}
          >
            <CardBody>
              <Stack align="center" direction="column" spacing={2}>
                <Avatar
                  size="lg"
                  src={image}
                  name={name}
                />
                <Text
                  align="center"
                  fontSize="md"
                >
                  {name}
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
            onDragStart={() => onDragStart(property.id)}
            onDragOver={() => onDragOver(property.id)}
            onDragEnd={onDragEnd}
            onClick={async () => {
              handleClick(props.type);
              const d = await fetchProductData(property.id);
              setProductData(d);
            }}
          >
            <CardBody>
              <Stack align="center" direction="column" spacing={2}>
                <Avatar
                  bg="light.50"
                  size="lg"
                  src={image}
                  title={name}
                />
                <Text
                  align="center"
                  fontSize="md"
                  noOfLines={2}
                >
                  {name}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export default memo(CardRender);
