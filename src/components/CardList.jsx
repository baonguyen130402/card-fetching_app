import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Card } from "./Card";

export const CardList = (prop) => {
  const { type } = prop;
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState();
  const cardRendered = useRef(0);
  const inputValue = useRef("");

  const fetchData = async (endpoint) => {
    const dataGetFromEndpoint = await axios.get(endpoint);
    const dataRender = [];

    let rawData;

    if (type === "users") {
      rawData = dataGetFromEndpoint.data.users;
      rawData.forEach((user) => {
        dataRender.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        });
      });
    } else if (type === "products") {
      rawData = dataGetFromEndpoint.data.products;
      rawData.forEach((product) => {
        dataRender.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
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

  console.log(userId);

  return (
    <article>
      <section className="mb-4">
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickNext}>Next</button>
        <div className="my-3">
          <input
            type="search"
            name={type}
            className="px-4 py-2 border-none outline-none rounded-lg focus:bg-gray-700"
            placeholder="Input name"
            onChange={(event) => {
              let searchString = event.target.value;

              if (searchString.length !== 0) {
                fetchData(
                  `https://dummyjson.com/${type}/search?q=${searchString}`,
                );
              } else {
                fetchData(
                  `https://dummyjson.com/${type}?limit=20&skip=${cardRendered.current}`,
                );
              }
            }}
          />
        </div>
      </section>
      <section className="grid grid-cols-4 gap-2">
        {data.map((object) => (
          <Card
            key={object.id}
            name={object.name}
            image={object.image}
          />
        ))}
      </section>
    </article>
  );
};
