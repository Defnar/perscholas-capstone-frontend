import { createContext } from "react";

const AuthContext = createContext({
  token: null,
  user: null,
  setUser: () => {},
  setToken: () => {},
  api: null
});

export default AuthContext;
