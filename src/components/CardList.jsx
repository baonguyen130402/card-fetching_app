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
import { useSearchParams } from "react-router-dom";

export const CardList = (prop) => {
  const { type } = prop;
  const toast = useToast();
  const cardRendered = useRef(0);

  const [searchParams, setSearchParams] = useSearchParams();

  let user = searchParams.get("user");
  let product = searchParams.get("product");

  const [userPage, setUserPage] = useState(user !== "1" ? Number(user) : 1);
  const [productPage, setProductPage] = useState(
    product !== "1" ? Number(product) : 1,
  );

  const [query, setQuery] = useState("");
  const [cartData, setCartData] = useState([{}]);
  const [userData, setUserData] = useState([{}]);
  const [productData, setProductData] = useState([{}]);

  const users = JSON.parse(sessionStorage.getItem("users"));
  const carts = JSON.parse(sessionStorage.getItem("carts"));
  const products = JSON.parse(sessionStorage.getItem("products"));

  const filteredItemUser = JSON.parse(
    sessionStorage.getItem("filteredItemUser"),
  );
  const filteredItemProduct = JSON.parse(
    sessionStorage.getItem("filteredItemProduct"),
  );

  const lastQueryUser = sessionStorage.getItem("lastQueryUser");
  const lastQueryProduct = sessionStorage.getItem("lastQueryProduct");

  const initializeData = ({ type } = prop) => {
    if (type === "users") {
      setUserData(users.slice(cardRendered.current, cardRendered.current + 20));
    }

    if (type === "products") {
      setProductData(
        products.slice(cardRendered.current, cardRendered.current + 20),
      );
    }
  };

  const getUserDataOnFirstRender = async (endpoint) => {
    let dataRender;
    let dataGetFromEndpoint;

    if (users === null) {
      const d = [];
      dataGetFromEndpoint = await axios.get(endpoint);

      dataGetFromEndpoint.data.users.forEach((user) => {
        d.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        });
      });

      if (lastQueryUser !== "null") {
        setUserData(filteredItemUser);
      } else {
        setUserData(d);
      }

      cardRendered.current = 20 * (userPage - 1);
    } else {
      cardRendered.current = 20 * (userPage - 1);

      dataRender = lastQueryUser !== "null"
        ? filteredItemUser
        : users?.slice(cardRendered.current, cardRendered.current + 20);

      setUserData(dataRender);
    }
  };

  const getProductDataOnFirstRender = async (endpoint) => {
    let dataRender;
    let dataGetFromEndpoint;

    if (products === null) {
      const d = [];
      dataGetFromEndpoint = await axios.get(endpoint);

      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: product.title,
          image: product.images[0],
        });
      });

      if (lastQueryProduct !== "null") {
        setProductData(filteredItemProduct);
      } else {
        setProductData(d);
      }

      cardRendered.current = 20 * (productPage - 1);
    } else {
      cardRendered.current = 20 * (productPage - 1);

      dataRender = lastQueryProduct !== "null"
        ? filteredItemProduct
        : products?.slice(0, 20);

      setProductData(dataRender);
    }
  };

  const fetchAllData = async (endpoint, type) => {
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
        await getUserDataOnFirstRender(
          `https://dummyjson.com/users?limit=20&skip=${(userPage - 1) * 20}`,
        );

        await getProductDataOnFirstRender(
          `https://dummyjson.com/products?limit=20&skip=${(productPage - 1) * 20
          }`,
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (userData.length !== 0 && productData.length !== 0) {
          if (users === null || products === null) {
            await fetchAllData(`https://dummyjson.com/${type}?limit=100`, type);
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

      if (type === "users") {
        setUserPage(userPage - 1);
        sessionStorage.setItem(
          "currentUserPage",
          JSON.stringify(cardRendered.current / 20 + 1),
        );
      } else {
        setProductPage(productPage - 1);
      }
    } else {
      toast({
        title: "Can't load!!",
        description: "This is first page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    initializeData({ type });
  };

  const handleClickNext = () => {
    if (cardRendered.current <= 60) {
      cardRendered.current += 20;

      type === "users"
        ? setUserPage(userPage + 1)
        : setProductPage(productPage + 1);
    } else {
      toast({
        title: "Can't load more!!",
        description: "This is last page.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    initializeData({ type });
  };

  useEffect(() => {
    setSearchParams({
      user: userPage.toString(),
      product: productPage.toString(),
    });
  }, [userPage, productPage]);

  const getFilteredItems = (query) => {
    if (type === "users") {
      const d = users?.filter((user) => user.name.includes(query));

      if (query?.length === 0) {
        setUserData(
          users?.slice(cardRendered.current, cardRendered.current + 20),
        );
      } else {
        setUserData(d);
      }
    }

    if (type === "products") {
      const d = products?.filter((product) => product.name.includes(query));

      if (query?.length === 0) {
        setProductData(
          products?.slice(cardRendered.current, cardRendered.current + 20),
        );
      } else {
        setProductData(d);
      }
    }
  };

  useEffect(() => {
    if (type === "users") {
      if (query.length === 0 && lastQueryUser?.length !== 0) {
        sessionStorage.setItem("lastQueryUser", lastQueryUser);
      } else {
        sessionStorage.setItem("lastQueryUser", query);
      }
    }

    if (type === "products") {
      if (query.length === 0 && lastQueryProduct?.length !== 0) {
        sessionStorage.setItem("lastQueryProduct", lastQueryProduct);
      } else {
        sessionStorage.setItem("lastQueryProduct", query);
      }
    }

    getFilteredItems(query);
  }, [query]);

  const updateQuery = (e) => setQuery(e?.target?.value);
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
              {productData?.map((dataRender, id) => (
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
              {userData?.map((dataRender, id) => (
                <CardRender
                  key={id}
                  type="users"
                  data={dataRender}
                  cartData={cartData}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
    </Box>
  );
};
