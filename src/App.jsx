import { createContext, useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";
import { Cart } from "./components/Cart";

export const UserIdContext = createContext();
export const ProductContext = createContext();

const App = () => {
  const [userId, setUserId] = useState();
  const [productName, setProductName] = useState();

  return (
    <main className="grid grid-cols-2 gap-4">
      <UserIdContext.Provider value={{ userId, setUserId }}>
        <CardList type="users" />
        <div className="flex flex-col items-center">
          <ProductContext.Provider value={{ productName, setProductName }}>
            <CardList type="products" />
            <Cart />
          </ProductContext.Provider>
        </div>
      </UserIdContext.Provider>
    </main>
  );
};

export default App;
