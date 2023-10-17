import { useState } from "react";
import "./App.css";

import { CardList } from "./components/CardList";

function App() {
  return (
    <>
      <article className="grid grid-cols-2 gap-4">
        <section className="">
          <CardList type="users" />
        </section>
        <section className="">
          <CardList type="products" />
        </section>
      </article>
    </>
  );
}

export default App;
