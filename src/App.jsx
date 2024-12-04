import { background, Box, useColorModeValue } from "@chakra-ui/react";
import Router from "./components/Router";

import backgroundImg from "./assets/Background.png"

export const App = () => {
  return (
    <Box
      bg="mainBg"
      bgImg={backgroundImg}
    >
      <Router />
    </Box>
  );
};
