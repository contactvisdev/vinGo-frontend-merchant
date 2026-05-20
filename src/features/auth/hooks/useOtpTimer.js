import { useState, useEffect } from "react";

const OTP_EXPIRATION_KEY = "otpExpirationTime";
const OTP_DURATION_SECONDS = 60;
const OTP_DURATION_MS = OTP_DURATION_SECONDS * 1000;

const getStoredTimeLeft = () => {
  const expiration = sessionStorage.getItem(OTP_EXPIRATION_KEY);
  if (!expiration) return null;
  return Math.max(0, Math.floor((parseInt(expiration) - Date.now()) / 1000));
};

const startNewExpiration = () => {
  const expiration = Date.now() + OTP_DURATION_MS;
  sessionStorage.setItem(OTP_EXPIRATION_KEY, expiration.toString());
  return OTP_DURATION_SECONDS;
};

export const useOtpTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = getStoredTimeLeft();
    if (stored !== null) return stored;
    return startNewExpiration();
  });

  const resetTimer = () => {
    setTimeLeft(startNewExpiration());
  };

  const clearTimer = () => {
    sessionStorage.removeItem(OTP_EXPIRATION_KEY);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      sessionStorage.removeItem(OTP_EXPIRATION_KEY);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          sessionStorage.removeItem(OTP_EXPIRATION_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return {
    timeLeft,
    resetTimer,
    clearTimer,
    isExpired: timeLeft === 0,
  };
};

