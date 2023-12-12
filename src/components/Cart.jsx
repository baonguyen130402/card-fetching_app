import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { UserIdContext } from "../lib/contexts/user-id-context.tsx";
import { ProductNameContext } from "../lib/contexts/ProductNameContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// TODO: Update imports.

export const Cart = () => {
  const [data, setData] = useState([{}]);
  const [dataCard, setDataCard] = useState([{}]);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productName, setProductName } = useContext(ProductNameContext);
  const { productData, setProductData } = useContext(ProductCartContext);
  let cartTableKeys;

  if (data.length !== 0) {
    cartTableKeys = Object.keys(data[0]);
  } else {
    cartTableKeys = [];
  }

  const getData = () => {
    let products = [];

    if (productData.length !== 0) {
      products = productData;
    }

    const d = [];
    const dc = [];

    console.log(products);

    products.forEach((product) => {
      d.push({
        id: product.id,
        name: product.title,
        total: product.total,
        price: product.price,
        quantity: product.quantity,
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

    setData(d);
    setDataCard(dc);
  };

  useEffect(() => {
    getData();
  }, [productData, userId]);

  return (
    <TableContainer mt={8} size="sm">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            {cartTableKeys.map((key, idx) => (
              <Th key={idx} maxW="20px">
                {key}
              </Th>
            ))}
          </Tr>
        </Thead>
        {data.map((product, index) => (
          <Tbody
            key={index}
            className="border"
            onClick={() => setProductName(product.title)}
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
  );
};
