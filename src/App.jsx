import { useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";
import { Cart } from "./components/Cart";
import { cartData } from "./data/CartData";

function App() {
  return (
    <>
      <main className="grid grid-cols-2 gap-4">
        <CardList type="users" />
        <article className="grid grid-cols-1">
          <CardList type="products" />
          <Cart data={cartData} />
        </article>
      </main>
    </>
  );
}

export default App;
