import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  autoClose: 2000,
};

export const authSlice = createSlice({
  name: "toastObj",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
// export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
