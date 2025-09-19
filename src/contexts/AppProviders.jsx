import { useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

//implementing refresh token system was a pain. this took so long to work out.  

export default function AppProviders({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  //earlier way to handle refreshing.  Tried swapping to state, broke the app (:
  const attemptedRefreshRef = useRef(false);

  const apiRef = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { "Content-Type": "application/json" },
    })
  );

  const apiRefreshRef = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { "Content-type": "application/json" },
    })
  );

  useEffect(() => {
    console.log("mounting auth providers");
  }, []);

  //attach token to call
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

  //if response is 401, tries to refresh token in background before pushing the original call.
  useEffect(() => {
    const interceptor = apiRef.current.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !attemptedRefreshRef.current
        ) {
          try {
            attemptedRefreshRef.current = true;
            const refreshResponse = await apiRefreshRef.current.get(
              "refreshToken",
              {
                withCredentials: true,
              }
            );
            const { token: newToken, user: newUser } = refreshResponse.data;

            console.log("this is being called");

            setToken(newToken);
            setUser(newUser);

            config.headers.Authorization = `Bearer ${newToken}`;
            attemptedRefreshRef.current = false;
            return apiRef.current(config);
          } catch (err) {
            console.log("Token refresh failed:", err);
            attemptedRefreshRef.current = false;
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    const currentRef = apiRef.current;
    return () => {
      currentRef.interceptors.response.eject(interceptor);
    };
  }, []);

  //part of trying to get refreshing to work right and breaking race conditions.  Removing these caused token refreshing to not function.  Do I know why?  absolutely not
  // probably something to do with double mounting, app loading before token retrieval finished, rerouting it forces component to reload/remount, etc etc  (:
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //attempting to do refresh logging in, I'm tired of logging myself in
  useEffect(() => {
    const refreshLogin = async () => {
      attemptedRefreshRef.current = true;
      try {
        const response = await apiRefreshRef.current.get("refreshToken", {
          withCredentials: true,
        });

        const { token: tokenData, user: userData } = response.data;

        setToken(tokenData);
        setUser(userData);
        attemptedRefreshRef.current = false;

        setLoading(false); 
        navigate(pathname, { replace: true }); 
      } catch (err) {
        console.log(err);
        setToken(null);
        setUser(null);
        attemptedRefreshRef.current = false;
        setLoading(false); 
        navigate("/", { replace: true });
      }
    };

    if (!attemptedRefreshRef.current) {
      refreshLogin();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, setToken, api: apiRef.current, user, setUser}}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
