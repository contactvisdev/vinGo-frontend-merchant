import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPromotionalCatalogsByMerchantQuery,
  useCreatePromotionalCatalogMutation,
  useUpdatePromotionalCatalogMutation,
  useDeletePromotionalCatalogMutation,
} from "@/store/api/promotionalCatalogApi";
import { useModal } from "@/hooks";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";

const INITIAL_STATE = {
  title: "",
  description: "",
  promo_image: "",
  DiscountPercentage: "",
  paymentMethods: [],
  offer_details: "",
  startsOn: null,
  expiresOn: null,
  formErrors: {},
};

export function usePromotionalCategory() {
  const { profile } = useSelector((state) => state.businessProfile);

  const { data: promotionalCatalogList = [], isLoading } =
    useGetPromotionalCatalogsByMerchantQuery(profile?._id, { skip: !profile?._id });

  const [createMutation, { isLoading: isCreating }] = useCreatePromotionalCatalogMutation();
  const [updateMutation, { isLoading: isUpdating }] = useUpdatePromotionalCatalogMutation();
  const [deleteMutation] = useDeletePromotionalCatalogMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [statusOverrides, setStatusOverrides] = useState({});
  const { isOpen: isDeleteOpen, open: openDelete, setIsOpen: setDeleteOpen } = useModal();

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
      // Errors surface via showErrorToast in the mutation config.
    }
  };

  const buildPayload = (data) => ({
    merchantId: profile?._id,
    title: data.title.trim(),
    description: data.description || "",
    promo_image: data.promo_image || "",
    DiscountPercentage: data.DiscountPercentage ? Number(data.DiscountPercentage) : 0,
    paymentMethods: data.paymentMethods || [],
    offer_details: (data.offer_details ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    startsOn: data.startsOn ? new Date(data.startsOn).toISOString() : null,
    expiresOn: data.expiresOn ? new Date(data.expiresOn).toISOString() : null,
  });

  const resetModal = () => {
    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setFormData(INITIAL_STATE);
  };

  const handleSubmit = async () => {
    if (!showFormErrors(formData, setFormData, ["formErrors"])) return;
    try {
      const payload = buildPayload(formData);
      if (isEdit) {
        await updateMutation({ id: editId, ...payload }).unwrap();
      } else {
        await createMutation(payload).unwrap();
      }
      resetModal();
    } catch(error) {
      if(import.meta.env.DEV){
        console.log("Error creating category", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation(editId).unwrap();
      setDeleteOpen(false);
    } catch(error) {
      if(import.meta.env.DEV){
        console.log("Error deleting category", error);
      }
    }
  };

  const handleStatusToggle = async (row, isActive) => {
    const newStatus = isActive ? "active" : "inactive";
    setStatusOverrides((prev) => ({ ...prev, [row._id]: newStatus }));

    try {
      await updateMutation({
        id: row._id,
        title: row.title,
        description: row.description || "",
        promo_image: row.promo_image || "",
        DiscountPercentage: row.DiscountPercentage ?? 0,
        paymentMethods: row.paymentMethods || [],
        offer_details: Array.isArray(row.offer_details) ? row.offer_details : [],
        startsOn: row.startsOn ? new Date(row.startsOn).toISOString() : null,
        expiresOn: row.expiresOn ? new Date(row.expiresOn).toISOString() : null,
        status: newStatus,
      }).unwrap();
    } catch(error) {
      if(import.meta.env.DEV){
        console.log("Error updating category", error);
      }
    } finally {
      setStatusOverrides((prev) => {
        const next = { ...prev };
        delete next[row._id];
        return next;
      });
    }
  };

  const startEdit = (row) => {
    setIsEdit(true);
    setEditId(row._id);
    setFormData({
      title: row.title || "",
      description: row.description || "",
      promo_image: row.promo_image || "",
      DiscountPercentage: row.DiscountPercentage?.toString() || "",
      paymentMethods: row.paymentMethods || [],
      offer_details: Array.isArray(row.offer_details) ? row.offer_details.join("\n") : "",
      startsOn: row.startsOn ? new Date(row.startsOn) : null,
      expiresOn: row.expiresOn ? new Date(row.expiresOn) : null,
      formErrors: {},
    });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEditId(id);
    openDelete();
  };

  const list = Array.isArray(promotionalCatalogList) ? promotionalCatalogList : [];

  return {
    list,
    isLoading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    isUploading,
    formData,
    statusOverrides,
    isDeleteOpen,
    editId,
    updateField,
    handleImageUpload,
    handleSubmit,
    resetModal,
    handleDelete,
    handleStatusToggle,
    startEdit,
    handleDeleteClick,
    setDeleteOpen,
    openAdd: () => setOpen(true),
  };
}
