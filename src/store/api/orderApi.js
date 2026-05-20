import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10, merchantId, ...filters }) => ({
        method: "get",
        url: endPoints.RESTAURANT_ORDERS,
        params: {
          page,
          limit,
          ...(merchantId && { merchantId }),
          ...(filters.search && { search: filters.search }),
          ...(filters.fromDate && { fromDate: filters.fromDate }),
          ...(filters.toDate && { toDate: filters.toDate }),
          ...(filters.status && { status: filters.status }),
        },
      }),
      transformResponse: (response) =>
        response?.data || { list: [], pagination: {} },
      providesTags: (result) =>
        result?.list?.length
          ? [
              ...result.list.map(({ _id }) => ({ type: "Order", id: _id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      keepUnusedDataFor: 15, 
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        method: "get",
        url: `${endPoints.RESTAURANT_ORDERS_DETAILS}/${orderId}`,
      }),
      transformResponse: (response) => response?.data || null,
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
      keepUnusedDataFor: 15, 
    }),
    updateOrderDecision: builder.mutation({
      query: ({ orderId, action }) => ({
        method: "post",
        url: `${endPoints.RESTAURANT_DECISION}/decision`,
        data: { orderId, action },
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    markOrderReadyForPickup: builder.mutation({
      query: ({ orderId, action }) => ({
        method: "post",
        url: `${endPoints.RESTAURANT_DECISION}/${orderId}/ready-for-pickup`,
        data: { orderId, action },
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, ...payload }) => ({
        method: "put",
        url: `${endPoints.RESTAURANT_DECISION}/updateOrderStatus/${orderId}`,
        data: payload,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    verifyPickupOtp: builder.mutation({
      query: ({ orderId, otp }) => ({
        method: "post",
        url: endPoints.VERIFY_PICKUP_OTP,
        data: { orderId, otp },
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    processOrderPayment: builder.mutation({
      query: ({ orderId }) => ({
        method: "post",
        url: endPoints.PROCESS_ORDER_PAYMENT,
        data: { orderId },
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrdersQuery,
  useUpdateOrderDecisionMutation,
  useMarkOrderReadyForPickupMutation,
  useUpdateOrderStatusMutation,
  useVerifyPickupOtpMutation,
  useProcessOrderPaymentMutation,
} = orderApi;
