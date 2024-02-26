import React from "react";
import { createContext, useState } from "react";

interface Props {
  productName: string;
  setProductName: (value) => void;
}

export const ProductNameContext = createContext<Props>({
  productName: "",
  setProductName: () => {},
});

export default function ProductProvider({ children }) {
  const [productName, setProduct] = useState("");

  return (
    <ProductNameContext.Provider
      value={{
        productName,
        setProductName: (value) => {
          setProduct(value);
        },
      }}
    >
      {children}
    </ProductNameContext.Provider>
  );
}
