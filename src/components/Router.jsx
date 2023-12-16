import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Cart } from "./Cart.jsx";
import { CardList } from "./CardList.jsx";
import { ProductCard } from "./ProductCard.jsx";
import { ToggleThemeBtn } from "../chakraUI/ToggleTheme.jsx";

import UserIdObserver from "../lib/contexts/user-id-context.tsx";
import ProductIdObserver from "../lib/contexts/product-id-context.tsx";
import ProductProvider from "../lib/contexts/ProductNameContext.tsx";
import ProductCartProvider from "../lib/contexts/ProductCartContext.tsx";
import { Box, Container, Grid, GridItem } from "@chakra-ui/react";

export default function Router() {
  const Layout = () => {
    return (
      <Container w={"100vw"} maxW="4xl" centerContent>
        <Box p={4} w={"100vw"} maxW="4xl">
          <ToggleThemeBtn />
          <UserIdObserver>
            <ProductIdObserver>
              <ProductProvider>
                <ProductCartProvider>
                  <Grid
                    gap={8}
                    templateColumns="repeat(2, minmax(200px, 1fr))"
                  >
                    <GridItem rowSpan={2}>
                      <CardList type="users" />
                    </GridItem>
                    <GridItem rowSpan={1}>
                      <CardList type="products" />
                      <Cart />
                    </GridItem>
                  </Grid>
                </ProductCartProvider>
              </ProductProvider>
            </ProductIdObserver>
          </UserIdObserver>
        </Box>
      </Container>
    );
  };

  const BrowserRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/product/:id" element={<ProductCard />} />
        </Routes>
      </BrowserRouter>
    );
  };

  return (
    BrowserRoutes()
  );
}
