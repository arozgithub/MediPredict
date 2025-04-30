// src/context/UserContext.js

import { createContext, useState } from "react";

// Create a UserContext with a default value of null (no user data initially)
export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null); // Set the initial state as null

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children} {/* The context is passed down to child components */}
    </UserContext.Provider>
  );
}
