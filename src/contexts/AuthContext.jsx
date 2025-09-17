import { createContext } from "react";

const AuthContext = createContext({
  token: null,
  user: null,
});

export default AuthContext;
