import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const productTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductTypes: builder.query({
      query: (params) => ({
        method: "get",
        url: endPoints.PRODUCT_TYPE,
        params: {
          ...(params?.merchantId ? { merchantId: params.merchantId } : {}),
          ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
        },
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || [],
      providesTags: ["ProductType"],
      keepUnusedDataFor: 300,
    }),

    getProductTypeById: builder.query({
      query: (id) => ({
        method: "get",
        url: endPoints.PRODUCT_TYPE_BY_ID(id),
      }),
      providesTags: (result, error, id) => [{ type: "ProductType", id }],
      keepUnusedDataFor: 600, // high: reference data
    }),

    createProductType: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.PRODUCT_TYPE,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["ProductType"],
    }),

    updateProductType: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: endPoints.PRODUCT_TYPE_BY_ID(id),
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductType", id },
        "ProductType",
      ],
    }),

    deleteProductType: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.PRODUCT_TYPE_BY_ID(id),
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["ProductType"],
    }),
  }),
});

export const {
  useGetProductTypesQuery,
  useGetProductTypeByIdQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypeApi;
