import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const menuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({
        categoryId,
        itemType,
        merchantId,
        catalogId,
        productTypeId,
        page = 1,
        limit = 10,
        searchName,
      }) => ({
        method: "get",
        url: endPoints.ITEMS,
        params: {
          categoryId,
          itemType,
          merchantId,
          page,
          limit,
          ...(catalogId && { catalogId }),
          ...(productTypeId && { productTypeId }),
          ...(searchName && { name: searchName }),
        },
        showErrorToast: true,
      }),
      transformResponse: (response) => ({
        list: response?.data?.list || [],
        pagination: response?.data?.pagination || {},
        totalItems: response?.data?.totalItemTypeCount || 0,
        catalogCounts: response?.data?.catalogCounts || [],
      }),
      providesTags: (result) =>
        result?.list
          ? [
              ...result.list.map(({ _id }) => ({
                type: "MenuItem",
                id: _id,
              })),
              { type: "MenuItem", id: "LIST" },
            ]
          : [{ type: "MenuItem", id: "LIST" }],
      keepUnusedDataFor: 180,
    }),

    getItemById: builder.query({
      query: ({ id, itemType }) => ({
        method: "get",
        url: `/items/${id}?itemType=${itemType}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "MenuItem", id }],
      keepUnusedDataFor: 180, 
    }),

    createItem: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.ITEMS,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "MenuItem", id: "LIST" }],
    }),

    updateItem: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: `${endPoints.ITEMS}/${id}`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MenuItem", id },
        { type: "MenuItem", id: "LIST" },
      ],
    }),

    deleteItem: builder.mutation({
      query: (payload) => ({
        method: "delete",
        url: endPoints.ITEMS,
        data: payload,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [
        { type: "MenuItem", id: "LIST" },
        { type: "Combo", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useLazyGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = menuApi;

export const menuApiUtil = menuApi.util;
