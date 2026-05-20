import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosInstance } from "@/services/helper/client";
import { showToastAction } from "@/store/commonSlice";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async (
    { url, method, data, params, headers, showSuccessToast, showErrorToast },
    { dispatch },
  ) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      const responseData = result.data;

      const isSuccess =
        responseData?.status === "success" || responseData?.success === true;
      if (isSuccess) {
        if (showSuccessToast) {
          dispatch(
            showToastAction({
              type: "success",
              title:
                responseData?.message ||
                (typeof showSuccessToast === "string"
                  ? showSuccessToast
                  : "Success"),
            }),
          );
        }
        return { data: responseData };
      }

      // API returned non-success status in body
      const errorMessage = responseData?.message || "Request failed";
      if (showErrorToast) {
        dispatch(
          showToastAction({
            type: "error",
            title:
              typeof showErrorToast === "string"
                ? showErrorToast
                : errorMessage,
          }),
        );
      }
      return {
        error: {
          status: responseData?.statusCode || 400,
          data: responseData,
          message: errorMessage,
        },
      };
    } catch (axiosError) {
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed";
      if (showErrorToast) {
        dispatch(
          showToastAction({
            type: "error",
            title:
              typeof showErrorToast === "string"
                ? showErrorToast
                : errorMessage,
          }),
        );
      }
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  tagTypes: [
    "Category",
    "FoodType",
    "ProductType",
    "Catalog",
    "SubCatalog",
    "PromotionalCatalog",
    "MenuItem",
    "Combo",
    "Overview",
    "RecentOrder",
    "SalesChart",
    "Order",
    "Review",
    "BusinessStaff",
    "UserProfile",
    "BankDetails",
    "Wallet",
    "Transaction",
    "AnalyticsOverview",
    "AnalyticsSalesPerformance",
    "Merchant",
    "TermsPolicy",
  ],
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});
