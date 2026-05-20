import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.WALLET,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "Wallet", id: "LIST" }],
    }),

    getWalletByUser: builder.query({
      query: ({ userId, userType }) => ({
        method: "get",
        url: endPoints.WALLET,
        params: { userId, userType },
        showErrorToast: true,
      }),
      transformResponse: (response) => {
        const d = response?.data;
        if (Array.isArray(d)) return d[0] || null;
        if (d?.list && Array.isArray(d.list)) return d.list[0] || null;
        return d || null;
      },
      providesTags: (result) =>
        result?._id
          ? [{ type: "Wallet", id: result._id }, { type: "Wallet", id: "LIST" }]
          : [{ type: "Wallet", id: "LIST" }],
      keepUnusedDataFor: 0,
    }),

    getWalletById: builder.query({
      query: (id) => ({
        method: "get",
        url: endPoints.WALLET_BY_ID(id),
        showErrorToast: true,
      }),
      providesTags: (result, error, id) => [{ type: "Wallet", id }],
      keepUnusedDataFor: 0,
    }),

    updateWallet: builder.mutation({
      query: ({ id, data }) => ({
        method: "put",
        url: endPoints.WALLET_BY_ID(id),
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Wallet", id },
        { type: "Wallet", id: "LIST" },
      ],
    }),

    deleteWallet: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.WALLET_BY_ID(id),
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Wallet", id },
        { type: "Wallet", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletByUserQuery,
  useLazyGetWalletByUserQuery,
  useGetWalletByIdQuery,
  useLazyGetWalletByIdQuery,
  useUpdateWalletMutation,
  useDeleteWalletMutation,
} = walletApi;

export const walletApiUtil = walletApi.util;
