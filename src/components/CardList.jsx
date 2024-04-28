import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CardRender } from "./Card";
import debounce from "lodash.debounce";
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
  const { type, page, setCurrentPage, setSearch, search } = prop;
  const toast = useToast();

  const cardRendered = useRef(0);
  const currentPage = useRef(page);

  const [data, setData] = useState([{}]);
  const [cartData, setCartData] = useState([{}]);

  const users = JSON.parse(sessionStorage.getItem("users"));
  const carts = JSON.parse(sessionStorage.getItem("carts"));
  const products = JSON.parse(sessionStorage.getItem("products"));

  let filteredData, currentData, initialData;

  if (type === "users") {
    filteredData = (value) =>
      users?.filter((user) => user.name.includes(value));
    currentData = users?.slice(
      cardRendered.current,
      cardRendered.current + 20,
    );
    initialData = () => {
      setData(
        users?.slice(
          cardRendered.current,
          cardRendered.current + 20,
        ),
      );
    };
  } else {
    filteredData = (value) =>
      products?.filter((product) => product.name.includes(value));
    currentData = products?.slice(
      cardRendered.current,
      cardRendered.current + 20,
    );
    initialData = () => {
      setData(
        products?.slice(
          cardRendered.current,
          cardRendered.current + 20,
        ),
      );
    };
  }

  const initializeData = () => initialData();

  const getDataOnFirstRender = async (endpoint) => {
    let dataRender;
    let dataGetFromEndpoint;

    if (users === null || products === null) {
      const d = [];
      dataGetFromEndpoint = await axios.get(endpoint);

      if (search === "") {
        if (type === "users") {
          dataGetFromEndpoint.data?.users?.forEach((user) => {
            d.push({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              image: user.image,
            });
          });
        } else {
          dataGetFromEndpoint.data?.products?.forEach((product) => {
            d.push({
              id: product.id,
              name: product.title,
              image: product.images[0],
            });
          });
        }
      } else {
        const { data } = await axios.get(
          `https://dummyjson.com/${type}/search?q=${search}`,
        );

        if (type === "users") {
          const user = data.users[0];

          d.push({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
          });
        } else {
          const product = data.products[0];

          d.push({
            id: product.id,
            name: product.title,
            image: product.images[0],
          });
        }
      }

      setData(d);
      cardRendered.current = 20 * (page - 1);
    } else {
      cardRendered.current = 20 * (page - 1);

      if (search === "") {
        dataRender = currentData;
      } else {
        dataRender = filteredData(search);
      }

      setData(dataRender);
    }
  };

  const fetchAllData = async (endpoint) => {
    const dataGetFromEndpoint = await axios.get(endpoint);

    const d = [];

    if (type === "users") {
      dataGetFromEndpoint.data.users.forEach((user) => {
        d.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        });
      });
    } else {
      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
        });
      });
    }

    sessionStorage.setItem(`${type}`, JSON.stringify(d));
  };

  const fetchAllDataCart = async (endpoint) => {
    if (carts === null) {
      const dataGetFromEndpoint = await axios.get(endpoint);
      const d = dataGetFromEndpoint.data.carts;
      sessionStorage.setItem("carts", JSON.stringify(d));
      setCartData(d);
    } else {
      setCartData(carts);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await getDataOnFirstRender(
          `https://dummyjson.com/${type}?limit=20&skip=${(page - 1) * 20}`,
        );

        if (data.length !== 0) {
          if (users === null || products === null) {
            await fetchAllData(`https://dummyjson.com/${type}?limit=100`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchAllDataCart("https://dummyjson.com/carts");
    })();
  }, []);

  const handleClickPrev = () => {
    if (cardRendered.current !== 0) {
      cardRendered.current -= 20;
    } else {
      toast({
        title: "Can't load!!",
        description: "This is first page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    if (currentPage.current > 1) {
      currentPage.current -= 1;
      setCurrentPage(currentPage.current);
    }

    initializeData();
  };

  const handleClickNext = () => {
    if (cardRendered.current <= 60) {
      cardRendered.current += 20;
    } else {
      toast({
        title: "Can't load more!!",
        description: "This is last page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    if (currentPage.current < 5) {
      currentPage.current += 1;
      setCurrentPage(currentPage.current);
    }

    initializeData();
  };

  const getFilteredItems = (query) => {
    const d = filteredData(query);

    if (query?.length === 0) {
      setData(currentData);
    } else {
      setData(d);
    }
  };

  const updateQuery = (e) => {
    const query = e?.target?.value;

    setSearch(query);
    getFilteredItems(query);
  };

  const debounceOnChange = debounce(updateQuery, 200);

  return (
    <Box>
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Spacer />
        <ButtonGroup gap="2">
          <IconButton
            variant="outline"
            bg="btnBg"
            size="md"
            icon={<ArrowBackIcon />}
            onClick={handleClickPrev}
          />
          <IconButton
            variant="outline"
            bg="btnBg"
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
            defaultValue={search}
            onChange={debounceOnChange}
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
              {data?.map((dataRender, id) => (
                <CardRender
                  key={id}
                  type="products"
                  data={dataRender}
                  cartData={cartData}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )
        : (
          <Stack h={"85vh"} overflowY="auto">
            <SimpleGrid columns={4} spacing={2}>
              {data?.map((dataRender, id) => (
                <CardRender
                  key={id}
                  type="users"
                  data={dataRender}
                  cartData={cartData}
                  dataLength={data.length}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
    </Box>
  );
};
