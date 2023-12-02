import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { ProductNameContext } from "../lib/contexts/ProductNameContext.tsx";

export const CardList = (prop) => {
  const { type } = prop;

  const { productName, setProductName } = useContext(ProductNameContext);
  const [data, setData] = useState([]);
  const cardRendered = useRef(0);

  const fetchData = async (endpoint) => {
    const dataGetFromEndpoint = await axios.get(endpoint);
    const d = [];

    if (type === "users") {
      dataGetFromEndpoint.data.users.forEach((user) => {
        d.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        });
      });
    } else if (type === "products") {
      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
        });
      });
    }

    setData(d);
  };

  useEffect(() => {
    try {
      fetchData(`https://dummyjson.com/${type}?limit=20`);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (productName !== "" && type === "products") {
      fetchData(
        `https://dummyjson.com/${type}/search?q=${productName}`,
      );
    }
  }, [productName]);

  const handleClickPrev = () => {
    if (cardRendered.current !== 0) {
      cardRendered.current -= 20;

      fetchData(
        `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
      );
    } else {
      alert("This is first page");
    }
  };

  const handleClickNext = () => {
    if (cardRendered.current <= 60) {
      cardRendered.current += 20;

      fetchData(
        `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
      );
    } else {
      alert("This is last page");
    }
  };

  return (
    <article className="mb-4">
      <section className="mb-4">
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
        <div className="my-3">
          <input
            type="search"
            name={type}
            className="px-4 py-2 border-none outline-none rounded-lg focus:bg-gray-700"
            placeholder="Input name"
            onChange={async (event) => {
              let searchString = event.target.value;

              if (searchString.length !== 0) {
                await fetchData(
                  `https://dummyjson.com/${type}/search?q=${searchString}`,
                );
              } else {
                await fetchData(
                  `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
                );
              }
            }}
          />
        </div>
      </section>

      <section className="grid grid-cols-4 gap-2 md:gap-y-0 h-screen overflow-y-auto">
        {data.map((item) => (
          <Card
            id={item.id}
            key={item.id}
            name={item.name}
            image={item.image}
          />
        ))}
      </section>
    </article>
  );
};
