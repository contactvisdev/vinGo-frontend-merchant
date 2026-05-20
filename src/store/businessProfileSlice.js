import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
};

export const businessProfileSlice = createSlice({
  name: "businessProfile",
  initialState,
  reducers: {
    resetBusinessProfile: () => initialState,
    setBusinessProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateMerchantProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        merchant: {
          ...state.profile?.merchant,
          ...action.payload,
        },
      };
    },
  },
});

export const { resetBusinessProfile, setBusinessProfile, updateMerchantProfile } = businessProfileSlice.actions;
export default businessProfileSlice.reducer;

