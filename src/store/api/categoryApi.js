import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        method: "get",
        url: endPoints.CATEGORIES,
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || [],
      providesTags: ["Category"],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetCategoriesQuery, useLazyGetCategoriesQuery } = categoryApi;
