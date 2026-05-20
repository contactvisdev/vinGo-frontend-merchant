import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const subCatalogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCatalogs: builder.query({
      query: (arg) => {
        const isObject = arg && typeof arg === "object";
        const catalogId = isObject ? arg.catalogId : arg;
        const merchantId = isObject ? arg.merchantId : undefined;
        return {
          method: "get",
          url: endPoints.SUB_CATALOG,
          params: {
            ...(catalogId ? { catalogId } : {}),
            ...(merchantId ? { merchantId } : {}),
          },
          showErrorToast: true,
        };
      },
      transformResponse: (response) => response?.data || [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }) => ({ type: "SubCatalog", id: _id })),
              { type: "SubCatalog", id: "LIST" },
            ]
          : [{ type: "SubCatalog", id: "LIST" }],
      keepUnusedDataFor: 180,
    }),

    getSubCatalogById: builder.query({
      query: (id) => ({
        method: "get",
        url: endPoints.SUB_CATALOG_BY_ID(id),
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || null,
      providesTags: (result, error, id) => [{ type: "SubCatalog", id }],
      keepUnusedDataFor: 180,
    }),

    createSubCatalog: builder.mutation({
      query: (data) => ({
        method: "post",
        url: `${endPoints.SUB_CATALOG}/`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "SubCatalog", id: "LIST" }],
    }),

    updateSubCatalog: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: endPoints.SUB_CATALOG_BY_ID(id),
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubCatalog", id },
        { type: "SubCatalog", id: "LIST" },
      ],
    }),

    deleteSubCatalog: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.SUB_CATALOG_BY_ID(id),
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SubCatalog", id },
        { type: "SubCatalog", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubCatalogsQuery,
  useLazyGetSubCatalogsQuery,
  useGetSubCatalogByIdQuery,
  useLazyGetSubCatalogByIdQuery,
  useCreateSubCatalogMutation,
  useUpdateSubCatalogMutation,
  useDeleteSubCatalogMutation,
} = subCatalogApi;
