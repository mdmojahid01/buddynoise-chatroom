import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import activate from "./activateSlice";
import toastObj from "./toastSlice";

export const store = configureStore({
  reducer: { auth, activate, toastObj },
});
