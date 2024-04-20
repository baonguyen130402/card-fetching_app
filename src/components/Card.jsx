import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { DefaultValueContext } from "../lib/contexts/DefaultValueContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";

export const CardRender = (props) => {
  const { data, type, cartData } = props;

  const [allCartData, setAllCartData] = useState({});
  const [shouldFocusThisUser, setShouldFocusThisUser] = useState(false);
  const [shouldFocusThisProduct, setShouldFocusThisProduct] = useState(false);

  const { userId, setUserId } = useContext(UserIdContext);
  const { productId, setProductId } = useContext(ProductIdContext);
  const { setProductData } = useContext(ProductCartContext);
  const { defaultValueCard } = useContext(DefaultValueContext);

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const getProductData = (userId) => {
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
          JSON.stringify([""]),
        );
      }
    }

    if (cartCurrent?.length !== 0) {
      setProductData(cartCurrent);
    } else {
      setProductData(allCartData[userId]);
    }
  };

  const users = JSON.parse(sessionStorage.getItem("users"));

  const test = {};
  test[userId] = defaultValueCard;

  // console.log(test);

  useEffect(() => {
    const shouldFocusUserId = sessionStorage.getItem("focus-user-id");

    setShouldFocusThisUser(
      property.id === JSON.parse(shouldFocusUserId),
    );

    if (userId !== undefined) {
      getProductData(userId);
    }
  }, [userId, data]);

  useEffect(() => {
    const shouldFocusProductId = sessionStorage.getItem("focus-product-id");

    setShouldFocusThisProduct(
      property.id === JSON.parse(shouldFocusProductId),
    );
  }, [productId, data]);

  const handleClick = (type) => {
    if (type === "products") {
      sessionStorage.setItem("focus-product-id", property.id);
      setProductId(property.id);
    }

    if (type === "users") {
      sessionStorage.setItem("focus-user-id", property.id);
      setUserId(property.id);
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
            onClick={() => {
              handleClick(props.type);
              getProductData(userId);
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
