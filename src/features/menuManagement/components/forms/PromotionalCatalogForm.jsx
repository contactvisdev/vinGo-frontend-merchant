import React, { useState, useCallback } from "react";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import {
  useGetPromotionalCatalogsByMerchantQuery,
  useCreatePromotionalCatalogMutation,
  useUpdatePromotionalCatalogMutation,
  useDeletePromotionalCatalogMutation,
} from "@/store/api/promotionalCatalogApi";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import PromotionalCatalogFormFields from "../promotionalCategory/PromotionalCatalogFormFields";

const INITIAL_FORM_DATA = {
  title: "",
  DiscountPercentage: "",
  description: "",
  offer_details: "",
  promo_image: "",
  paymentMethods: [],
  startsOn: null,
  expiresOn: null,
  formErrors: {},
};

export default function PromotionalCatalogForm({ merchantId, onSuccess, navigateTo }) {
  const { data: promotionalCatalogList = [], isLoading } =
    useGetPromotionalCatalogsByMerchantQuery(merchantId, { skip: !merchantId });

  const [createMutation] = useCreatePromotionalCatalogMutation();
  const [updateMutation] = useUpdatePromotionalCatalogMutation();
  const [deleteMutation] = useDeletePromotionalCatalogMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const formErrors = formValidation(name, value, updated);
      return { ...updated, formErrors: { ...prev.formErrors, ...formErrors } };
    });
  };

  const handleChange = ({ name, value }) => updateField(name, value);

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
    } catch (err) {
      console.error(err);
    }
  };

  const buildPayload = (data) => ({
    merchantId,
    title: data.title.trim(),
    DiscountPercentage: data.DiscountPercentage ? Number(data.DiscountPercentage) : 0,
    description: data.description || "",
    offer_details: data.offer_details || "",
    promo_image: data.promo_image || "",
    paymentMethods: data.paymentMethods || [],
    startsOn: data.startsOn ? new Date(data.startsOn).toISOString() : null,
    expiresOn: data.expiresOn ? new Date(data.expiresOn).toISOString() : null,
  });

  const hasErrors = (errors) => Object.values(errors || {}).some((e) => e && e.trim() !== "");

  const handleSubmit = async () => {
    if (!showFormErrors(formData, setFormData, ["formErrors"])) return;
    try {
      setLoading(true);
      if (editingId) {
        const { merchantId: _, ...updatePayload } = buildPayload(formData);
        await updateMutation({ id: editingId, ...updatePayload }).unwrap();
      } else {
        await createMutation(buildPayload(formData)).unwrap();
      }
      setFormData(INITIAL_FORM_DATA);
      setEditingId(null);
      navigateTo?.();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || "",
      DiscountPercentage: item.DiscountPercentage?.toString() || "",
      description: item.description || "",
      offer_details: item.offer_details || "",
      promo_image: item.promo_image || "",
      paymentMethods: item.paymentMethods || [],
      startsOn: item.startsOn ? new Date(item.startsOn) : null,
      expiresOn: item.expiresOn ? new Date(item.expiresOn) : null,
      formErrors: {},
    });
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteMutation(id).unwrap();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = hasErrors(formData.formErrors);

  return (
    <BaseCard title="Create Promotional Catalog (optional)">
      <div className="space-y-4">
        <PromotionalCatalogFormFields
          formData={formData}
          onChange={handleChange}
          onImageUpload={handleImageUpload}
          isUploading={isUploading}
          formErrors={formData.formErrors}
          showAllErrors
        />
        <div className="flex justify-end">
          <CustomButton
            variant="primary"
            label={editingId ? "Update" : "Add"}
            onClick={handleSubmit}
            disabled={isDisabled || isUploading}
            loading={loading}
          />
        </div>
      </div>
      <AutoSkeleton loading={isLoading} config={{ animation: "shimmer" }}>
        <div className="flex flex-wrap gap-3 mt-4">
          {isLoading ? (
            <AutoSkeleton.Repeat count={3}>
              <div className="flex items-center gap-3 border px-4 py-2 rounded-full bg-white shadow-sm">
                <span>Catalog Title</span>
                <i className="pi pi-pencil cursor-pointer" />
                <i className="pi pi-trash text-red-600 cursor-pointer" />
              </div>
            </AutoSkeleton.Repeat>
          ) : (
            promotionalCatalogList.map((item) => (
              <div key={item._id} className="flex items-center gap-3 border px-4 py-2 rounded-full bg-white shadow-sm">
                <span>{item.title}</span>
                <i className="pi pi-pencil cursor-pointer" onClick={() => startEdit(item)} />
                <i className="pi pi-trash text-red-600 cursor-pointer" onClick={() => handleDelete(item._id)} />
              </div>
            ))
          )}
        </div>
      </AutoSkeleton>
    </BaseCard>
  );
}
