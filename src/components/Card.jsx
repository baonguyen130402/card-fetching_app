import { memo, useContext, useEffect, useState } from "react";

import { Avatar, Card, CardBody, Stack, Text } from "@chakra-ui/react";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductIdContext } from "../lib/contexts/ProductIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import { fetchProductData } from "../lib/data.js";

const CardRender = (props) => {
  const {
    id,
    key,
    type,
    name,
    image,
    dataLabel,
    dataLength,
    setCardId,
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

  const getUserIdFocusing = (id) => {
    const shouldFocusThisItem = sessionStorage.getItem(`focus-${type}-id`);

    if (type === "products") {
      setShouldFocusThisProduct(
        id === JSON.parse(shouldFocusThisItem),
      );
    } else {
      if (dataLength !== 1) {
        setShouldFocusThisUser(
          id === JSON.parse(shouldFocusThisItem),
        );
      } else {
        setShouldFocusThisUser(true);
      }
    }
  };

  useEffect(() => {
    getUserIdFocusing(id);
  }, [{ id, name, image }]);

  const handleClick = async () => {
    sessionStorage.setItem(`focus-${type}-id`, id);

    setCardId(id);
    setItemId(id);

    const d = await fetchProductData(id);
    setProductData(d);

    sessionStorage.removeItem("lastQuery");
  };

  return (
    <>
      {shouldFocusThisUser || shouldFocusThisProduct
        ? (
          <Card
            key={key}
            data-label={dataLabel}
            bg="cardBgWhenActive"
            boxShadow="lg"
            rounded="md"
            background={"rgba(255, 255, 255, .25)"}
            backdropFilter={"auto"}
            backdropBlur="5.5px"
            border="solid"
            borderColor={"rgba(255, 255 , 255, .18)"}
            borderWidth={"thin"}
            onClick={async () => {
              await handleClick();
              getUserIdFocusing(id);
            }}
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
            key={key}
            bg="cardBg"
            rounded="md"
            background={"rgba(255, 255, 255, .05)"}
            backdropFilter={"auto"}
            backdropBlur="5.5px"
            border="solid"
            borderColor={"rgba(255, 255 , 255, .18)"}
            borderWidth={"thin"}
            onClick={async () => {
              await handleClick();
              getUserIdFocusing(id);
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
