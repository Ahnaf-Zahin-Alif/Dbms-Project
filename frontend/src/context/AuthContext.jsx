import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        return { id: decoded.user_id, username: decoded.username || "User" };
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access_token"));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  const login = async (username, password) => {
    const res = await api.post("/api/token/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setAccessToken(res.data.access);
    try {
      const decoded = jwtDecode(res.data.access);
      setUser({ id: decoded.user_id, username: decoded.username || username });
    } catch {
      setUser({ username });
    }
    setIsAuthModalOpen(false);
    return res.data;
  };

  const register = async (username, password) => {
    const res = await api.post("/api/user/register/", { username, password });
    await login(username, password);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setUser(null);
  };

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
