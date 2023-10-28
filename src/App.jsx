import { createContext, useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";
import { Cart } from "./components/Cart";

export const UserIdContext = createContext();
export const ProductContext = createContext();

const App = () => {
  const [userId, setUserId] = useState();
  const [productName, setProductName] = useState("");

  return (
    <main className="grid grid-cols-2 gap-4">
      <UserIdContext.Provider value={{ userId, setUserId }}>
        <ProductContext.Provider value={{ productName, setProductName }}>
          <CardList type="users" />
          <div className="flex flex-col items-center">
            <CardList type="products" />
            <Cart />
          </div>
        </ProductContext.Provider>
      </UserIdContext.Provider>
    </main>
  );
};

export default App;
