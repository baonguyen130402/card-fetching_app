import { createContext, useState } from "react";

export const UserIdContext = createContext({
  userId: undefined,
  setUserId: () => {}
});

export default function UserIdObserver({children}) {
    const [userId, setUserId] = useState();
    
    return (
        <UserIdContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserIdContext.Provider>
    )
}