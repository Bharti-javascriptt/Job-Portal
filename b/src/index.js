import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import toast from "react-hot-toast";

export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: {},
  setUser: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  

  useEffect(() => {
    const initializeAuthState = () => {
      const storedUser = localStorage.getItem("user");
      console.log(storedUser)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const token = parsedUser.token;
          console.log(token)
          console.log(parsedUser)
          console.log(parsedUser.user)
          console.log(parsedUser.user.role)

          if (token) {
            setIsAuthorized(true);
            // settoken(parsedUser.token)
            setUser(parsedUser.user.role); // Ensure we're setting the user object correctly
            console.log("AppWrapper - User data set:", parsedUser.user); // Debugging line
            // console.log(user);
          } else {
            throw new Error("Token is missing");
          }
        } catch (error) {
          toast.error("Failed to parse user data. Please login again.");
          console.error("Error initializing auth state:", error);
          setIsAuthorized(false);
          setUser({});
        }
      } else {
        setIsAuthorized(false);
        setUser({});
      }
    };

    initializeAuthState();
    // console.log(user)
  },);

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
