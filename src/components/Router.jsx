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

import UserIdProvider, {
  UserIdContext,
} from "../lib/contexts/UserIdContext.tsx";
import ProductIdProvider from "../lib/contexts/ProductIdContext.tsx";
import ProductProvider from "../lib/contexts/ProductNameContext.tsx";
import ProductCartProvider from "../lib/contexts/ProductCartContext.tsx";
import DefaultValueProvider from "../lib/contexts/DefaultValueContext.tsx";

import { Box, Container, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Router() {
  const Layout = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    let userP = searchParams.get("userPage") === "0" ||
      Number(searchParams.get("userPage")) > 5 ||
      Number(searchParams.get("userPage")) < 1 ||
      searchParams.get("userPage") === "NaN"
      ? "1"
      : searchParams.get("userPage");

    if (
      Number(searchParams.get("userPage")) > 5 ||
      Number(searchParams.get("userPage")) < 1 ||
      searchParams.get("userPage") === "NaN"
    ) {
      console.log("ListUser Page is not valid!!!");
    }

    if (
      Number(searchParams.get("productPage")) > 5 ||
      Number(searchParams.get("productPage")) < 1 ||
      searchParams.get("productPage") === "NaN"
    ) {
      console.log("ListProduct Page is not valid!!!");
    }

    if (
      Number(searchParams.get("userId")) <= 0 ||
      Number(searchParams.get("userId")) > 100
    ) {
      console.log("userId is not valid!!!");
    }

    if (
      Number(searchParams.get("productId")) <= 0 ||
      Number(searchParams.get("productId")) > 100
    ) {
      console.log("productId is not valid!!!");
    }

    let productP = searchParams.get("productPage") === "0" ||
      Number(searchParams.get("productPage")) > 5 ||
      Number(searchParams.get("productPage")) < 1 ||
      searchParams.get("productPage") === "NaN"
      ? "1"
      : searchParams.get("productPage");
    let userS = searchParams.get("userSearch") !== "null"
      ? searchParams.get("userSearch")
      : "";
    let productS = searchParams.get("productSearch") !== "null"
      ? searchParams.get("productSearch")
      : "";
    let uId = searchParams.get("userId") === "null" ||
      Number(searchParams.get("userId")) <= 0 ||
      Number(searchParams.get("userId")) > 100
      ? ""
      : searchParams.get("userId");
    let pId = searchParams.get("productId") === "null" ||
      Number(searchParams.get("productId")) <= 0 ||
      Number(searchParams.get("productId")) > 100
      ? ""
      : searchParams.get("productId");

    const [userPage, setUserPage] = useState(userP !== "1" ? Number(userP) : 1);
    const [productPage, setProductPage] = useState(
      productP !== "1" ? Number(productP) : 1,
    );
    const [userSearch, setUserSearch] = useState(userS);
    const [productSearch, setProductSearch] = useState(productS);
    const [userId, setUserId] = useState(uId);
    const [productId, setProductId] = useState(pId);

    const setUserPageFromCardList = (currentPage) => setUserPage(currentPage);
    const setProductPageFromCardList = (currentPage) =>
      setProductPage(currentPage);
    const setUserSearchFromCardList = (search) => setUserSearch(search);
    const setProductSearchFromCardList = (search) => setProductSearch(search);
    const setUserIdFromChildComponent = (value) => setUserId(value);
    const setProductIdFromChildComponent = (value) => setProductId(value);

    useEffect(() => {
      setSearchParams({
        userPage: userPage,
        productPage: productPage,
        userSearch: userSearch,
        productSearch: productSearch,
        userId: userId,
        productId: productId,
      });
    }, [userPage, productPage, userSearch, productSearch, userId, productId]);

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
                          cardId={userId}
                          page={userPage}
                          search={userSearch}
                          setId={setUserIdFromChildComponent}
                          setSearch={setUserSearchFromCardList}
                          setCurrentPage={setUserPageFromCardList}
                        />
                      </GridItem>
                      <GridItem rowSpan={1}>
                        <CardList
                          type="products"
                          cardId={productId}
                          page={productPage}
                          search={productSearch}
                          setId={setProductIdFromChildComponent}
                          setCurrentPage={setProductPageFromCardList}
                          setSearch={setProductSearchFromCardList}
                        />
                        <Box mt={4}>
                          <Cart
                            search={productSearch}
                            setSearch={setProductSearchFromCardList}
                          />
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
