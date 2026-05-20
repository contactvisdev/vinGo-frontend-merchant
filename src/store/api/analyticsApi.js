import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query({
      query: (params) => ({
        method: "get",
        url: endPoints.ANALYTICS_OVERVIEW,
        params,
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || {},
      providesTags: ["AnalyticsOverview"],
      keepUnusedDataFor: 90,
    }),
    getAnalyticsSalesPerformance: builder.query({
      query: ({ from, to, ...params }) => ({
        method: "get",
        url: endPoints.ANALYTICS_SALES_PERFORMANCE,
        params: {
          ...params,
          ...(from && { from }),
          ...(to && { to }),
        },
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || {},
      providesTags: ["AnalyticsSalesPerformance"],
      keepUnusedDataFor: 90,
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetAnalyticsSalesPerformanceQuery,
} = analyticsApi;
