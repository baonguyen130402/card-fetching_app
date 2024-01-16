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

  const [shouldReverse, setShouldReverse] = useState(false);

  const [data, setData] = useState([{}]);
  const [dataCard, setDataCard] = useState([{}]);
  const [currentData, setCurrentData] = useState([{}]);

  const { userId, setUserId } = useContext(UserIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  let cartTableKeys;

  const filteredItemCart = JSON.parse(
    sessionStorage.getItem("filteredItemCart"),
  );
  const lastQueryCart = sessionStorage.getItem("lastQueryCart");

  if (data.length !== 0) {
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

    if (lastQueryCart?.length !== undefined) {
      setData(filteredItemCart);
    } else {
      setData(d);
      setCurrentData(d);
      setDataCard(dc);
    }
  };

  useEffect(() => {
    getData();
  }, [userId, productData, lastQueryCart]);

  const getFilteredItems = (query) => {
    if (query.length === 0) {
      setData(currentData);
    } else {
      const d = data.filter((item) =>
        item?.name?.toLowerCase().includes(query.toLowerCase())
      );
      setData(d);
      sessionStorage.setItem("filteredItemCart", JSON.stringify(d));
      sessionStorage.setItem("lastQueryCart", query);
    }
  };

  useEffect(() => {
    getFilteredItems(query);
  }, [query]);

  const updateQuery = (e) => setQuery(e?.target?.value);
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
            defaultValue={lastQueryCart !== null ? lastQueryCart : ""}
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
