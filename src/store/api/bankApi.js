import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const bankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBankDetails: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.BANK_DETAILS,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "BankDetails", id: "LIST" }],
    }),

    getBankDetailsByMerchant: builder.query({
      query: ({ userId, userType }) => ({
        method: "get",
        url: endPoints.BANK_DETAILS,
        params: { userId, userType },
        showErrorToast: true,
      }),
      transformResponse: (response) => {
        const d = response?.data;
        return Array.isArray(d) ? d : (d?.list ?? []) || [];
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }) => ({ type: "BankDetails", id: _id })),
              { type: "BankDetails", id: "LIST" },
            ]
          : [{ type: "BankDetails", id: "LIST" }],
      keepUnusedDataFor: 120, // medium: list
    }),

    getBankDetailsById: builder.query({
      query: (id) => ({
        method: "get",
        url: endPoints.BANK_DETAILS_BY_ID(id),
        showErrorToast: true,
      }),
      providesTags: (result, error, id) => [{ type: "BankDetails", id }],
      keepUnusedDataFor: 120, // medium
    }),

    updateBankDetails: builder.mutation({
      query: ({ id, data }) => ({
        method: "put",
        url: endPoints.BANK_DETAILS_BY_ID(id),
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BankDetails", id },
        { type: "BankDetails", id: "LIST" },
      ],
    }),

    deleteBankDetails: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.BANK_DETAILS_BY_ID(id),
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "BankDetails", id },
        { type: "BankDetails", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateBankDetailsMutation,
  useGetBankDetailsByMerchantQuery,
  useLazyGetBankDetailsByMerchantQuery,
  useGetBankDetailsByIdQuery,
  useLazyGetBankDetailsByIdQuery,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
} = bankApi;

export const bankApiUtil = bankApi.util;
