import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProductTypesQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} from "@/store/api/productTypeApi";
import { apiSlice } from "@/store/api/apiSlice";
import { useModal } from "@/hooks";
import formValidation from "@/helpers/validations";

export function useProductType() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.businessProfile);
  const { data: productTypes = [], isLoading: loading } = useGetProductTypesQuery();
  const [createMutation, { isLoading: isCreating }] = useCreateProductTypeMutation();
  const [updateMutation, { isLoading: isUpdating }] = useUpdateProductTypeMutation();
  const [deleteMutation] = useDeleteProductTypeMutation();

  const [open, setOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeNameError, setTypeNameError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isOpen: isDeleteOpen, open: openDelete, setIsOpen: setDeleteOpen } = useModal();

  const handleClose = () => {
    setOpen(false);
    setTypeName("");
    setTypeNameError("");
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    const formErrors = formValidation("productTypeName", typeName.trim(), { formErrors: {} });
    if (formErrors?.productTypeName) {
      setTypeNameError(formErrors.productTypeName);
      return;
    }
    setTypeNameError("");

    try {
      const trimmedName = typeName.trim();
      if (isEdit) {
        await updateMutation({ id: editId, name: trimmedName, categoryId: profile?.categoryId }).unwrap();
      } else {
        await createMutation({ name: trimmedName, categoryId: profile?.categoryId }).unwrap();
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
    setTypeName(row.name);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEditId(id);
    openDelete();
  };

  const deleteProductType = (id) => deleteMutation(id).unwrap();

  const handleToggleActive = async (row) => {
    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getProductTypes", undefined, (draft) => {
        const item = draft.find((d) => d._id === row._id);
        if (item) item.isActive = !row.isActive;
      })
    );
    try {
      await updateMutation({ id: row._id, isActive: !row.isActive }).unwrap();
    } catch {
      patchResult.undo();
    }
  };

  const handleTypeNameChange = (value) => {
    setTypeName(value);
    setTypeNameError("");
  };

  const list = Array.isArray(productTypes) ? productTypes : [];

  return {
    list,
    loading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    typeName,
    typeNameError,
    isDeleteOpen,
    editId,
    handleClose,
    handleSubmit,
    startEdit,
    handleDeleteClick,
    deleteProductType,
    setDeleteOpen,
    openAdd: () => setOpen(true),
    handleTypeNameChange,
    handleToggleActive,
  };
}
