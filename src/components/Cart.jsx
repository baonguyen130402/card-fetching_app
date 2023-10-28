import { useContext, useEffect, useState } from "react";

import { UserIdContext } from "../App.jsx";
import { ProductContext } from "../App.jsx";
import axios from "axios";

export const Cart = () => {
  const [data, setData] = useState([{}]);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productName, setProductName } = useContext(ProductContext);

  const getData = async (userId) => {
    const dataGetFromEndPoint = await axios.get(
      `https://dummyjson.com/carts/user/${userId}`,
    );
    const products = dataGetFromEndPoint.data.carts[0].products;
    console.log(products);
    const dataRender = [];

    products.forEach((product) => {
      dataRender.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        total: product.total,
      });
    });

    setData(dataRender);
  };

  useEffect(() => {
    if (userId !== undefined) {
      getData(userId);
    }
  }, [userId]);

  return (
    <div className="p-4">
      <table className="border-collapse border border-slate-500">
        {Object.keys(data[0]).map((key, idx) => (
          <th key={idx} className="border bg-slate-600">
            {key}
          </th>
        ))}
        {data.map((product, idx) => (
          <tr
            key={idx}
            className="border"
            onClick={() => setProductName(product.title)}
          >
            {Object.values(product).map((el, idx) => (
              <th key={idx} className="border">
                {el}
              </th>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};
