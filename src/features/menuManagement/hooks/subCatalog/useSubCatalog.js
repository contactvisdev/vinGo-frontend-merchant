import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCatalogsByMerchantQuery } from "@/store/api/catalogApi";
import {
  useCreateSubCatalogMutation,
  useDeleteSubCatalogMutation,
  useGetSubCatalogsQuery,
  useUpdateSubCatalogMutation,
} from "@/store/api/subCatalogApi";
import { useModal } from "@/hooks";
import formValidation from "@/helpers/validations";

export function useSubCatalog() {
  const { profile } = useSelector((state) => state.businessProfile);
  const merchantId = profile?._id;

  const { data: catalogs = [], isLoading: catalogsLoading } =
    useGetCatalogsByMerchantQuery(merchantId, {
      skip: !merchantId,
    });

  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [catalogId, setCatalogId] = useState(null);
  const [catalogError, setCatalogError] = useState("");

  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    setIsOpen: setDeleteOpen,
  } = useModal();

  const {
    data: subCatalogs = [],
    isLoading: subCatalogsLoading,
    isFetching: subCatalogsFetching,
  } = useGetSubCatalogsQuery(
    { catalogId: selectedCatalogId, merchantId },
    { skip: !merchantId }
  );

  const [createSubCatalogMutation, { isLoading: isCreating }] =
    useCreateSubCatalogMutation();
  const [updateSubCatalogMutation, { isLoading: isUpdating }] =
    useUpdateSubCatalogMutation();
  const [deleteSubCatalogMutation] = useDeleteSubCatalogMutation();

  const catalogOptions = useMemo(
    () =>
      (Array.isArray(catalogs) ? catalogs : []).map((item) => ({
        name: item?.catalogName,
        value: item?._id,
      })),
    [catalogs],
  );

  const filterCatalogOptions = useMemo(
    () => [{ name: "All Catalogs", value: null }, ...catalogOptions],
    [catalogOptions],
  );

  const selectedCatalogName = useMemo(
    () => catalogOptions.find((opt) => opt.value === selectedCatalogId)?.name,
    [catalogOptions, selectedCatalogId],
  );

  const list = useMemo(
    () =>
      (Array.isArray(subCatalogs) ? subCatalogs : []).map((item) => ({
        ...item,
        catalogName: item?.name,
      })),
    [subCatalogs],
  );

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setName("");
    setNameError("");
    setCatalogId(catalogs[0]?._id || null);
    setCatalogError("");
  };

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setName("");
    setNameError("");
    setCatalogId(catalogs[0]?._id || null);
    setCatalogError("");
    setOpen(true);
  };

  const startEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setName(row.name || "");
    setNameError("");
    setCatalogId(row.catalogId?._id || row.catalogId || selectedCatalogId);
    setCatalogError("");
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEditId(id);
    openDelete();
  };

  const handleNameChange = (value) => {
    setName(value);
    setNameError("");
  };

  const handleCatalogChange = (value) => {
    setCatalogId(value);
    setCatalogError("");
  };

  const handleFilterCatalogChange = (value) => {
    setSelectedCatalogId(value);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const formErrors = {
      ...formValidation("name", trimmedName, { formErrors: {} }),
      ...formValidation("catalogId", catalogId, { formErrors: {} }),
    };

    setNameError(formErrors.name || "");
    setCatalogError(formErrors.catalogId || "");

    if (formErrors.name || formErrors.catalogId) return;

    const payload = {
      name: trimmedName,
      catalogId,
    };

    try {
      if (isEdit) {
        await updateSubCatalogMutation({ id: editId, ...payload }).unwrap();
        setSelectedCatalogId(catalogId);
      } else {
        await createSubCatalogMutation({ ...payload, merchantId }).unwrap();
        setSelectedCatalogId(catalogId);
      }
      handleClose();
    } catch {
      // Errors are surfaced via showErrorToast in the mutation config.
    }
  };

  const deleteSubCatalog = async (id) => deleteSubCatalogMutation(id).unwrap();

  return {
    list,
    loading: catalogsLoading || subCatalogsLoading || subCatalogsFetching,
    open,
    isEdit,
    isCreating,
    isUpdating,
    name,
    nameError,
    catalogId,
    catalogError,
    catalogOptions,
    filterCatalogOptions,
    catalogsLoading,
    selectedCatalogId,
    selectedCatalogName,
    isDeleteOpen,
    editId,
    handleClose,
    handleSubmit,
    startEdit,
    handleDeleteClick,
    deleteSubCatalog,
    setDeleteOpen,
    openAdd,
    handleNameChange,
    handleCatalogChange,
    handleFilterCatalogChange,
  };
}
