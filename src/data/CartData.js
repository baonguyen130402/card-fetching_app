import axios from "axios";

const getData = async (userId) => {
  const dataGetFromEndpoint = await axios.get(
    `https://dummyjson.com/carts/user/${userId}`,
  );

  localStorage.setItem("cartData", JSON.stringify(dataGetFromEndpoint.data));
  location.reload();
};

const cartData = localStorage.getItem("cartData");

export { cartData, getData };
