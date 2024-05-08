// import "./App.css";

import { Box, useColorModeValue } from "@chakra-ui/react";
import Router from "./components/Router";

export const App = () => {
  const bg = useColorModeValue("primary.dark", "primary.light");

  return (
    <Box bg="mainBg">
      <Router />
    </Box>
  );
};
