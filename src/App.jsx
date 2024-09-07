// import "./App.css";

import { Box, useColorModeValue } from "@chakra-ui/react";
import Router from "./components/Router";

export const App = () => {
  return (
    <Box
      bg="mainBg"
      bgImg={"../src/assets/Background.png"}
    >
      <Router />
    </Box>
  );
};
