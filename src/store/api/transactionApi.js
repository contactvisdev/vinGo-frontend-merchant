import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsByUser: builder.query({
      query: ({ userId, userType, direction }) => {
        const searchParams = new URLSearchParams({
          userId,
          userType,
          ...(direction ? { direction } : {}),
        });
        return {
        method: "get",
        url: `${endPoints.TRANSACTION}?${searchParams.toString()}`,
        showErrorToast: true,
        };
      },
      transformResponse: (response) => {
        const d = response?.data;
        return Array.isArray(d) ? d : (d?.list ?? []) || [];
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }) => ({ type: "Transaction", id: _id })),
              { type: "Transaction", id: "LIST" },
            ]
          : [{ type: "Transaction", id: "LIST" }],
      keepUnusedDataFor: 0,
    }),

    getTransactionById: builder.query({
      query: (id) => ({
        method: "get",
        url: endPoints.TRANSACTION_BY_ID(id),
        showErrorToast: true,
      }),
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
      keepUnusedDataFor: 0,
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.TRANSACTION_BY_ID(id),
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Transaction", id },
        { type: "Transaction", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTransactionsByUserQuery,
  useLazyGetTransactionsByUserQuery,
  useGetTransactionByIdQuery,
  useLazyGetTransactionByIdQuery,
  useDeleteTransactionMutation,
} = transactionApi;

export const transactionApiUtil = transactionApi.util;
