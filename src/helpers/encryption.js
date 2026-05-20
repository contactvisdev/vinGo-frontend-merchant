import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error('VITE_ENCRYPTION_KEY environment variable is required. Refusing to start without encryption key.');
}

export const encryptData = (data) => {
  try {
    if (!data) return data;
    
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Encryption error:', error);
    }
    throw new Error('Encryption failed. Check VITE_ENCRYPTION_KEY configuration.');
  }
};

export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return encryptedData;
    
    if (typeof encryptedData !== 'string') {
      return encryptedData;
    }
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!jsonString) {
      if (import.meta.env.DEV) {
        console.warn('decryptData: decryption produced empty result — possible key mismatch');
      }
      return null;
    }

    return JSON.parse(jsonString);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('decryptData failed:', error.message);
    }
    return null;
  }
};

const keyCache = new Map();

export const encryptKey = (key) => {
  try {
    if (!key || typeof key !== 'string') return key;
    if (keyCache.has(key)) return keyCache.get(key);
    const encrypted = CryptoJS.SHA256(key + ENCRYPTION_KEY).toString();
    const result = encrypted.substring(0, 32);
    keyCache.set(key, result);
    return result;
  } catch (error) {
    console.error('Key encryption error:', error);
    return key;
  }
};

export const createEncryptedStorage = (storage) => ({
  async getItem(key) {
    const encryptedKey = encryptKey(key);
    return storage.getItem(encryptedKey);
  },
  async setItem(key, value) {
    const encryptedKey = encryptKey(key);
    return storage.setItem(encryptedKey, value);
  },
  async removeItem(key) {
    const encryptedKey = encryptKey(key);
    return storage.removeItem(encryptedKey);
  },
});

