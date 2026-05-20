import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetWalletByUserQuery } from "@/store/api/walletApi";
import { useGetTransactionsByUserQuery } from "@/store/api/transactionApi";

export function useWalletData() {
  const merchantId = useSelector(
    (state) => state.businessProfile?.profile?._id,
  );

  const { data: wallet, isLoading: walletLoading } = useGetWalletByUserQuery(
    { userId: merchantId, userType: "MERCHANT" },
    { skip: !merchantId },
  );

  return {
    wallet,
    loading: walletLoading,
    merchantId,
  };
}

export function useTransactions(direction) {
  const merchantId = useSelector(
    (state) => state.businessProfile?.profile?._id,
  );

  const queryParams = useMemo(
    () => ({
      userId: merchantId,
      userType: "MERCHANT",
      ...(direction ? { direction } : {}),
    }),
    [direction, merchantId], 
  );

  const { data: transactions = [], isLoading } = useGetTransactionsByUserQuery(
    queryParams,
    {
      skip: !merchantId,
      refetchOnMountOrArgChange: true,
    },
  );

  return {
    transactions,
    loading: isLoading,
    merchantId,
  };
}
