import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Center,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
export const ProductCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const product = location.state[id];

  let boxBg = useColorModeValue("white !important", "#111c44 !important");
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.400", "gray.400");

  return (
    <Center w={"100vw"} h={"100vh"}>
      <Flex
        borderRadius="20px"
        bg={boxBg}
        boxShadow="2xl"
        pt="20px"
        pb="20px"
        w={{ base: "315px", md: "345px" }}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Image
          src="https://i.ibb.co/xmP2pS6/Profile.png"
          maxW="100%"
          borderRadius="20px"
        />
        <Flex flexDirection="column" mb="30px">
          <Image
            src={product.image}
            mx="auto"
            borderColor={boxBg}
            width="68px"
            height="68px"
            mt="-38px"
            borderRadius="50%"
          />
          <Text
            fontWeight="600"
            color={mainText}
            textAlign="center"
            fontSize="xl"
          >
            {product.name}
          </Text>
          <Text
            color={secondaryText}
            textAlign="center"
            fontSize="sm"
            fontWeight="500"
          >
            ID: {product.id}
          </Text>
        </Flex>
        <Flex justify="space-between" w="100%" px="36px">
          <Flex flexDirection="column">
            <Text color={secondaryText} fontWeight="500">
              Total
            </Text>
            <Text
              fontWeight="600"
              color={mainText}
              fontSize="xl"
              textAlign="center"
            >
              {product.total}
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text color={secondaryText} fontWeight="500">
              Price
            </Text>
            <Text
              fontWeight="600"
              color={mainText}
              fontSize="xl"
              textAlign="center"
            >
              {product.price}$
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text color={secondaryText} fontWeight="500">
              Discount
            </Text>
            <Text
              fontWeight="600"
              fontSize="xl"
              color={mainText}
              textAlign="center"
            >
              {product.discountPct}%
            </Text>
          </Flex>
        </Flex>
        <Button mt={4} px={4} py={2} onClick={() => navigate(-1)}>Back</Button>
      </Flex>
    </Center>
  );
};
