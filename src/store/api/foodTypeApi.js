import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const foodTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoodTypes: builder.query({
      query: () => ({
        method: "get",
        url: endPoints.FOOD_TYPE,
        showErrorToast: true,
      }),
      transformResponse: (response) => {
        return response?.data || []
      },
      providesTags: ["FoodType"],
      keepUnusedDataFor: 300,
    }),

    createFoodType: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.FOOD_TYPE,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["FoodType"],
    }),
  }),
});

export const { useGetFoodTypesQuery, useCreateFoodTypeMutation } = foodTypeApi;
