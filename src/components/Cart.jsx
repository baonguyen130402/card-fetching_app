import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import debounce from "lodash.debounce";

import { UserIdContext } from "../lib/contexts/UserIdContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import {
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

export const Cart = () => {
  const [query, setQuery] = useState("");
  console.log(query);
  const [shouldReverse, setShouldReverse] = useState(false);

  const [data, setData] = useState([{}]);
  const [dataCard, setDataCard] = useState([{}]);
  const [currentData, setCurrentData] = useState([{}]);

  const { userId, setUserId } = useContext(UserIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  const lastQuery = sessionStorage.getItem("lastQuery");

  let cartTableKeys;

  if (data?.length !== 0) {
    cartTableKeys = Object.keys(data[0]);
  } else {
    cartTableKeys = [];
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
    
    if (lastQuery?.length !== 0) {
      getFilteredItems(lastQuery);
    }

    if (currentData.length !== 1) {
      setData(currentData);
    } else {
      setData(d);
    }

    // setData(d);
    // setCurrentData(d);
    setDataCard(dc);
    sessionStorage.setItem("currentData", JSON.stringify(d));
  };

  useEffect(() => {
    getData();
  }, [userId, productData]);

  useEffect(() => {
    if (lastQuery?.length !== 0 && data.length !== 0) {
      const d = data?.filter((item) =>
        item?.name?.toLowerCase().includes(lastQuery?.toLowerCase())
      );

      setData(d);
    }
  }, []);

  const getFilteredItems = (query) => {
    const d = data?.filter((item) =>
      item?.name?.toLowerCase().includes(query?.toLowerCase())
    );

    if (query?.length === 0) {
      setData(currentData);
    } else setData(d);
  };

  const updateQuery = (e) => {
    const query = e.target?.value;

    if (query.length === 0 && lastQuery?.length !== 0) {
      sessionStorage.setItem("lastQuery", "");
    } else {
      sessionStorage.setItem("lastQuery", query);
    }

    getFilteredItems(query);
    setQuery(query);
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
                        <Text noOfLines={1}>
                          <Link
                            to={`/product/${index}`}
                            state={dataCard}
                            className="text-white cursor-pointer"
                          >
                            {el}
                          </Link>
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
    </Stack>
  );
};
