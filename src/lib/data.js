import axios from "axios";

export const fetchAllData = async (type) => {
  try {
    const dataGetFromEndpoint = await axios.get(
      `https://dummyjson.com/${type}?limit=100`,
    );

    const d = [];

    if (type === "users") {
      dataGetFromEndpoint.data.users.forEach((user) => {
        d.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          cart: [],
        });
      });
    } else {
      dataGetFromEndpoint.data.products.forEach((product) => {
        d.push({
          id: product.id,
          name: `${product.title}`,
          image: product.images[0],
        });
      });
    }

    sessionStorage.setItem(`${type}`, JSON.stringify(d));
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(`Failed to fetch ${type} data.`);
  }
};

export const fetchProductData = async (cardId) => {
  try {
    const dataGetFromEndpoint = await axios.get(
      `https:dummyjson.com/users/${cardId}/carts`,
    );
    const d = dataGetFromEndpoint.data.carts;

    return d;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(`Failed to fetch card ${cardId} data.`);
  }
};
