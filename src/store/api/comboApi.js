import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const comboApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCombos: builder.query({
      query: ({ merchantId, page = 1, limit = 12, itemType, categoryId, searchName }) => ({
        method: "get",
        url: endPoints.COMBO,
        params: {
          merchantId,
          page,
          limit,
          ...(itemType && { itemType }),
          ...(categoryId && { categoryId }),
          ...(searchName && searchName.trim() && { search: searchName.trim() }),
        },
        showErrorToast: true,
      }),
      transformResponse: (response) => {
        const inner = response?.data;
        const list = Array.isArray(inner?.data) ? inner.data : (Array.isArray(inner) ? inner : []);
        const pagination = inner?.pagination ?? response?.pagination ?? {};
        return { list, pagination };
      },
      providesTags: (result) =>
        result?.list?.length
          ? [
              ...result.list.map(({ _id }) => ({ type: "Combo", id: _id })),
              { type: "Combo", id: "LIST" },
            ]
          : [{ type: "Combo", id: "LIST" }],
      keepUnusedDataFor: 180, // medium-high: combo list
    }),

    getComboById: builder.query({
      query: (id) => ({
        method: "get",
        url: `${endPoints.COMBO}/${id}`,
        showErrorToast: true,
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, id) => [{ type: "Combo", id }],
      keepUnusedDataFor: 180, // medium-high
    }),

    createCombo: builder.mutation({
      query: (data) => ({
        method: "post",
        url: endPoints.COMBO,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: [{ type: "Combo", id: "LIST" }],
    }),

    updateCombo: builder.mutation({
      query: ({ id, ...data }) => ({
        method: "put",
        url: `${endPoints.COMBO}/${id}`,
        data,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Combo", id },
        { type: "Combo", id: "LIST" },
      ],
    }),

    deleteCombo: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: `${endPoints.COMBO}/${id}`,
        showSuccessToast: true,
        showErrorToast: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Combo", id },
        { type: "Combo", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCombosQuery,
  useGetComboByIdQuery,
  useLazyGetCombosQuery,
  useLazyGetComboByIdQuery,
  useCreateComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
} = comboApi;

export const comboApiUtil = comboApi.util;
