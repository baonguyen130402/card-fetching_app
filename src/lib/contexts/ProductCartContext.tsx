import React from "react";
import {} from "react";
import { createContext, useState } from "react";

interface Props {
  productData: string;
  setProductData: (value) => void;
}

export const ProductCartContext = createContext<Props>({
  productData: "",
  setProductData: () => {},
});

export default function ProductCartProvider({ children }) {
  const [productData, setProductData] = useState("");

  return (
    <ProductCartContext.Provider
      value={{
        productData: productData,
        setProductData: (value) => {
          setProductData(value);
        },
      }}
    >
      {children}
    </ProductCartContext.Provider>
  );
}
