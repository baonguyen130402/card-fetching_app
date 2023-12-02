import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Cart } from "./Cart.jsx";
import { CardList } from "./CardList.jsx";
import { ProductCard } from "./ProductCard.jsx";

import UserIdObserver from "../lib/contexts/user-id-context.tsx";
import ProductProvider from "../lib/contexts/ProductNameContext.tsx";
import ProductCartProvider from "../lib/contexts/ProductCartContext.tsx";

export default function Router() {
  const Layout = () => {
    return (
      <main className="grid grid-cols-2 gap-4">
        <UserIdObserver>
          <ProductProvider>
            <ProductCartProvider>
              <CardList type="users" />
              <div className="h-screen">
                <div className="h-1/2 overflow-y-hidden">
                  <CardList type="products" />
                </div>
                <div className="h-1/2">
                  <Cart />
                </div>
              </div>
            </ProductCartProvider>
          </ProductProvider>
        </UserIdObserver>
      </main>
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
