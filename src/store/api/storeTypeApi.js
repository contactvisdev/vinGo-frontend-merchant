import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

export const storeTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreTypes: builder.query({
      query: (params) => ({
        url: endPoints.STORE_TYPE,
        method: "GET",
        params: {
          ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
          ...(params?.page ? { page: params.page } : {}),
          ...(params?.limit ? { limit: params.limit } : {}),
        },
        showErrorToast: true,
        showSuccessToast: false,
      }),
      providesTags: ["StoreType"],
      transformResponse: (response) => {
        const d = response?.data;
        return Array.isArray(d) ? d : (d?.list ?? d?.data ?? []);
      },
    }),
    getStoreTypeById: builder.query({
      query: (id) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: "GET",
        showErrorToast: true,
        showSuccessToast: false,
      }),
      providesTags: (result, error, id) => [{ type: "StoreType", id }],
    }),
    createStoreType: builder.mutation({
      query: (payload) => ({
        url: `${endPoints.STORE_TYPE}/`,
        method: "POST",
        data: payload,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["StoreType"],
    }),
    updateStoreType: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: "PUT",
        data: payload,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "StoreType",
        { type: "StoreType", id },
      ],
    }),
    deleteStoreType: builder.mutation({
      query: (id) => ({
        url: `${endPoints.STORE_TYPE}/${id}`,
        method: "DELETE",
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["StoreType"],
    }),
  }),
});

export const {
  useGetStoreTypesQuery,
  useGetStoreTypeByIdQuery,
  useCreateStoreTypeMutation,
  useUpdateStoreTypeMutation,
  useDeleteStoreTypeMutation,
} = storeTypeApi;
