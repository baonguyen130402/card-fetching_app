import { Button, ButtonGroup, Stack } from "@chakra-ui/react";
export const Test = () => {
  return (
    <Stack spacing={4} direction="row" align="center">
      <Button
        onClick={() => console.log("Clicked")}
        colorScheme="teal"
        size="lg"
        variant="outline"
      >
        Button
      </Button>
      <Button colorScheme="teal" size="lg">
        Button
      </Button>
    </Stack>
  );
};
