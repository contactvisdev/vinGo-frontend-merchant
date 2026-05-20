import { useState, useCallback, useEffect, useRef } from "react";
import formValidation from "@/helpers/validations";
import { toImageList } from "@/helpers/commonFunctions";
import { useMenuContext } from "./useMenuContext";
import { useMenuItemApi } from "./useMenuItemApi";

export const useMenuFormBase = ({ initialState, mode, itemId, mapItemToForm, buildPayload, onSuccess }) => {
  const ctx = useMenuContext();
  const api = useMenuItemApi();
  

  const [data, setData] = useState({ ...initialState, formErrors: {} });
  const [loading, setLoading] = useState(false);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...(ctx.categoryId && { categoryId: ctx.categoryId }),
      ...(ctx.merchantId && { merchantId: ctx.merchantId }),
      ...(ctx.itemType && { itemType: ctx.itemType }),
    }));
  }, [ctx.categoryId, ctx.merchantId, ctx.itemType]);

  const handleChange = useCallback(
    ({ name, value }) => {
      setData((prev) => {
        const formErrors = formValidation(name, value, prev);
        return { ...prev, [name]: value, formErrors };
      });
    },
    [],
  );

  const uploadDocument = useCallback(
    async (file, name) => {
        await api.uploadFile(file, (uploaded) => {
          handleChange({ name, value: uploaded.url });
        });
    },
    [api.uploadFile, handleChange],
  );

  const uploadDocuments = useCallback(
    async (files, name) => {
      const fileList = Array.isArray(files) ? files : [files];
      if (!fileList.length) return;

      const existing = toImageList(dataRef.current?.[name]);

      let newUrls = [];
      if (fileList.length === 1) {
        const result = await api.uploadFile(fileList[0]);
        const url = result?.url;
        if (url) newUrls = [url];
      } else {
        const result = await api.uploadFiles(fileList);
        const payload = result?.files || [];
        newUrls = payload
          .map((entry) => (typeof entry === "string" ? entry : entry?.url))
          .filter(Boolean);
      }

      const combined = [...existing, ...newUrls];
      const value =
        combined.length === 0
          ? ""
          : combined.length === 1
            ? combined[0]
            : combined;
      handleChange({ name, value });
    },
    [api, handleChange],
  );

  const resetForm = useCallback(() => {
    setData({ ...initialState, formErrors: {} });
  }, [initialState]);

  const loadedItemIdRef = useRef(null);

  const loadItemForEdit = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      const res = await api.getItemById(itemId, ctx.itemType);
      const item = res?.data;
      const formData = mapItemToForm(item, ctx);
      setData({ ...formData, formErrors: {} });
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  }, [api.getItemById, itemId, ctx.itemType, ctx.categoryId, ctx.merchantId, mapItemToForm]);

  useEffect(() => {
    if (mode === "edit" && itemId) {
      if (loadedItemIdRef.current !== itemId) {
        loadedItemIdRef.current = itemId;
        loadItemForEdit();
      }
    } else {
      loadedItemIdRef.current = null;
      resetForm();
    }
  }, [itemId, mode]);

  const handleSubmit = useCallback(
    async (validateForm) => {
      try {
        if (validateForm && !validateForm()) return;
        if (!ctx.merchantId || !ctx.categoryId) return;
    
        const payload = buildPayload(data, ctx);
  
        setLoading(true);
  
        if (mode === "add") {
          await api.createItem(payload);
        } else {
          await api.updateItem(itemId, payload);
        }
        onSuccess?.();
        resetForm();
      } catch (error) {
        console.error("Error saving item:", error);
      } finally {
        setLoading(false);
      }
    },
    [data, ctx, buildPayload, mode, api, itemId, onSuccess]
  );

  return {
    ctx,
    api,
    data,
    setData,
    loading,
    handleChange,
    uploadDocument,
    uploadDocuments,
    handleSubmit,
    resetForm,
  };
};
