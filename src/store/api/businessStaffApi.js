import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const businessStaffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaff: builder.query({
      query: (merchantId) => ({
        method: "get",
        url: endPoints.BUSINESS_STAFF,
        params: merchantId ? { merchantId } : {},
      }),
      providesTags: (result) => {
        const list = result?.data?.list || result?.data || [];
        return Array.isArray(list) && list.length
          ? [
              ...list.map(({ _id }) => ({ type: "BusinessStaff", id: _id })),
              { type: "BusinessStaff", id: "LIST" },
            ]
          : [{ type: "BusinessStaff", id: "LIST" }];
      },
      keepUnusedDataFor: 120, // medium: staff list
    }),
    getStaffById: builder.query({
      query: ({ id, categoryId }) => ({
        method: "get",
        url: endPoints.BUSINESS_STAFF_BY_ID(id),
        params: categoryId ? { categoryId } : {},
      }),
      providesTags: (result, error, { id }) => [
        { type: "BusinessStaff", id },
      ],
      keepUnusedDataFor: 120, // medium
    }),
    createStaff: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.BUSINESS_STAFF,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "BusinessStaff", id: "LIST" }],
    }),
    updateStaff: builder.mutation({
      query: ({ id, data, categoryId }) => ({
        method: "put",
        url: endPoints.BUSINESS_STAFF_BY_ID(id),
        data,
        params: categoryId ? { categoryId } : {},
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BusinessStaff", id },
        { type: "BusinessStaff", id: "LIST" },
      ],
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: endPoints.BUSINESS_STAFF_DELETE,
        data: { id },
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "BusinessStaff", id },
        { type: "BusinessStaff", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useLazyGetAllStaffQuery,
  useLazyGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = businessStaffApi;
