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
  const { cardId, type, page, setCurrentPage, setSearch, search, setId } = prop;

  const toast = useToast();
  const cardRendered = useRef(page - 1);
  // const currentPage = useRef(page);

  const [data, setData] = useState([{}]);

  const users = JSON.parse(sessionStorage.getItem("users"));
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
      if (users !== null) {
        setData(
          users?.slice(
            cardRendered.current,
            cardRendered.current + 20,
          ),
        );
      }
    };
  } else {
    filteredData = (value) =>
      products?.filter((product) => product.name.includes(value));
    currentData = products?.slice(
      cardRendered.current,
      cardRendered.current + 20,
    );
    initialData = () => {
      if (products !== null) {
        setData(
          products?.slice(
            cardRendered.current,
            cardRendered.current + 20,
          ),
        );
      }
    };
  }

  const setIdFromCardComponent = (value) => setId(value);

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
        if (type === "users") {
          dataRender = users.slice(
            cardRendered.current,
            cardRendered.current + 20,
          );
        } else {
          dataRender = products.slice(
            cardRendered.current,
            cardRendered.current + 20,
          );
        }
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
          cart: [],
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

  useEffect(() => {
    (async () => {
      try {
        let correctPage;

        if (cardId % 20 === 0) {
          correctPage = Math.floor(cardId / 20) - 1;
        } else {
          correctPage = Math.floor(cardId / 20);
        }

        correctPage = correctPage === -1 ? page : correctPage;

        await getDataOnFirstRender(
          `https://dummyjson.com/${type}?limit=20&skip=${correctPage * 20}`,
        );

        if (users === null || products === null) {
          await fetchAllData(`https://dummyjson.com/${type}?limit=100`);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [search, cardId, page]);

  const renderPageHasSelectedCard = () => {
    cardRendered.current = 20 * (page - 1);

    if (type === "users") {
      setData(
        users?.slice(
          cardRendered.current,
          cardRendered.current + 20,
        ),
      );
    } else {
      setData(
        products?.slice(
          cardRendered.current,
          cardRendered.current + 20,
        ),
      );
    }
  };

  useEffect(() => {
    renderPageHasSelectedCard();
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

    if (page > 1) {
      setCurrentPage(page - 1);
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

    if (page < 5) {
      setCurrentPage(page + 1);
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
      <Flex
        minWidth="max-content"
        gap="2"
      >
        <Spacer />
        <ButtonGroup display="flex" alignItems="center">
          <IconButton
            variant="outline"
            marginRight="2"
            bg="btnBg"
            size="md"
            icon={<ArrowBackIcon />}
            onClick={handleClickPrev}
          />
          {page}
          <IconButton
            variant="outline"
            bg="btnBg"
            size="md"
            marginLeft="0"
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
                  cardId={cardId}
                  type="products"
                  data={dataRender}
                  setCardId={setIdFromCardComponent}
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
                  cardId={cardId}
                  type="users"
                  data={dataRender}
                  dataLength={data.length}
                  setCardId={setIdFromCardComponent}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
    </Box>
  );
};
