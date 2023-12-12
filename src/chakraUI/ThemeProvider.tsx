import React from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { config } from "./config.tsx";

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        transitionProperty: "revert",
        transitionDuration: "300ms",
      },
    },
  },
});

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

export const ThemeProvider = ({ children }: Props) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
