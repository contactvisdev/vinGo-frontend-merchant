import { encryptKey, encryptData, decryptData } from "./encryption";

const ENCRYPTED_APP_TOKEN_KEY = encryptKey("appToken");

export const login = (token, next) => {
  try {
    if (token) {
      localStorage.setItem(ENCRYPTED_APP_TOKEN_KEY, encryptData(token));
    }
    if (next && typeof next === 'function') {
      next();
    }
  } catch {
    return false;
  }
};

export const isAuthenticated = () => {
  try {
    if (typeof window == "undefined") {
      return false;
    }
    const localToken = localStorage.getItem(ENCRYPTED_APP_TOKEN_KEY);
    if (localToken) {
      return decryptData(localToken);
    }
    const sessionToken = sessionStorage.getItem(ENCRYPTED_APP_TOKEN_KEY);
    if (sessionToken) {
      return decryptData(sessionToken);
    }
    return false;
  } catch {
    return false;
  }
};

import { resetBusinessProfile } from "@/store/businessProfileSlice";
import { store, persistor as storePersistor } from "@/store";

export const logout = async (next, dispatch, persistor) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ENCRYPTED_APP_TOKEN_KEY);
    sessionStorage.removeItem(ENCRYPTED_APP_TOKEN_KEY);
    
    try {
      if (dispatch) {
        dispatch(resetBusinessProfile());
        if (persistor) {
          await persistor.purge();
        }
      } else {
        store.dispatch(resetBusinessProfile());
        if (storePersistor) {
          await storePersistor.purge();
        }
      }
    } catch (error) {
      console.error("Error clearing Redux state during logout:", error);
    }
    
    if (next && typeof next === 'function') {
      next();
    }
  }
};
