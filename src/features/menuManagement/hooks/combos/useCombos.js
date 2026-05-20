import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetCombosQuery,
  useCreateComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
  comboApiUtil,
} from "@/store/api/comboApi";
import { useGetItemsQuery } from "@/store/api/menuApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useModal, useDebounce } from "@/hooks";
import { useMenuContext } from "../forms/useMenuContext";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";

const INITIAL_FORM = {
  combo_name: "",
  itemIds: [],
  comboPrice: "",
  combo_image: "",
  formErrors: {},
};

export function useCombos() {
  const ctx = useMenuContext();
  const { profile } = useSelector((state) => state.businessProfile);
  const dispatch = useDispatch();
  const merchantId = profile?._id;
  const categoryId = profile?.categoryId;

  const [search, setSearch] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const [page, setPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);
  const effectiveSearch = debouncedSearch.trim();

  const { data: comboData, isLoading, isFetching } = useGetCombosQuery(
    {
      merchantId,
      page,
      limit: 12,
      itemType: ctx.itemType,
      ...(selectedCatalogId && { categoryId: selectedCatalogId }),
      ...(effectiveSearch && { searchName: effectiveSearch }),
    },
    { skip: !merchantId }
  );
  const { data: itemsData } = useGetItemsQuery(
    {
      merchantId: ctx.merchantId,
      itemType: ctx.itemType,
      categoryId: ctx.categoryId,
      page: 1,
      limit: 100,
    },
    { skip: !ctx.ready }
  );

  const [createMutation, { isLoading: isCreating }] = useCreateComboMutation();
  const [updateMutation, { isLoading: isUpdating }] = useUpdateComboMutation();
  const [deleteMutation] = useDeleteComboMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { isOpen: isDeleteOpen, open: openDelete, setIsOpen: setDeleteOpen } = useModal();

  const comboList = comboData?.list || [];
  const menuItems = itemsData?.list || [];

  useEffect(() => setPage(1), [effectiveSearch, selectedCatalogId]);

  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        const element = searchInputRef.current?.getElement?.() || searchInputRef.current;
        const inputElement =
          element?.querySelector?.("input.p-inputtext") ||
          element?.querySelector?.("input") ||
          document.getElementById("search");
        if (inputElement && document.activeElement !== inputElement && isSearchFocused) {
          inputElement.focus();
        }
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [comboList, isSearchFocused]);

  const updateField = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const errors = formValidation(name, value, updated);
      return { ...updated, formErrors: { ...prev.formErrors, ...errors } };
    });
  };

  const handleImageUpload = async (file, name) => {
    try {
      const result = await uploadFile(file).unwrap();
      const url =
        result?.data?.url ||
        result?.data?.file?.url ||
        result?.file?.url ||
        result?.files?.[0]?.url ||
        result?.data?.files?.[0]?.url ||
        result?.url;
      if (url) updateField(name, url);
    } catch {
      // Upload error handled by service
    }
  };

  const buildPayload = () => ({
    combo_name: formData.combo_name.trim(),
    itemType: ctx.itemType,
    categoryId: categoryId || undefined,
    merchantId,
    itemIds: formData.itemIds || [],
    comboPrice: Number(formData.comboPrice) || 0,
    combo_image: formData.combo_image || "",
  });

  const resetModal = () => {
    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setFormData(INITIAL_FORM);
  };

  const handleSubmit = async () => {
    if (!showFormErrors(formData, setFormData, ["formErrors"])) return;
    try {
      const payload = buildPayload();
      if (isEdit) {
        await updateMutation({ id: editId, ...payload, categoryId }).unwrap();
      } else {
        await createMutation(payload).unwrap();
      }
      resetModal();
    } catch {
      // Error handled by RTK Query
    }
  };

  const startEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    const itemIds = Array.isArray(row.itemIds)
      ? row.itemIds.map((i) => (typeof i === "object" ? i?._id : i)).filter(Boolean)
      : [];
    setFormData({
      combo_name: row.combo_name || "",
      categoryId: row.categoryId || "",
      itemIds,
      comboPrice: row.comboPrice?.toString() || "",
      combo_image: row.combo_image || "",
      formErrors: {},
    });
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation(editId).unwrap();
      setDeleteOpen(false);
    } catch {
      // Error handled by RTK Query
    }
  };

  // Keep useCallback here — passed to optimistic cache update which needs stable query args reference
  const handleToggleAvailability = useCallback(
    async (row) => {
      const newAvailability = !row.availability;
      const ids = (row.itemIds || []).map((i) => (typeof i === "object" ? i._id : i));

      const queryArgs = {
        merchantId,
        page,
        limit: 12,
        itemType: ctx.itemType,
        ...(selectedCatalogId && { categoryId: selectedCatalogId }),
        ...(effectiveSearch && { searchName: effectiveSearch }),
      };

      const patchResult = dispatch(
        comboApiUtil.updateQueryData("getCombos", queryArgs, (draft) => {
          const target = draft?.list?.find((i) => i._id === row._id);
          if (target) target.availability = newAvailability;
        })
      );

      try {
        await updateMutation({
          id: row._id,
          combo_name: row.combo_name,
          itemType: row.itemType,
          categoryId,
          merchantId: row.merchantId,
          itemIds: ids,
          comboPrice: row.comboPrice,
          combo_image: row.combo_image || "",
          availability: newAvailability,
        }).unwrap();
      } catch {
        patchResult.undo();
      }
    },
    [updateMutation, dispatch, merchantId, page, ctx.itemType, selectedCatalogId, effectiveSearch, categoryId]
  );

  const handleDeleteClick = (id) => {
    setEditId(id);
    openDelete();
  };

  return {
    comboList,
    menuItems,
    isLoading,
    isFetching,
    search,
    searchInputRef,
    isSearchFocused,
    page,
    pagination: comboData?.pagination,
    open,
    isEdit,
    isCreating,
    isUpdating,
    isUploading,
    formData,
    isDeleteOpen,
    setSearch,
    setIsSearchFocused,
    setPage,
    updateField,
    handleImageUpload,
    handleSubmit,
    resetModal,
    startEdit,
    handleDelete,
    handleToggleAvailability,
    handleDeleteClick,
    setDeleteOpen,
    openAdd: () => setOpen(true),
  };
}
