import { useContext, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { UserIdContext } from "../lib/contexts/user-id-context.tsx";
import { ProductNameContext } from "../lib/contexts/ProductNameContext.tsx";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import axios from "axios";
import { ProductCard } from "./ProductCard.jsx";

// TODO: Update imports.

export const Cart = () => {
  const [data, setData] = useState([{}]);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productName, setProductName } = useContext(ProductNameContext);
  const { productData, setProductData } = useContext(ProductCartContext);
  let cartTableKeys;

  if (data.length !== 0) {
    cartTableKeys = Object.keys(data[0]);
  } else {
    cartTableKeys = []
  }

  const getData = () => {
    // const dataGetFromEndPoint = await axios.get(
    //   `https://dummyjson.com/carts/user/${userId}`,
    // );
    // const productCart = dataGetFromEndPoint.data.carts;
    let products = [];

    if (productData.length !== 0) {
      products = productData;
    }

    // try {
    //   if (productCart.length === 0) {
    //     products = data;
    //   } else {
    //     products = productCart[0].products;
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

    const d = [];

    products.forEach((product) => {
      d.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        total: product.total,
      });
    });

    setData(d);
  };

  useEffect(() => {
    getData();
  }, [productData]);

  return (
    <div className="p-4">
      <table className="border-collapse border border-slate-500">
        <thead>
          <tr>
            {cartTableKeys.map((key, idx) => (
              <th key={idx} className="border bg-slate-600">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        {data.map((product, index) => (
          <tbody
            key={index}
            className="border"
            onClick={() => setProductName(product.title)}
          >
            <tr>
              {Object.values(product).map((el, idx) => (
                // FIXME: Error in console. (Fixed)
                <td
                  key={idx}
                  className="border"
                >
                  <Link
                    to={`/product/${index}`}
                    state={productData}
                    className="text-white cursor-pointer"
                  >
                    {el}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};
