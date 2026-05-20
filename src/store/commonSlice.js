import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastInfo: {},
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showToastAction: (state, action) => {
      state.toastInfo = action.payload;
    },
  },
});

export const { showToastAction } =
  commonSlice.actions;
export default commonSlice.reducer;
