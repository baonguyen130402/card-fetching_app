import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/user-id-context";
import { ProductIdContext } from "../lib/contexts/product-id-context";

import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";

export const CardRender = (props) => {
  const { data, type, cartData } = props;

  const UserId = useRef();
  const ProductId = useRef();

  const [allCartData, setAllCartData] = useState({});
  const [shouldFocusThisUser, setShouldFocusThisUser] = useState(false);
  const [shouldFocusThisProduct, setShouldFocusThisProduct] = useState(false);

  const { userId, setUserId } = useContext(UserIdContext);
  const { productId, setProductId } = useContext(ProductIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const handleClick = (type) => {
    if (type === "products") {
      sessionStorage.setItem("focus-product-id", property.id);
      setProductId(property.id);
      ProductId.current = property.id;
    }

    if (type === "users") {
      sessionStorage.setItem("focus-user-id", property.id);
      setUserId(property.id);
      UserId.current = property.id;
    }
  };

  const getProductData = (userId) => {
    const d = {};
    const temp = [];
    const userIdHasCart = [];
    const cartCurrent = JSON.parse(sessionStorage.getItem("cartCurrent"));

    cartData.forEach((cart) => {
      userIdHasCart.push(cart.userId);

      d[cart.userId] = cart.products;

      setAllCartData({
        allCartData,
        ...d,
      });
    });

    if (userIdHasCart.includes(userId)) {
      sessionStorage.setItem(
        "cartCurrent",
        JSON.stringify(allCartData[userId]),
      );
    }

    if (cartCurrent.length !== 0) {
      setProductData(cartCurrent);
    } else {
      setProductData(allCartData[userId]);
    }
  };

  useEffect(() => {
    const shouldFocusUserId = sessionStorage.getItem("focus-user-id");

    if (property.id !== undefined && type === "users") {
      setShouldFocusThisUser(
        property.id === JSON.parse(shouldFocusUserId),
      );
    }

    if (userId !== undefined) {
      getProductData(userId);
    }
  }, [userId]);

  useEffect(() => {
    const shouldFocusProductId = sessionStorage.getItem("focus-product-id");

    if (property.id !== undefined && type === "products") {
      setShouldFocusThisProduct(
        property.id === JSON.parse(shouldFocusProductId),
      );
    }
    if (productId !== undefined) {
      getProductData(productId);
    }
  }, [productId]);

  return (
    <>
      {shouldFocusThisUser && type === "users" ||
          shouldFocusThisProduct && type === "products"
        ? (
          <Card
            bg="#999"
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
                  bg="cyan"
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
            rounded="md"
            onClick={() => {
              handleClick(props.type);
              getProductData();
            }}
          >
            <CardBody>
              <Stack align="center" direction="column" spacing={2}>
                <Avatar
                  bg="cyan"
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
