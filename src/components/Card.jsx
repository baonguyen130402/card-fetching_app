import { useContext, useEffect, useState } from "react";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";

export const CardRender = (props) => {
  const { data, type, cartData, dataLength } = props;

  const [shouldFocusThisUser, setShouldFocusThisUser] = useState(false);
  const [shouldFocusThisProduct, setShouldFocusThisProduct] = useState(false);

  const { setProductData } = useContext(ProductCartContext);

  let itemId, setItemId;

  if (type === "users") {
    const { userId, setUserId } = useContext(UserIdContext);
    itemId = userId;
    setItemId = (value) => setUserId(value);
  } else {
    const { productId, setProductId } = useContext(ProductIdContext);
    itemId = productId;
    setItemId = (value) => setProductId(value);
  }

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const getProductData = (userId) => {
    if (type === "users") {
      const d = {};
      const userIdHasCart = [];

      const cartCurrent = JSON.parse(
        sessionStorage.getItem("cartCurrent"),
      );

      cartData?.forEach((cart) => {
        userIdHasCart.push(cart.userId);

        d[cart.userId] = cart.products;
      });

      if (userIdHasCart.includes(userId)) {
        sessionStorage.setItem(
          "cartCurrent",
          JSON.stringify(d[userId]),
        );
      } else {
        if (cartCurrent?.length !== 0 && userId !== "") {
          sessionStorage.setItem(
            "cartCurrent",
            JSON.stringify([]),
          );
        }
      }

      if (cartCurrent !== null) {
        setProductData(cartCurrent);
      } else {
        setProductData(d[userId]);
      }
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

        if (itemId !== undefined) {
          getProductData(itemId);
        }
      } else {
        setShouldFocusThisUser(true);

        if (property.id !== undefined) {
          getProductData(property.id);
        }
      }
    }
  }, [itemId, data, property.id]);

  const handleClick = (type) => {
    sessionStorage.setItem(`focus-${type}-id`, property.id);

    setItemId(property.id);

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
            onClick={() => {
              handleClick(props.type);
              getProductData();
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
            bg="cardBg"
            rounded="md"
            onClick={() => {
              handleClick(props.type);
              getProductData();
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
