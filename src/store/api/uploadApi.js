import { apiSlice } from "./apiSlice";
import endPoints from "@/services/helper/endpoints";

const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          method: "post",
          url: endPoints.UPLOAD_SINGLE,
          data: formData,
          showSuccessToast: false,
          showErrorToast: true,
        };
      },
    }),
    uploadFiles: builder.mutation({
      query: (files) => {
        const formData = new FormData();
        for (const file of files) {
          formData.append("files", file);
        }
        return {
          method: "post",
          url: endPoints.UPLOAD_MULTIPLE,
          data: formData,
          showSuccessToast: false,
          showErrorToast: true,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi;
