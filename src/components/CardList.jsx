import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Card } from "./Card";

export const CardList = (prop) => {
  const { type } = prop;
  const [data, setData] = useState([]);
  const cardRendered = useRef(0);

  const fetchData = async (endpoint) => {
    const dataGetFromEndpoint = await axios.get(endpoint);
    const dataRender = [];

    let rawData;

    if (type === "users") {
      rawData = dataGetFromEndpoint.data.users;
      rawData.forEach((user) => {
        dataRender.push({
          name: `${user.firstName} ${user.lastName}`,
          image: `${user.image}`,
        });
      });
    } else if (type === "products") {
      rawData = dataGetFromEndpoint.data.products;
      rawData.forEach((product) => {
        dataRender.push({
          name: `${product.title}`,
          image: `${product.images[0]}`,
        });
      });
    }

    setData(dataRender);
  };

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

  useEffect(() => {
    fetchData(`https://dummyjson.com/${type}?limit=20`);
  }, []);

  return (
    <article>
      <section className="mb-4 flex justify-around">
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
      </section>
      <section className="container mx-auto columns-5">
        {data.map((user) => <Card name={user.name} image={user.image} />)}
      </section>
    </article>
  );
};
