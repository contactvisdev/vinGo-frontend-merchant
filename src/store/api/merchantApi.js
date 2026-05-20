import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

export const merchantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantsByOwner: builder.query({
      query: (ownerId) => ({
        url: endPoints.GET_MERCHANTS_BY_OWNER,
        method: "GET",
        params: { OwnerId: ownerId },
        showErrorToast: true,
        showSuccessToast: false,
      }),
      providesTags: ["Merchant"],
      transformResponse: (response) => response?.data?.list || [],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetMerchantsByOwnerQuery } = merchantApi;
