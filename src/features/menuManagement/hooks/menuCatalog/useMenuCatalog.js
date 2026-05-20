import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetCatalogsByMerchantQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
  useReorderCatalogsMutation,
} from "@/store/api/catalogApi";
import { useGetProductTypesQuery } from "@/store/api/productTypeApi";
import { useModal } from "@/hooks";
import { useCategory } from "@hooks/api";
import { useBusinessCategory } from "@hooks/useBusinessCategory";
import formValidation from "@/helpers/validations";

export function useMenuCatalog() {
  const { profile } = useSelector((state) => state.businessProfile);
  const { isGrocery, isPharmacy, isLiquor } = useCategory();
  const { businessCategoryId } = useBusinessCategory();
  const showProductTypeDropdown = isGrocery || isPharmacy || isLiquor;
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [modalProductTypeId, setModalProductTypeId] = useState(null);
  const {
    data: catalogList = [],
    isLoading: catalogsLoading,
    isFetching: catalogsFetching,
  } = useGetCatalogsByMerchantQuery(
    {
      merchantId: profile?._id,
      ...(selectedProductTypeId ? { productTypeId: selectedProductTypeId } : {}),
    },
    { skip: !profile?._id }
  );
  const loading = catalogsLoading || catalogsFetching;
  const [createCatalogMutation, { isLoading: isCreating }] = useCreateCatalogMutation();
  const [updateCatalogMutation, { isLoading: isUpdating }] = useUpdateCatalogMutation();
  const [deleteCatalogMutation] = useDeleteCatalogMutation();
  const [reorderCatalogsMutation] = useReorderCatalogsMutation();

  const { data: productTypes = [], isLoading: productTypesLoading } =
    useGetProductTypesQuery(
    { categoryId: businessCategoryId },
    { skip: !showProductTypeDropdown || !businessCategoryId }
  );
  const productTypeOptions = useMemo(
    () => [
      { name: "All Product Types", value: null },
      ...productTypes.map((pt) => ({ name: pt?.name, value: pt?._id })),
    ],
    [productTypes],
  );

  const selectedProductTypeName = useMemo(
    () => productTypes.find((pt) => pt?._id === selectedProductTypeId)?.name,
    [productTypes, selectedProductTypeId],
  );

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [productTypeError, setProductTypeError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isOpen: isDeleteOpen, open: openDelete, setIsOpen: setDeleteOpen } = useModal();

  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
    setCategoryNameError("");
    setModalProductTypeId(null);
    setProductTypeError("");
    setIsEdit(false);
    setEditId(null);
  };

  const handleCreateCategory = async () => {
    const formErrors = formValidation("catalogName", categoryName.trim(), { formErrors: {} });
    const hasCatalogError = !!formErrors?.catalogName;
    setCategoryNameError(hasCatalogError ? formErrors.catalogName : "");

    const hasProductTypeError = showProductTypeDropdown && !modalProductTypeId;
    setProductTypeError(hasProductTypeError ? "Please select a product type" : "");

    if (hasCatalogError || hasProductTypeError) return;

    try {
      const trimmedName = categoryName.trim();
      const payload = { catalogName: trimmedName };
      if (showProductTypeDropdown) payload.productTypeId = modalProductTypeId;

      if (isEdit) {
        await updateCatalogMutation({ id: editId, ...payload }).unwrap();
      } else {
        await createCatalogMutation({ ...payload, merchantId: profile?._id }).unwrap();
      }
      handleClose();
    } catch(error) {
      if(import.meta.env.DEV){
        console.log("Error creating category", error);
      }
    }
  };

  const startEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setCategoryName(row.catalogName);
    setModalProductTypeId(row.productTypeId?._id || row.productTypeId || null);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEditId(id);
    openDelete();
  };

  const handleCategoryNameChange = (value) => {
    setCategoryName(value);
    setCategoryNameError("");
  };

  const handleProductTypeChange = (value) => {
    setSelectedProductTypeId(value);
    setProductTypeError("");
  };

  const handleModalProductTypeChange = (value) => {
    setModalProductTypeId(value);
    setProductTypeError("");
  };

  const handleReorder = (reorderedList) => {
    const catalogs = reorderedList.map((item, index) => ({
      id: item._id,
      sortOrder: index + 1,
    }));
    reorderCatalogsMutation({ catalogs, merchantId: profile?._id });
  };

  const deleteCatalog = async (id) => deleteCatalogMutation(id).unwrap();

  const list = Array.isArray(catalogList) ? catalogList : [];

  return {
    list,
    loading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    categoryName,
    categoryNameError,
    isDeleteOpen,
    editId,
    showProductTypeDropdown,
    selectedProductTypeId,
    setSelectedProductTypeId,
    selectedProductTypeName,
    modalProductTypeId,
    productTypeOptions,
    productTypesLoading,
    productTypeError,
    handleClose,
    handleCreateCategory,
    startEdit,
    handleDeleteClick,
    deleteCatalog,
    setDeleteOpen,
    openAdd: () => setOpen(true),
    handleCategoryNameChange,
    handleProductTypeChange,
    handleModalProductTypeChange,
    handleReorder,
  };
}
