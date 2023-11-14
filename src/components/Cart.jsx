import { useContext, useEffect, useState } from "react";

// TODO: Update imports.
import { UserIdContext } from "../App.jsx";
import { ProductContext } from "../App.jsx";
import axios from "axios";

export const Cart = () => {
  const [data, setData] = useState([{}]);
  const { userId, setUserId } = useContext(UserIdContext);
  const { productName, setProductName } = useContext(ProductContext);
  const cartTableKeys = Object.keys(data[0]);

  const getData = async (userId) => {
    const dataGetFromEndPoint = await axios.get(
      `https://dummyjson.com/carts/user/${userId}`,);
    const products = dataGetFromEndPoint.data.carts[0].products;
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
        {cartTableKeys.map((key, idx) => (
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
              // FIXME: Error in console.
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
