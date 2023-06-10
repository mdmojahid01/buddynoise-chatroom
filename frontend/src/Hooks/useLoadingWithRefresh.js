import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../app/authSlice";
import axios from "axios";

export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASEURL}/api/refresh`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAuth(response.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
}
