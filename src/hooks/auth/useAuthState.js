import { useSelector } from "react-redux";

export const useAuthState = () => {
  const profile = useSelector((state) => state?.businessProfile?.profile ?? null);

  return {
    profile,
    isAuthenticated: !!profile,
  };
};
