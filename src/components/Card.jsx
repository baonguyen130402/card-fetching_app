import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/user-id-context";
import { ProductCartContext } from "../lib/contexts/ProductCartContext";

import axios from "axios";

export const Card = (props) => {
  const { id, name, image } = props;
  const UserId = useRef();
  const [shouldFocusThisCard, setShouldFocusThisCard] = useState(false);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  useEffect(() => {
    const shouldFocusUserId = localStorage.getItem("focus-user-id");
    setShouldFocusThisCard(id === JSON.parse(shouldFocusUserId));
  }, [userId]); // [userId]

  const handleClick = () => {
    localStorage.setItem("focus-user-id", id);
    setUserId(id);
    UserId.current = id;
  };

  const getProductData = async () => {
    const dataGetFromEndPoint = await axios.get(
      `https://dummyjson.com/users/${UserId.current}/carts`,
    );

    const productCart = dataGetFromEndPoint.data.carts;
    let products;
    
    try {
      if (productCart.length === 0) {
        products = [];
      } else {
        products = productCart[0].products;
      }
    } catch (err) {
      console.log(err);
    }
    
    const d = [];

    products.forEach((product) => {
      d.push({
        name: product.title,
        img: product.thumbnail,
      });
    });

    setProductData(d);
  };

  return (
    <>
      {shouldFocusThisCard
        ? (
          <a
            onClick={() => {
              handleClick();
              getProductData();
            }}
            className="flex flex-col max-w-sm p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700"
          >
            <img
              className="w-32 mb-2 bg-transparent rounded-lg align-center mx-auto"
              src={image}
            />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {name}
            </p>
          </a>
        )
        : (
          <a
            onClick={() => {
              handleClick();
              getProductData();
            }}
            href="#"
            className="flex flex-col max-w-sm p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <img
              className="w-32 mb-2 bg-transparent rounded-lg align-center mx-auto"
              src={image}
            />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {name}
            </p>
          </a>
        )}
    </>
  );
};
