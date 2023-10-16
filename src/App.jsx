import { useState } from "react";
import "./App.css";

import { ListUserCards } from "./components/ListUserCards";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ListUserCards />
    </>
  );
}

export default App;
