import { useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

export default function AppProviders({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const apiRef = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { "Content-Type": "application/json" },
    })
  );

  
  useEffect(() => {
    console.log("mounting auth providers")
  }, [])

  useEffect(() => {
    const interceptor = apiRef.current.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    const currentRef = apiRef.current;

    return () => {
      currentRef.interceptors.request.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, api: apiRef.current, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
