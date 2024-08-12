import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: null,
  setUser: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("AppWrapper user:", user); // Debugging: Check if user is being set correctly
  }, [user]);

  // Example of setting user (for demonstration)
  useEffect(() => {
    // Example: Fetch user data and set it
    // This should be replaced with real logic, such as fetching from an API
    const fetchedUser = {
      name: "John Doe",
      role: "Employer", // or "Employee"
    };
    setUser(fetchedUser);
    setIsAuthorized(true);
  }, []);

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
