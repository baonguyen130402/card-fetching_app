import React from "react";
import { createContext, useState } from "react";

interface Props {
  defaultValueCard: any[];
  setDefaultValueCard: (value) => void;
}

export const DefaultValueContext = createContext<Props>({
  defaultValueCard: [],
  setDefaultValueCard: () => { },
});

export default function DefaultValueProvider({ children }) {
  const [defaultValueCard, setDefaultValueCard] = useState("");

  return (
    <DefaultValueContext.Provider
      value={{
        defaultValueCard: defaultValueCard,
        setDefaultValueCard: (value) => {
          setDefaultValueCard(value);
        },
      }}
    >
      {children}
    </DefaultValueContext.Provider>
  );
}
