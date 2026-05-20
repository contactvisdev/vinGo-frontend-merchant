import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetCatalogsByMerchantQuery,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
  useDeleteCatalogMutation,
} from "@/store/api/catalogApi";
import {
  useGetPromotionalCatalogsByMerchantQuery,
  useCreatePromotionalCatalogMutation,
  useUpdatePromotionalCatalogMutation,
  useDeletePromotionalCatalogMutation,
} from "@/store/api/promotionalCatalogApi";
import {
  useGetSubCatalogsQuery,
  useCreateSubCatalogMutation,
  useUpdateSubCatalogMutation,
  useDeleteSubCatalogMutation,
} from "@/store/api/subCatalogApi";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";

const HOOKS_MAP = {
  standard: {
    useQuery: useGetCatalogsByMerchantQuery,
    useCreate: useCreateCatalogMutation,
    useUpdate: useUpdateCatalogMutation,
    useDelete: useDeleteCatalogMutation,
    nameField: "catalogName",
  },
  promotional: {
    useQuery: useGetPromotionalCatalogsByMerchantQuery,
    useCreate: useCreatePromotionalCatalogMutation,
    useUpdate: useUpdatePromotionalCatalogMutation,
    useDelete: useDeletePromotionalCatalogMutation,
    nameField: "promotionalCatalogName",
  },
  subcatalog: {
    useQuery: useGetSubCatalogsQuery,
    useCreate: useCreateSubCatalogMutation,
    useUpdate: useUpdateSubCatalogMutation,
    useDelete: useDeleteSubCatalogMutation,
    nameField: "name",
  },
};

export const useCatalogCRUD = ({ type = "standard", queryArg } = {}) => {
  const config = HOOKS_MAP[type];
  const merchant= useSelector((state) => state?.businessProfile?.profile?.merchant);
  const merchantId = merchant?._id;

  const {
    data: catalogs = [],
    isLoading: catalogsLoading,
    isFetching: catalogsFetching,
  } = config.useQuery(
    type === "subcatalog"
      ? { catalogId: queryArg, merchantId }
      : merchantId,
    { skip: !merchantId },
  );
  const [createMut] = config.useCreate();
  const [updateMut] = config.useUpdate();
  const [deleteMut] = config.useDelete();

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [formData, setFormData] = useState({ [config.nameField]: "" });

  const handleFormChange = ({ name, value }) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const formErrors = formValidation(name, value, updated);
      return { ...updated, formErrors };
    });
  };

  const startEditing = (catalog) => {
    setEditingId(catalog._id);
    setEditValue(catalog);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const createCatalog = async (extraPayload = {}) => {
    if (!showFormErrors(formData, setFormData)) return;
    try {
      setLoading(true);
      const result = await createMut({
        merchantId,
        [config.nameField]: formData[config.nameField],
        ...extraPayload,
      }).unwrap();
      setFormData({ [config.nameField]: "" });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id, extraPayload = {}) => {
    if (!editValue?.[config.nameField]?.trim()) return;
    try {
      setLoading(true);
      await updateMut({
        id,
        [config.nameField]: editValue?.[config.nameField],
        ...extraPayload,
      }).unwrap();
      setEditingId(null);
      setEditValue("");
    } finally {
      setLoading(false);
    }
  };

  const deleteCatalog = async (id) => {
    try {
      setLoading(true);
      await deleteMut(id).unwrap();
    } finally {
      setLoading(false);
    }
  };

  return {
    catalogs,
    catalogsLoading,
    catalogsFetching,
    loading,
    formData,
    setFormData,
    handleFormChange,
    editingId,
    editValue,
    setEditValue,
    startEditing,
    cancelEdit,
    createCatalog,
    saveEdit,
    deleteCatalog,
    nameField: config.nameField,
  };
};
