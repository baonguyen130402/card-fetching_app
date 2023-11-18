import { useContext, useEffect, useState } from "react";

import UserIdContext from "../lib/contexts/user-id-context";

export const Card = (props) => {
  const { id, name, image } = props;
  const [shouldFocusThisCard, setShouldFocusThisCard] = useState(false);
  const { userId, setUserId } = useContext(UserIdContext);

  useEffect(() => {
    const shouldFocusUserId = localStorage.getItem("focus-user-id");
    setShouldFocusThisCard(id.toString() === shouldFocusUserId);
  }, [userId]); // [userId]

  const handleClick = () => {
    localStorage.setItem("focus-user-id", id);
    setUserId(id);
    console.log(shouldFocusThisCard);
  };

  return (
    <>
      {shouldFocusThisCard
        ? (
          <a
            onClick={handleClick}
            href="#"
            className="flex flex-col max-w-sm p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700"
          >
            <img
              className="w-32 mb-2 bg-transparent rounded-lg align-center mx-auto"
              src={image}
            />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {name}
            </p>
          </a>
        )
        : (
          <a
            onClick={handleClick}
            href="#"
            className="flex flex-col max-w-sm p-2 mb-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <img
              className="w-32 mb-2 bg-transparent rounded-lg align-center mx-auto"
              src={image}
            />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {name}
            </p>
          </a>
        )}
    </>
  );
};
