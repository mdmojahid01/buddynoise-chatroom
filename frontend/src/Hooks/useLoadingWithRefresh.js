import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../app/authSlice";
import axios from "axios";
// import { toast } from "react-toastify";

export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const t = useSelector((s) => s.toastObj);
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
        console.log(err.message);
        // toast.error(err.message, t);
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
}
