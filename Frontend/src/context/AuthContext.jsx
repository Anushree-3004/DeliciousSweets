import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  token: null,
  role: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  const login = (jwtToken, userRole) => {
    setToken(jwtToken);
    setRole(userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};