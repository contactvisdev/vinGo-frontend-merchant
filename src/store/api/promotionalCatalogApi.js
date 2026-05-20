import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const promotionalCatalogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromotionalCatalogsByMerchant: builder.query({
      query: (merchantId) => ({
        method: "get",
        url: endPoints.PROMOTIONAL_CATALOG,
        params: { merchantId },
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }) => ({ type: "PromotionalCatalog", id: _id })),
              { type: "PromotionalCatalog", id: "LIST" },
            ]
          : [{ type: "PromotionalCatalog", id: "LIST" }],
      keepUnusedDataFor: 180, // medium-high: promo catalog
    }),

    createPromotionalCatalog: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.PROMOTIONAL_CATALOG,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "PromotionalCatalog", id: "LIST" }],
    }),

    updatePromotionalCatalog: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: `${endPoints.PROMOTIONAL_CATALOG}/${id}`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PromotionalCatalog", id },
        { type: "PromotionalCatalog", id: "LIST" },
      ],
    }),

    deletePromotionalCatalog: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: `${endPoints.PROMOTIONAL_CATALOG}/${id}`,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PromotionalCatalog", id },
        { type: "PromotionalCatalog", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPromotionalCatalogsByMerchantQuery,
  useCreatePromotionalCatalogMutation,
  useUpdatePromotionalCatalogMutation,
  useDeletePromotionalCatalogMutation,
} = promotionalCatalogApi;
