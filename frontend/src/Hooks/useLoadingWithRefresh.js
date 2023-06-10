import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../app/authSlice";
import { getRefresh } from "../http";

export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await getRefresh();
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
