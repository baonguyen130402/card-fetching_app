import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from "react-router-dom";

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
import { useEffect, useState } from "react";

export default function Router() {
  const Layout = () => {
    const { action } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    let userP = searchParams.get("userPage") === "0"
      ? "1"
      : searchParams.get("userPage");
    let productP = searchParams.get("productPage") === "0"
      ? "1"
      : searchParams.get("productPage");
    let userS = searchParams.get("userSearch") !== ""
      ? searchParams.get("userSearch")
      : "";
    let productS = searchParams.get("productSearch") !== ""
      ? searchParams.get("productSearch")
      : "";

    const [userPage, setUserPage] = useState(userP !== "1" ? Number(userP) : 1);
    const [productPage, setProductPage] = useState(
      productP !== "1" ? Number(productP) : 1,
    );
    const [userSearch, setUserSearch] = useState(userS);
    const [productSearch, setProductSearch] = useState(productS);

    const setUserPageFromCardList = (currentPage) => setUserPage(currentPage);
    const setProductPageFromCardList = (currentPage) =>
      setProductPage(currentPage);
    const setUserSearchFromCardList = (search) => setUserSearch(search);
    const setProductSearchFromCardList = (search) => setProductSearch(search);

    useEffect(() => {
      if (action !== "search") {
        setSearchParams({
          userPage: userPage,
          productPage: productPage,
          userSearch: userSearch,
          productSearch: productSearch,
        });
      }
    }, [userPage, productPage, userSearch, productSearch]);

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
                          page={userPage}
                          search={userSearch}
                          setCurrentPage={setUserPageFromCardList}
                          setSearch={setUserSearchFromCardList}
                        />
                      </GridItem>
                      <GridItem rowSpan={1}>
                        <CardList
                          type="products"
                          page={productPage}
                          search={productSearch}
                          setCurrentPage={setProductPageFromCardList}
                          setSearch={setProductSearchFromCardList}
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
          <Route path="/:action" element={<Layout />} />
          <Route path="/product/:id" element={<ProductCard />} />
        </Routes>
      </BrowserRouter>
    );
  };

  return (
    BrowserRoutes()
  );
}
