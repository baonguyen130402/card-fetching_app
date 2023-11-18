import { createContext, useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";
import { Cart } from "./components/Cart";

import UserIdObserver from "./lib/contexts/user-id-context";
import ProductNameProvider from "./lib/contexts/ProductNameContext.tsx";

const App = () => {
  return (
    <main className="grid grid-cols-2 gap-4">
      <UserIdObserver>
        <ProductNameProvider>
          <CardList type="users" />
          <div className="flex flex-col items-center col-span-1 col-start-2">
            <CardList type="products" />
            <Cart />
          </div>
        </ProductNameProvider>
      </UserIdObserver>
    </main>
  );
};

export default App;
