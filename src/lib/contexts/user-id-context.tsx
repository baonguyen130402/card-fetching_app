import React from "react";
import {} from "react";
import { createContext, useState } from "react";

interface Props {
  userId: any;
  setUserId: (value) => void;
}

export const UserIdContext = createContext<Props>({
  userId: undefined,
  setUserId: () => {},
});

export default function UserIdObserver({ children }) {
  const [userId, setUser] = useState("");

  return (
    <UserIdContext.Provider
      value={{
        userId,
        setUserId: (value) => {
          setUser(value);
        },
      }}
    >
      {children}
    </UserIdContext.Provider>
  );
}
