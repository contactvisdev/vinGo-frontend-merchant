import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: (params) => ({
        method: "get",
        url: endPoints.OVERVIEW,
        params,
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || {},
      providesTags: ["Overview"],
      keepUnusedDataFor: 90, 
    }),
    getRecentOrders: builder.query({
      query: ({ page = 1, limit = 10, ...params }) => ({
        method: "get",
        url: endPoints.RECENT_ORDER,
        params: { page, limit, ...params },
        showErrorToast: true,
      }),
      transformResponse: (response) =>
        response?.data || { list: [], pagination: {} },
      providesTags: ["RecentOrder"],
      keepUnusedDataFor: 45, // low: changes often
    }),
    getSalesChart: builder.query({
      query: ({ type = "weekly", ...params }) => ({
        method: "get",
        url: endPoints.SALES_CHART,
        params: { type, ...params },
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || {},
      providesTags: ["SalesChart"],
      keepUnusedDataFor: 90, 
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetRecentOrdersQuery,
  useGetSalesChartQuery,
  useLazyGetOverviewQuery,
  useLazyGetRecentOrdersQuery,
  useLazyGetSalesChartQuery,
} = dashboardApi;
