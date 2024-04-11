import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Cart } from "./Cart.jsx";
import { CardList } from "./CardList.jsx";
import { ProductCard } from "./ProductCard.jsx";
import { ToggleThemeBtn } from "../chakraUI/ToggleTheme.jsx";

import UserIdProvider from "../lib/contexts/UserIdContext.tsx";
import ProductIdProvider from "../lib/contexts/ProductIdContext.tsx";
import ProductProvider from "../lib/contexts/ProductNameContext.tsx";
import ProductCartProvider from "../lib/contexts/ProductCartContext.tsx";
import DefaultValueProvider from "../lib/contexts/DefaultValueContext.tsx";

import { Box, Container, Grid, GridItem } from "@chakra-ui/react";
import { useSearchParams} from "react-router-dom"

export default function Router() {
  const Layout = () => {
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(1);

    let user = searchParams.get("user");
    let product = searchParams.get("product");

    const setPageFromCardList = (currentPage) => setPage(currentPage);

    return (
      <Container w={"100vw"} maxW="4xl" centerContent>
        <Box p={4} w={"100vw"} maxW="4xl">
          <ToggleThemeBtn />
          <UserIdProvider>
            <ProductIdProvider>
              <ProductProvider>
                <ProductCartProvider>
                  <DefaultValueProvider>
                    <Grid
                      gap={8}
                      templateColumns="repeat(2, minmax(200px, 1fr))"
                    >
                      <GridItem rowSpan={2}>
                        <CardList
                          type="users"
                          page={Number(user) === 0 ? 1 : Number(user)}
                          setCurrentPage={setPageFromCardList}
                        />
                      </GridItem>
                      <GridItem rowSpan={1}>
                        <CardList
                          type="products"
                          page={Number(product) === 0 ? 1 : Number(product)}
                          setCurrentPage={setPageFromCardList}
                        />
                        <Box mt={4}>
                          <Cart />
                        </Box>
                      </GridItem>
                    </Grid>
                  </DefaultValueProvider>
                </ProductCartProvider>
              </ProductProvider>
            </ProductIdProvider>
          </UserIdProvider>
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
