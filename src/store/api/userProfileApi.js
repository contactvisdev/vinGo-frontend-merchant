import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";
import { setBusinessProfile, updateMerchantProfile } from "@/store/businessProfileSlice";

const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (id) => ({
        method: "get",
        url: id
          ? `${endPoints.GET_PROFILE}/${id}`
          : endPoints.GET_PROFILE,
      }),
      providesTags: ["UserProfile"],
      keepUnusedDataFor: 300,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBusinessProfile(data.data));
        } catch {
          // Error handled by RTK Query
        }
      },
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        method: "put",
        url: `${endPoints.UPDATE_MERCHANT}/${id}`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: ["UserProfile"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setBusinessProfile(data.data));
          }
        } catch {
          // Error handled by RTK Query
        }
      },
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userProfileApi;
