import { useContext, useEffect, useRef, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import debounce from "lodash.debounce";

import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

export const Cart = (props) => {
  const { search, setSearch } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState([]);
  const [dataCard, setDataCard] = useState([{}]);
  const [shouldReverse, setShouldReverse] = useState(false);

  const currentIndex = useRef(0);

  const lastQuery = sessionStorage.getItem("lastQuery");

  const users = JSON.parse(sessionStorage.getItem("users"));
  const currentIdUser = JSON.parse(sessionStorage.getItem("focus-users-id"));

  const userId = searchParams.get("userId");

  const { productData } = useContext(ProductCartContext);

  let cartTableKeys;

  if (data === undefined) {
    cartTableKeys = [];
  } else {
    if (data?.length !== 0) {
      cartTableKeys = Object.keys(data[0]);
    }
  }

  const getData = () => {
    let products = [];

    if (productData?.length !== 0) {
      products = productData[0].products;
    }

    const d = [];
    const dc = [];

    products?.forEach((product) => {
      d.push({
        id: product.id,
        name: product.title,
        price: product.price,
      });
      dc.push({
        id: product.id,
        name: product.title,
        total: product.total,
        price: product.price,
        image: product.thumbnail,
        discountPct: product.discountPercentage,
      });
    });

    if (users !== null && d.length !== 0) {
      users[Number(userId) - 1].cart = d;
      sessionStorage.setItem("users", JSON.stringify(users));
    }

    if (lastQuery !== null) {
      getFilteredItems(lastQuery);
    } else {
      if (users !== null) {
        const currentCartData = users[Number(userId) - 1]?.cart;

        if (currentCartData?.length !== 0) {
          setData(currentCartData);
        } else {
          setData(d);
        }
      }
    }

    setDataCard(dc);
  };

  const getFilteredItems = (q) => {
    const currentCartData = users[Number(userId) - 1]?.cart;

    const d = currentCartData.filter((item) =>
      item?.name?.toLowerCase().includes(q?.toLowerCase())
    );

    q?.length !== 0 ? setData(d) : setData(currentCartData);
  };

  useEffect(() => {
    getData();
  }, [productData]);

  const updateQuery = (e) => {
    const query = e.target?.value;

    if (query.length === 0 && lastQuery?.length !== 0) {
      sessionStorage.setItem("lastQuery", "");
    } else {
      sessionStorage.setItem("lastQuery", query);
    }

    getFilteredItems(query);
  };

  const debounceOnChange = debounce(updateQuery, 200);

  const sortData = (type) => {
    const d = data.slice(0);

    if (type === "id") {
      d.sort((a, b) => {
        return shouldReverse ? a.id - b.id : b.id - a.id;
      });
    } else if (type === "name") {
      d.sort((a, b) => {
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();

        return shouldReverse
          ? x < y ? -1 : x > y ? 1 : 0
          : x > y
            ? -1
            : x < y
              ? 1
              : 0;
      });
    } else {
      d.sort((a, b) => {
        return shouldReverse ? a.price - b.price : b.price - a.price;
      });
    }

    setData(d);
    setShouldReverse(!shouldReverse);
  };

  const handleOpen = (index) => {
    currentIndex.current = index;
    onOpen();
  };

  const openInNewPage = () => {
    const index = currentIndex.current;
    navigate(`/product/${index}`, { state: dataCard });
  };

  const openInProductView = () => {
    const index = currentIndex.current;
    onClose();
    setSearch(dataCard[index].name);
  };

  return (
    <Stack>
      <Stack px={16}>
        <InputGroup>
          <Input
            variant="filled"
            defaultValue={lastQuery === null ? "" : lastQuery}
            placeholder="Product..."
            onChange={debounceOnChange}
          />
          <InputRightElement>
            <SearchIcon color="teal" />
          </InputRightElement>
        </InputGroup>
      </Stack>
      {data?.length !== 0
        ? (
          <TableContainer bg="cartBg" mt={8} size="sm">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  {cartTableKeys?.map((key, idx) => (
                    <Th
                      key={idx}
                      maxW="20px"
                      fontSize={20}
                      textColor="#999"
                      title="Click to sort"
                      border="inset"
                      borderColor="#666"
                      _hover={{ cursor: "pointer" }}
                      onClick={() => {
                        sortData(key);
                      }}
                    >
                      {key}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              {data?.map((product, index) => (
                <Tbody
                  key={index}
                  className="border"
                  title="Click to view more"
                >
                  <Tr>
                    {Object.values(product).map((el, idx) => (
                      // FIXME: Error in console. (Fixed)
                      <Td
                        maxW="20px"
                        key={idx}
                        border="inset"
                        borderColor="#666"
                      >
                        <Text
                          noOfLines={1}
                          _hover={{ cursor: "pointer" }}
                          onClick={() => handleOpen(index)}
                        >
                          {el}
                        </Text>
                      </Td>
                    ))}
                  </Tr>
                </Tbody>
              ))}
            </Table>
          </TableContainer>
        )
        : (
          <Center h={"300px"}>
            <Text fontSize="24px">Please select user to show cart</Text>
          </Center>
        )}

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalContent>
          <ModalHeader>View this product</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={openInNewPage}>
              In new page
            </Button>
            <Button colorScheme="blue" onClick={openInProductView}>
              In product view
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
