import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
  merchantExists: false,
  merchants: [],
};

export const ownerProfileSlice = createSlice({
  name: "ownerProfile",
  initialState,
  reducers: {
    resetOwnerProfile: () => initialState,
    setOwnerProfile: (state, action) => {
      state.profile = action.payload?.user || action.payload || {};
    },
    setMerchantExists: (state, action) => {
      state.merchantExists = action.payload;
    },
    setExistingMerchants: (state, action) => {
      state.merchants = action.payload || [];
    },
  },
});

export const { resetOwnerProfile, setOwnerProfile, setMerchantExists, setExistingMerchants } =
  ownerProfileSlice.actions;
export default ownerProfileSlice.reducer;

