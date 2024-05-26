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
      background={"rgba(255, 255, 255, .05)"}
      backdropFilter={"auto"}
      backdropBlur="5.5px"
      border="solid"
      borderColor={"rgba(255, 255 , 255, .18)"}
      borderWidth={"thin"}
      onClick={() => toggleColorMode()}
    >
      {colorMode === "dark"
        ? <SunIcon color="yellow.300" />
        : <MoonIcon color="blue.700" />}
    </Button>
  );
};
