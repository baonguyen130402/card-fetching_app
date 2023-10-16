import axios from "axios";
import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";

export const ListUserCards = () => {
  const [data, setData] = useState([]);

  const fetchData = async (endpoint) => {
    const dataGetFromEndpoint = await axios.get(endpoint);
    const users = dataGetFromEndpoint.data.users;
    const dataUsers = [];

    users.forEach((user) => {
      dataUsers.push({
        fullName: `${user.firstName} ${user.lastName}`,
        avatar: `${user.image}`,
      });
    });

    setData(dataUsers);
  };

  useEffect(() => {
    fetchData("https://dummyjson.com/users?limit=20");
  }, []);

  return (
    <div className="container mx-auto columns-5">
      {data.map((user) => (
        <UserCard fullName={user.fullName} avatar={user.avatar} />
      ))}
    </div>
  );
};
