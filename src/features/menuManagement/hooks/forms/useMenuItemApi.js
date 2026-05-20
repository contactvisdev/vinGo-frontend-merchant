import { useUploadFileMutation, useUploadFilesMutation } from "@/store/api/uploadApi";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useLazyGetItemByIdQuery,
} from "@/store/api/menuApi";

export const useMenuItemApi = () => {
  const [uploadFileMutation, { isLoading: singleUploadLoading }] = useUploadFileMutation();
  const [uploadFilesMutation, { isLoading: multiUploadLoading }] = useUploadFilesMutation();
  const [createItemMutation] = useCreateItemMutation();
  const [updateItemMutation] = useUpdateItemMutation();
  const [triggerGetItemById] = useLazyGetItemByIdQuery();

  const fileUploadLoading = singleUploadLoading || multiUploadLoading;

  const extractSingleUrl = (result) =>
    result?.data?.url ||
    result?.data?.file?.url ||
    result?.file?.url ||
    result?.files?.[0]?.url ||
    result?.data?.files?.[0]?.url ||
    result?.url ||
    "";

  const extractFilesList = (result) =>
    result?.files || result?.data?.files || [];

  const uploadFile = async (file, onSuccess) => {
    const result = await uploadFileMutation(file).unwrap();
    const url = extractSingleUrl(result);
    const payload = { ...(result?.data || result), url };
    onSuccess?.(payload);
    return { ...result, data: payload, url };
  };

  const uploadFiles = async (files, onSuccess) => {
    const result = await uploadFilesMutation(files).unwrap();
    const list = extractFilesList(result);
    onSuccess?.(list);
    return { ...result, files: list, data: { ...(result?.data || {}), files: list } };
  };

  const createItem = async (data) => createItemMutation(data).unwrap();
  const updateItem = async (id, data) => updateItemMutation({ id, ...data }).unwrap();
  const getItemById = async (id, itemType) => triggerGetItemById({ id, itemType }).unwrap();

  return { uploadFile, uploadFiles, createItem, updateItem, getItemById, fileUploadLoading };
};
