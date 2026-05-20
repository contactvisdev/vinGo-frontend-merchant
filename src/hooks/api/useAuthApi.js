import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { login } from "@/helpers/auth";
import { showToastAction } from "@/store/commonSlice";
import { setBusinessProfile, updateMerchantProfile } from "@/store/businessProfileSlice";
import { setOwnerProfile, setMerchantExists } from "@/store/ownerProfileSlice";

export const useAuthApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const getSignal = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  }, []);

  const loginUser = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...data,
          role: data?.role ?? "owner",
        };
        const result = await authService.login(payload, { signal: getSignal() });
        if (result?.data?.token) {
          login(result.data.token);
        }
        if (result?.data?.user) {
          dispatch(setOwnerProfile({
            ...result.data,
            user: { ...result.data.user, role: payload?.role }
          }));
        }

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "Login successful",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Something went wrong";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const requestMobileOtp = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.requestMobileOtp(data, { signal: getSignal() });

        if (result?.data?.token) {
          login(result.data.token);
        }

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "OTP sent successfully",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage =
          err?.message || "Something went wrong while sending OTP";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.register(data, { signal: getSignal() });

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "Merchant is added successfully",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error adding merchant";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const checkMerchantExists = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const role = data?.role ?? "owner";
        const payload = { ...data, role };
        const result = await authService.checkMerchantExists(payload, { signal: getSignal() });
        const merchantExist = result?.data?.exists;
        dispatch(setMerchantExists(merchantExist));

        if (merchantExist) {
          await requestMobileOtp(payload, () => {
            navigate("/otp-verification", {
              state: { merchantData: data?.phone, isExisting: true, role },
            });
          });
        } else {
          await register(payload, () => {
            navigate("/otp-verification", {
              state: { merchantData: data?.phone, isExisting: false, role },
            });
          });
        }

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error checking merchant";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate, requestMobileOtp, register]
  );

  const verifyOtp = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...data,
          role: data?.role ?? "owner",
        };
        const result = await authService.verifyOtp(payload, { signal: getSignal() });

        if (result?.data?.token) {
          login(result.data.token);
        }

        if (result?.data?.user) {
          dispatch(setBusinessProfile(result.data.user));
        }

        if (result?.data) {
          dispatch(setOwnerProfile({
            ...result.data,
            user: { ...result.data.user, role: payload?.role }
          }));
        }

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "OTP verified successfully",
          })
        );

        navigate("/select-category");

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "OTP verification failed";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const resendOtp = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...data,
          role: data?.role ?? "owner",
        };
        const result = await authService.resendOtp(payload, { signal: getSignal() });

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "OTP resent successfully",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Failed to resend OTP";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const updateMerchant = useCallback(
    async (data, id, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.updateMerchant(data, id, { signal: getSignal() });

        if (result?.data) {
          dispatch(updateMerchantProfile(result.data));
        }

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error updating merchant";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const createMerchant = useCallback(
    async (data, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.createMerchant(data, { signal: getSignal() });

        if (result?.data) {
          const { merchant, ownerDetails, existingBusinesses } = result.data;
          const profileData = {
            ownerDetails,
            merchant,
            existingBusinesses: existingBusinesses || [],
          };
          dispatch(setBusinessProfile(profileData));
        }

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "Merchant created successfully",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error creating merchant";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const deleteMerchant = useCallback(
    async (ids, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.deleteMerchant({ ids }, { signal: getSignal() });

        dispatch(
          showToastAction({
            type: "success",
            title: result?.message || "Merchant deleted successfully",
          })
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error deleting merchant";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const getMerchantsByOwner = useCallback(
    async (ownerId, categoryId = null, onSuccess) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.getMerchantsByOwner(ownerId, categoryId, { signal: getSignal() });

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err?.message || "Error fetching merchants";
        setError(errorMessage);
        dispatch(
          showToastAction({
            type: "error",
            title: errorMessage,
          })
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return {
    loading,
    error,
    loginUser,
    requestMobileOtp,
    register,
    checkMerchantExists,
    verifyOtp,
    resendOtp,
    updateMerchant,
    createMerchant,
    deleteMerchant,
    getMerchantsByOwner,
  };
};
