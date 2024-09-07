import React from "react";
import { createContext, useState } from "react";

interface Props {
  productId: any;
  setProductId: (value: string[]) => void;
}

export const ProductIdContext = createContext<Props>({
  productId: undefined,
  setProductId: () => {},
});

export default function ProductIdProvider({ children }) {
  const [productId, setProduct] = useState("");

  return (
    <ProductIdContext.Provider
      value={{
        productId,
        setProductId: (value) => {
          setProduct(value);
        },
      }}
    >
      {children}
    </ProductIdContext.Provider>
  );
}
