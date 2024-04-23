import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CardRender } from "./Card";
import debounce from "lodash.debounce";
import {
  Box,
  ButtonGroup,
  filter,
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
  const { type, page, setCurrentPage, query } = prop;
  const toast = useToast();

  const cardRendered = useRef(0);
  const currentPage = useRef(page);

  const [data, setData] = useState([{}]);
  const [cartData, setCartData] = useState([{}]);

  const users = JSON.parse(sessionStorage.getItem("users"));
  const carts = JSON.parse(sessionStorage.getItem("carts"));
  const products = JSON.parse(sessionStorage.getItem("products"));

  const filteredItemUser =
    sessionStorage.getItem("filteredItemUser") !== "undefined"
      ? JSON.parse(
        sessionStorage.getItem("filteredItemUser"),
      )
      : [];

  const filteredItemProduct =
    sessionStorage.getItem("filteredItemProduct") !== "undefined"
      ? JSON.parse(
        sessionStorage.getItem("filteredItemProduct"),
      )
      : [];

  const lastQueryUser = sessionStorage.getItem("lastQueryUser");
  const lastQueryProduct = sessionStorage.getItem("lastQueryProduct");

  const initializeData = (type) => {
    if (type === "users") {
      setData(users.slice(cardRendered.current, cardRendered.current + 20));
    }

    if (type === "products") {
      setData(
        products.slice(cardRendered.current, cardRendered.current + 20),
      );
    }
  };

  const getDataOnFirstRender = async (endpoint) => {
    let dataRender;
    let dataGetFromEndpoint;

    if (users === null || products === null) {
      const d = [];
      dataGetFromEndpoint = await axios.get(endpoint);

      if (type === "users") {
        if (query === "") {
          dataGetFromEndpoint.data?.users?.forEach((user) => {
            d.push({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              image: user.image,
            });
          });

          setData(d);
        } else {
          const { data } = await axios.get(
            `https://dummyjson.com/users/search?q=${query}`,
          );

          const user = data.users[0];

          d.push({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
          });

          setData(d);
        }
      }

      if (type === "products") {
        dataGetFromEndpoint.data?.products?.forEach((product) => {
          d.push({
            id: product.id,
            name: product.title,
            image: product.images[0],
          });
        });

        console.log(d);

        setData(d);
      }

      cardRendered.current = 20 * (page - 1);
    } else {
      cardRendered.current = 20 * (page - 1);

      if (type === "users") {
        if (query === "") {
          dataRender = lastQueryUser !== null
            ? filteredItemUser
            : users?.slice(cardRendered.current, cardRendered.current + 20);
        } else {
          dataRender = users?.filter((user) => user.name.includes(query));
        }

        setData(dataRender);
      }

      if (type === "products") {
        console.log(lastQueryProduct);
        dataRender = lastQueryProduct !== null
          ? filteredItemProduct
          : products?.slice(cardRendered.current, cardRendered.current + 20);

        setData(dataRender);
      }
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

      sessionStorage.setItem("users", JSON.stringify(d));
    }

    if (type === "products") {
      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
        });
      });

      sessionStorage.setItem("products", JSON.stringify(d));
    }
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
    if (lastQueryUser?.length !== 0) {
      if (type === "users") {
        getFilteredItems(lastQueryUser);
      }
    }

    if (lastQueryProduct?.length !== 0) {
      if (type === "products") {
        getFilteredItems(lastQueryProduct);
      }
    }
  }, []);

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

    if (type === "users") {
      if (currentPage.current > 1) {
        currentPage.current -= 1;
      }
      setCurrentPage(currentPage.current);
    } else {
      if (currentPage.current > 1) {
        currentPage.current -= 1;
      }
      setCurrentPage(currentPage.current);
    }
    initializeData(type);
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

    if (type === "users") {
      if (currentPage.current < 5) {
        currentPage.current += 1;
      }
      setCurrentPage(currentPage.current);
    } else {
      if (currentPage.current < 5) {
        currentPage.current += 1;
      }
      setCurrentPage(currentPage.current);
    }

    initializeData(type);
  };

  const getFilteredItems = (query) => {
    if (type === "users") {
      const d = users?.filter((user) => user.name.includes(query));

      if (query?.length === 0) {
        setData(
          users?.slice(cardRendered.current, cardRendered.current + 20),
        );
      } else {
        setData(d);
      }

      sessionStorage.setItem("filteredItemUser", JSON.stringify(d));
    }

    if (type === "products") {
      const d = products?.filter((product) => product.name.includes(query));

      if (query?.length === 0) {
        setData(
          products?.slice(cardRendered.current, cardRendered.current + 20),
        );
      } else {
        setData(d);
      }

      sessionStorage.setItem("filteredItemProduct", JSON.stringify(d));
    }
  };

  const updateQuery = (e) => {
    const query = e?.target?.value;

    if (type === "users") {
      if (query.length === 0 && lastQueryUser?.length !== 0) {
        sessionStorage.setItem("lastQueryUser", "");
      } else {
        sessionStorage.setItem("lastQueryUser", query);
      }
    }

    if (type === "products") {
      if (query.length === 0 && lastQueryProduct?.length !== 0) {
        sessionStorage.setItem("lastQueryProduct", "");
      } else {
        sessionStorage.setItem("lastQueryProduct", query);
      }
    }

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
            defaultValue={type === "products"
              ? lastQueryProduct === "null" ? "" : lastQueryProduct
              : lastQueryUser === "null"
                ? ""
                : lastQueryUser}
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
                  query={query}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
    </Box>
  );
};
