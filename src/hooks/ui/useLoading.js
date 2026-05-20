import { useState, useCallback } from "react";

export const useLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);

  const withLoading = useCallback(async (asyncFn) => {
    try {
      setLoading(true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return [loading, setLoading, withLoading];
};

export const useMultipleLoading = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = useCallback((key, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setAllLoading = useCallback((value) => {
    setLoadingStates((prev) => {
      const newStates = {};
      Object.keys(prev).forEach((key) => {
        newStates[key] = value;
      });
      return newStates;
    });
  }, []);

  return {
    loadingStates,
    setLoading,
    setAllLoading,
  };
};

