import React, { createContext, useState, useEffect } from "react";
import keycloak, { initKeycloak } from "../api/keycloak";
import { syncUser, getUserInfo } from "../api/users";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initKeycloak(async () => {
      try {
        setAuthenticated(keycloak.authenticated);
        const token = keycloak.token;

        const userData = await syncUser(token);

        // const userData = await getUserInfo(token);
        setUser(userData);
      } catch (error) {
        console.error("User initialization failed:", error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <UserContext.Provider value={{ user, setUser, authenticated, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
