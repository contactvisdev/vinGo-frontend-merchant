import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore, persistReducer, createTransform,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import commonReducer from "@/store/commonSlice";
import businessProfileReducer from "@/store/businessProfileSlice";
import ownerProfileReducer from "@/store/ownerProfileSlice";
import notificationReducer from "@/store/notificationSlice";
import { encryptData, decryptData, createEncryptedStorage } from "@/helpers/encryption";
import { apiSlice } from "@/store/api/apiSlice";
import onboardingReducer from "@/features/onboarding-v2/store/onboardingSlice";


const encryptedStorage = createEncryptedStorage(storage);

const encryptTransform = createTransform(
  (inboundState, key) => {
    return encryptData(inboundState);
  },
  (outboundState, key) => {
    return decryptData(outboundState);
  },
);

const businessProfilePersistConfig = {
  key: "businessProfile",
  storage: encryptedStorage,
  whitelist: ["profile"],
  transforms: [encryptTransform],
};

const ownerProfilePersistConfig = {
  key: "ownerProfile",
  storage: encryptedStorage,
  whitelist: ["profile", "merchantExists"],
  transforms: [encryptTransform],
};

const onboardingPersistConfig = {
  key: "onboarding",
  storage: encryptedStorage,
  transforms: [encryptTransform],
};

const persistedBusinessProfileReducer = persistReducer(businessProfilePersistConfig, businessProfileReducer);
const persistedOwnerProfileReducer = persistReducer(ownerProfilePersistConfig, ownerProfileReducer);
const persistedOnboardingReducer = persistReducer(onboardingPersistConfig, onboardingReducer);

export const store = configureStore({
  reducer: {
    businessProfile: persistedBusinessProfileReducer,
    ownerProfile: persistedOwnerProfileReducer,
    common: commonReducer,
    notification: notificationReducer,
    onboarding: persistedOnboardingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export default store;
