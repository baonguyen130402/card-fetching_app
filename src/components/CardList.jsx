import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { CardRender } from "./Card";
import { ProductNameContext } from "../lib/contexts/ProductNameContext.tsx";
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";

export const CardList = (prop) => {
  const { type } = prop;
  const toast = useToast();
  const cardRendered = useRef(0);
  const [data, setData] = useState([]);
  const [dataCart, setDataCart] = useState({});
  const [count, setCount] = useState(20);
  const [fetch, setFetch] = useState(true);
  const { productName, setProductName } = useContext(ProductNameContext);

  const fetchData = async (endpoint) => {
    // const savedDataUser = JSON.parse(sessionStorage.getItem("dataUser"));
    // const savedDataProduct = JSON.parse(sessionStorage.getItem("dataProduct"));

    const dataGetFromEndpoint = await axios.get(endpoint);

    // if (savedDataUser.length !== 0 && d.length === 0 && type === "users") {
    //   setData(savedDataUser);
    // } else if (
    //   savedDataProduct.length !== 0 && d.length === 0 && type === "product"
    // ) {
    //   setData(savedDataProduct);
    // }

    const d = [];

    if (type === "users") {
      dataGetFromEndpoint.data.users.forEach((user) => {
        d.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        });
      });
    } else if (type === "products") {
      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
        });
      });
    }

    setData(d);
  };

  const fetchDataCart = async (cardRendered) => {
    const d = {};

    if (data.length >= 20) {
      for (let i = cardRendered + 1; i < cardRendered + 21; i++) {
        const dataCartUser = await axios.get(
          `https://dummyjson.com/carts/user/${i}`,
        );

        if (dataCartUser.data.carts.length !== 0) {
          d[i] = dataCartUser.data.carts[0].products;
        } else {
          continue;
        }
      }
    }

    setDataCart({
      ...dataCart,
      ...d,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData(`https://dummyjson.com/${type}?limit=20`);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (productName !== "" && type === "products") {
      (async () => {
        try {
          await fetchData(
            `https://dummyjson.com/${type}/search?q=${productName}`,
          );
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [productName]);

  useEffect(() => {
    if (data.length >= 20 && fetch) {
      (async () => {
        try {
          await fetchDataCart(cardRendered.current);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [cardRendered.current, data.length]);

  const handleClickPrev = () => {
    if (cardRendered.current !== 0) {
      cardRendered.current -= 20;

      fetchData(
        `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
      );
    } else {
      toast({
        title: "Can't load!!",
        description: "This is first page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    setFetch(false);
  };

  const handleClickNext = () => {
    if (cardRendered.current <= 60) {
      cardRendered.current += 20;

      fetchData(
        `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
      );
    } else {
      toast({
        title: "Can't load more!!",
        description: "This is last page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    if (cardRendered.current === count) {
      setCount(count + 20);
      setFetch(true);
    }
  };

  const handleSearch = async (event) => {
    let searchString = event.target.value;

    if (searchString.length !== 0) {
      await fetchData(
        `https://dummyjson.com/${type}/search?q=${searchString}`,
      );
    } else {
      await fetchData(
        `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
      );
    }
  };

  return (
    <Box>
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Spacer />
        <ButtonGroup gap="2">
          <IconButton
            variant="outline"
            size="md"
            icon={<ArrowBackIcon />}
            onClick={handleClickPrev}
          />
          <IconButton
            variant="outline"
            size="md"
            icon={<ArrowForwardIcon />}
            onClick={handleClickNext}
          />
        </ButtonGroup>
        <Spacer />
      </Flex>
      <Stack my={3} px={16}>
        <InputGroup>
          <Input
            variant="filled"
            placeholder="Name..."
            onChange={async (e) => await handleSearch(e)}
          />
          <InputRightElement>
            <SearchIcon color="teal" />
          </InputRightElement>
        </InputGroup>
      </Stack>
      {type === "products"
        ? (
          <Stack h={"50vh"} overflowY="auto">
            <SimpleGrid columns={4} spacing={2}>
              {data.map((dataRender, id) => (
                <CardRender
                  key={id}
                  type="products"
                  data={dataRender}
                  dataCart={dataCart}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )
        : (
          <Stack h={"85vh"} overflowY="auto">
            <SimpleGrid columns={4} spacing={2}>
              {data.map((dataRender, id) => (
                <CardRender
                  key={id}
                  type="users"
                  data={dataRender}
                  dataCart={dataCart}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
    </Box>
  );
};
