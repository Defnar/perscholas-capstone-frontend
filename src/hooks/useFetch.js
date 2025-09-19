import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";

const useFetch = (url, params) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { api, token, user } = useContext(AuthContext);

  useEffect(() => {
    setError(null);
    setData(null);
    setLoading(true);

    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await api.get(url, params);

        if (!ignore) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      ignore = true;
      setLoading(false);
    };
  }, [api, url, params, token, user]);

  return [data, loading, error];
};

export default useFetch;
