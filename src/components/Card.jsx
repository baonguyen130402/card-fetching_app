import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/user-id-context";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";

export const CardRender = (props) => {
  const { data, dataCart } = props;
  const UserId = useRef();
  const [shouldFocusThisCard, setShouldFocusThisCard] = useState(false);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  const property = {
    id: data.id,
    imageUrl: data.image,
    name: data.name,
  };

  const handleClick = () => {
    localStorage.setItem("focus-user-id", property.id);
    setUserId(property.id);
    UserId.current = property.id;
  };

  const getProductData = (userId) => {
    let products;

    if (dataCart[userId] !== undefined) {
      products = dataCart[userId];
    }

    if (products !== undefined) {
      setProductData(products);
    }
  };

  useEffect(() => {
    const shouldFocusUserId = localStorage.getItem("focus-user-id");
    if (property.id !== undefined) {
      setShouldFocusThisCard(property.id === JSON.parse(shouldFocusUserId));
    }
    if (userId !== undefined) {
      getProductData(userId);
    }
  }, [userId]);

  return (
    <>
      {shouldFocusThisCard
        ? (
          <Card
            bg="#999"
            boxShadow="lg"
            rounded="md"
            onClick={() => {
              handleClick();
              getProductData();
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
              handleClick();
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
