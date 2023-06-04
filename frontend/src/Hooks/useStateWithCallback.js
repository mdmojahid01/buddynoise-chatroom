import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;
    setState((old) => {
      return typeof newState === "function" ? newState(old) : newState;
    });
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
