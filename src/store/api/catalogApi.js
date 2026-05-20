import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const normalizeCatalogQueryArgs = (args) => {
  if (typeof args === "string") {
    return { merchantId: args };
  }

  return {
    merchantId: args?.merchantId,
    productTypeId: args?.productTypeId,
  };
};

const catalogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogsByMerchant: builder.query({
      query: (args) => {
        const { merchantId, productTypeId } = normalizeCatalogQueryArgs(args);

        return {
        method: "get",
        url: endPoints.CATALOG,
        params: {
          ...(merchantId ? { merchantId } : {}),
          ...(productTypeId ? { productTypeId } : {}),
        },
        showErrorToast: true,
      };
      },
      transformResponse: (response) => response?.data || [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }) => ({ type: "Catalog", id: _id })),
              { type: "Catalog", id: "LIST" },
            ]
          : [{ type: "Catalog", id: "LIST" }],
      keepUnusedDataFor: 180, 
    }),

    createCatalog: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.CATALOG,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "Catalog", id: "LIST" }],
    }),

    updateCatalog: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: `${endPoints.CATALOG}/${id}`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Catalog", id },
        { type: "Catalog", id: "LIST" },
      ],
    }),

    deleteCatalog: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: `${endPoints.CATALOG}/${id}`,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Catalog", id },
        { type: "Catalog", id: "LIST" },
      ],
    }),

    reorderCatalogs: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.REORDER_CATALOGS,
        data: { catalogs: data.catalogs },
        showErrorToast: true,
      }),
      async onQueryStarted({ catalogs, merchantId }, { dispatch, queryFulfilled }) {
        const orderMap = new Map(catalogs.map((c) => [c.id, c.sortOrder]));
        const patchResult = dispatch(
          catalogApi.util.updateQueryData("getCatalogsByMerchant", merchantId, (draft) => {
            draft.sort((a, b) => {
              const orderA = orderMap.get(a._id) ?? Infinity;
              const orderB = orderMap.get(b._id) ?? Infinity;
              return orderA - orderB;
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCatalogsByMerchantQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
  useReorderCatalogsMutation,
} = catalogApi;
