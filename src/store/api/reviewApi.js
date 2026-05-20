import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ page = 1, limit = 10, merchantId, ...filters }) => ({
        method: "get",
        url: endPoints.REVIEWS,
        params: {
          page,
          limit,
          merchantId,
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.search && { search: filters.search }),
          ...(filters.rating && { rating: filters.rating }),
        },
      }),
      transformResponse: (response) => response?.data || {},
      providesTags: ["Review"],
      keepUnusedDataFor: 60, // low: list
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
} = reviewApi;
