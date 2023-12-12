import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";

export const ToggleThemeBtn = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Button
      pos="absolute"
      top="0"
      right="0"
      m="1rem"
      onClick={() => toggleColorMode()}
    >
      {colorMode === "dark"
        ? <SunIcon color="orange.400" />
        : <MoonIcon color="blue.700" />}
    </Button>
  );
};
