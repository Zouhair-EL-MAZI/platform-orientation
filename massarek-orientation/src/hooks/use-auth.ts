import { useState, useEffect } from "react";

export const useAuth = () => {
  const getToken = () => localStorage.getItem("token");
  const getUser = () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(!!getToken());
      setUser(getUser());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (userData: any, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
};