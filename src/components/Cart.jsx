import { useContext, useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import debounce from "lodash.debounce";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
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

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState([{}]);
  const [dataCard, setDataCard] = useState([{}]);
  const [shouldReverse, setShouldReverse] = useState(false);

  const currentIndex = useRef(0);

  const lastQuery = sessionStorage.getItem("lastQuery");
  const currentData = JSON.parse(
    sessionStorage.getItem("currentData"),
  );

  const { userId } = useContext(UserIdContext);
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
      products = productData;
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

    if (d.length !== 0) {
      sessionStorage.setItem("currentData", JSON.stringify(d));
    }

    lastQuery !== null ? getFilteredItems(lastQuery) : setData(d);

    setDataCard(dc);
  };

  const getFilteredItems = (q) => {
    const d = currentData?.filter((item) =>
      item?.name?.toLowerCase().includes(q?.toLowerCase())
    );

    q?.length !== 0 ? setData(d) : setData(currentData);
  };

  useEffect(() => {
    getData();
  }, [userId, productData]);

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
    onClose()
    setSearch(dataCard[index].name)
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
      {data.length !== 0
        ? (
          <TableContainer bg="cartBg" mt={8} size="sm" p={3}>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  {cartTableKeys.map((key, idx) => (
                    <Th
                      key={idx}
                      maxW="20px"
                      onClick={() => {
                        sortData(key);
                      }}
                    >
                      {key}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              {data.map((product, index) => (
                <Tbody
                  key={index}
                  className="border"
                >
                  <Tr>
                    {Object.values(product).map((el, idx) => (
                      // FIXME: Error in console. (Fixed)
                      <Td
                        maxW="20px"
                        key={idx}
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
