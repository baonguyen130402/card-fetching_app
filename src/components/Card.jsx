import { useContext, useEffect, useRef, useState } from "react";

import { UserIdContext } from "../lib/contexts/user-id-context";
import ProductCartProvider, {
  ProductCartContext,
} from "../lib/contexts/ProductCartContext";

import axios from "axios";
import { ProductCard } from "./ProductCard";

export const Card = (props) => {
  const { id, name, image, dataCart } = props;
  const UserId = useRef();
  const [shouldFocusThisCard, setShouldFocusThisCard] = useState(false);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productData, setProductData } = useContext(ProductCartContext);

  const handleClick = () => {
    localStorage.setItem("focus-user-id", id);
    setUserId(id);
    UserId.current = id;
  };

  const getProductData = (userId) => {
    let products;

    if (dataCart[userId] !== undefined) {
      products = dataCart[userId];
    }

    if (products !== undefined) {
      setProductData(products);
    }
  };

  useEffect(() => {
    const shouldFocusUserId = localStorage.getItem("focus-user-id");
    if (id !== undefined) {
      setShouldFocusThisCard(id === JSON.parse(shouldFocusUserId));
    }
    if (userId !== undefined) {
      getProductData(userId);
    }
  }, [userId]);

  return (
    <>
      {shouldFocusThisCard
        ? (
          <a
            onClick={handleClick}
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
