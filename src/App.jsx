import { createContext, useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";
import { Cart } from "./components/Cart";
import {UserIdObserver} from './lib/contexts'

export const ProductContext = createContext();

const App = () => {
  const [productName, setProductName] = useState("");

  return (
    <main className="grid grid-cols-2 gap-4">
      <UserIdObserver>
        <ProductContext.Provider value={{ productName, setProductName }}>
          <CardList type="users" />
          <div className="flex flex-col items-center col-span-1 col-start-2">
            <CardList type="products" />
            <Cart />
          </div>
        </ProductContext.Provider>
      </UserIdObserver>
    </main>
  );
};

export default App;
