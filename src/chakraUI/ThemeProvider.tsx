import React from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { config } from "./config.tsx";
import grape from "./theme/grape.ts";

const theme = extendTheme({
  config,
  colors: grape.colors,
  semanticTokens: {
    colors: {
      cardBg: {
        default: "action.500",
        _dark: "primary.700",
      },
      cardBgWhenActive: {
        default: "primary.100",
        _dark: "primary.500",
      },
      avatarBg: {
        default: "primary.500",
        _dark: "primary.700",
      },
      mainBg: {
        default: "action.300",
        _dark: "secondary.900",
      },
      cartBg: {
        default: "secondary.50",
        _dark: "primary.800",
      },
      btnBg: {
        default: "action.500",
        _dark: "primary.700",
      },
    },
  },
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
