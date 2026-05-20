import React, { useState, useMemo, useCallback } from "react";
import BaseModal from "@/components/ui/Modal/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import CustomInput from "@/components/forms/CustomInput";
import { CustomToggle } from "@/components/forms/CustomToggle";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import CustomButton from "@/components/ui/Button/Button";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import { showFormErrors, normalizeImageValue } from "@/helpers/commonFunctions";
import { useMenuFormBase } from "../../hooks/forms/useMenuFormBase";
import { CustomTextArea } from "@/components/forms/AllInput";
import CustomCalendar from "@/components/forms/CustomCalendar";

const QUANTITY_UNIT_OPTIONS = [
  { name: "kg", value: "kg" },
  { name: "g", value: "g" },
  // { name: "mg", value: "mg" },
  { name: "ltr", value: "ltr" },
  { name: "ml", value: "ml" },
  { name: "pcs", value: "pcs" },
  // { name: "pack", value: "pack" },
  { name: "dozen", value: "dozen" },
];

const INITIAL_STATE = {
  itemType: "",
  catalogId: "",
  merchantId: "",
  name: "",
  description: "",
  basePrice: "",
  item_img: "",
  availability: true,
  brand: "",
  baseQuantity: { value: "", unit: "" },
  expiryDate: "",
  stockQuantity: "",
  itemVariants: [],
};

const toInputDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const resolveId = (val) => (typeof val === "object" && val !== null ? val._id : val) || "";

const mapItemToForm = (item, ctx, setSelectedCatalog, setSelectedPromo) => {
  const catalogId = resolveId(item?.catalogId);
  setSelectedCatalog(catalogId || null);
  setSelectedPromo(item?.promotionalCatalogId || null);
  return {
    ...INITIAL_STATE,
    itemType: ctx.itemType,
    categoryId: resolveId(item?.categoryId) || ctx.categoryId,
    catalogId,
    merchantId: resolveId(item?.merchantId) || ctx.merchantId,
    name: item?.name || "",
    description: item?.description || "",
    basePrice: item?.basePrice?.toString?.() || item?.basePrice || "",
    item_img: normalizeImageValue(item?.item_img),
    availability: item?.availability ?? true,
    brand: item?.brand || "",
    baseQuantity: {
      value: item?.baseQuantity?.value?.toString?.() || item?.baseQuantity?.value || "",
      unit: item?.baseQuantity?.unit || "",
    },
    expiryDate: toInputDate(item?.expiryDate),
    stockQuantity: item?.stockQuantity?.toString?.() || item?.stockQuantity || "",
    itemVariants: Array.isArray(item?.itemVariants)
      ? item.itemVariants.map((v) => ({
          variantName: v?.variantName || "",
          price: v?.price?.toString?.() || v?.price || "",
          variantImg: v?.variantImg || "",
          quantity: v?.quantity?.toString?.() || v?.quantity || "",
        }))
      : [],
  };
};

const buildGroceryPayload = (formData, ctx, selectedCatalog, selectedPromo) => ({
  itemType: ctx.itemType,
  categoryId: ctx.categoryId,
  catalogId: selectedCatalog,
  promotionalCatalogId: selectedPromo,
  merchantId: ctx.merchantId,
  name: formData.name,
  description: formData.description,
  basePrice: formData.basePrice !== "" ? Number(formData.basePrice) : undefined,
  item_img: formData.item_img,
  availability: formData.availability,
  brand: formData.brand,
  baseQuantity:
    formData.baseQuantity?.value && formData.baseQuantity?.unit
      ? { value: Number(formData.baseQuantity.value), unit: formData.baseQuantity.unit }
      : undefined,
  expiryDate: formData.expiryDate
    ? new Date(formData.expiryDate).toISOString()
    : undefined,
  stockQuantity: formData.stockQuantity !== "" ? Number(formData.stockQuantity) : undefined,
  itemVariants: (formData.itemVariants || [])
    .filter((v) => v.variantName && v.price)
    .map((v) => ({
      variantName: v.variantName,
      price: Number(v.price),
      variantImg: v.variantImg || undefined,
      quantity: v.quantity !== "" ? Number(v.quantity) : undefined,
    })),
});

export default function GroceryMenuForm({
  open,
  visible,
  onHide,
  itemId,
  mode = "add",
  catalogList,
  promotionalCatalogList,
  setMenuData,
}) {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const {
    data,
    setData,
    loading,
    handleChange,
    uploadDocuments,
    handleSubmit: baseSubmit,
    api,
    resetForm,
  } = useMenuFormBase({
    initialState: INITIAL_STATE,
    mode,
    itemId,
    mapItemToForm: useCallback(
      (item, ctx) => mapItemToForm(item, ctx, setSelectedCatalog, setSelectedPromo),
      [],
    ),
    buildPayload: useCallback(
      (formData, ctx) => buildGroceryPayload(formData, ctx, selectedCatalog, selectedPromo),
      [selectedCatalog, selectedPromo],
    ),
    onSuccess: useCallback(() => {
      setSelectedCatalog(null);
      setSelectedPromo(null);
      onHide?.();
      if (typeof setMenuData === "function") setMenuData();
    }, [onHide, setMenuData]),
  });

  const handleHide = useCallback(() => {
    setSelectedCatalog(null);
    setSelectedPromo(null);
    resetForm();
    onHide?.();
  }, [onHide, resetForm]);

  const catalogOptions = useMemo(
    () => (catalogList || []).map((cat) => ({ name: cat?.catalogName, value: cat?._id })),
    [catalogList],
  );

  const catalogPromoOptions = useMemo(
    () => (promotionalCatalogList || []).map((cat) => ({ name: cat?.title, value: cat?._id })),
    [promotionalCatalogList],
  );

  const handleSelectedCatalog = useCallback((e) => {
    const value = e.value;
    setSelectedCatalog(value);
    setData((prev) => ({
      ...prev,
      catalogId: value,
      formErrors: { ...prev.formErrors, catalogId: "" },
    }));
  }, [setData]);

  const handleBaseQuantityChange = useCallback(({ name, value }) => {
    const errorKey = name === "value" ? "baseQuantityValue" : "baseQuantityUnit";
    setData((prev) => ({
      ...prev,
      baseQuantity: { ...prev.baseQuantity, [name]: value },
      formErrors: { ...prev.formErrors, [errorKey]: "" },
    }));
  }, [setData]);

  const uploadVariantImage = useCallback((index) => async (file) => {
    try {
      await api.uploadFile(file, (uploadData) => {
        setData((prev) => {
          const updated = [...prev.itemVariants];
          updated[index] = { ...updated[index], variantImg: uploadData.url };
          return {
            ...prev,
            itemVariants: updated,
            formErrors: { ...prev.formErrors, [`variantImg_${index}`]: "" },
          };
        });
      });
    } catch {
      setData((prev) => ({ ...prev, formErrors: { ...prev.formErrors, variantImg: "Image upload failed. Please try again." } }));
    }
  }, [api.uploadFile, setData]);

  const addVariant = useCallback(() => {
    setData((prev) => ({
      ...prev,
      itemVariants: [...prev.itemVariants, { variantName: "", price: "", variantImg: "", quantity: "" }],
    }));
  }, [setData]);

  const removeVariant = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      itemVariants: prev.itemVariants.filter((_, i) => i !== index),
    }));
  }, [setData]);

  const variantErrorKey = useCallback((field, index) => {
    const keyMap = { variantName: "variantName", price: "variantPrice", quantity: "variantQuantity", variantImg: "variantImg" };
    return `${keyMap[field] || field}_${index}`;
  }, []);

  const updateVariant = useCallback((index, field, value) => {
    const errorKey = variantErrorKey(field, index);
    setData((prev) => {
      const updated = [...prev.itemVariants];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        itemVariants: updated,
        formErrors: { ...prev.formErrors, [errorKey]: "" },
      };
    });
  }, [setData, variantErrorKey]);

  const handleFormSubmit = useCallback(() => {
    const formValid = showFormErrors(data, setData,['expiryDate']);
    let extraErrors = {};
    if (!data.baseQuantity?.value) {
      extraErrors.baseQuantityValue = "Base Quantity is required";
    }
    if (!data.baseQuantity?.unit) {
      extraErrors.baseQuantityUnit = "Unit is required";
    }
    (data.itemVariants || []).forEach((v, i) => {
      if (!v.variantName?.trim()) {
        extraErrors[`variantName_${i}`] = "Variant Name is required";
      }
      if (!v.price && v.price !== 0) {
        extraErrors[`variantPrice_${i}`] = "Price is required";
      }
      if (!v.quantity && v.quantity !== 0) {
        extraErrors[`variantQuantity_${i}`] = "Quantity is required";
      }
      if (!v.variantImg) {
        extraErrors[`variantImg_${i}`] = "Variant Image is required";
      }
    });
    if (Object.keys(extraErrors).length > 0) {
      setData((prev) => ({
        ...prev,
        formErrors: { ...prev.formErrors, ...extraErrors },
      }));
    }
    if (!formValid || Object.keys(extraErrors).length > 0) return;
    baseSubmit();
  }, [data, setData, baseSubmit]);

  if (!visible && !open) return null;

  const headerText = mode === "add" ? "Add Grocery Product" : "Edit Grocery Product";
  const submitLabel = mode === "add" ? "Add Product" : "Save Changes";

  return (
    <BaseModal
      visible={visible}
      onHide={handleHide}
      title={headerText}
      width="min(90vw, 800px)"
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="line"
            label="Cancel"
            onClick={handleHide}
            fullWidth={false}
          />
          <CustomButton
            variant="primary"
            label={submitLabel}
            disabled={api.fileUploadLoading}
            onClick={handleFormSubmit}
            loading={loading}
            fullWidth={false}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <CustomInput
              label="Product Name"
              name="name"
              data={data}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <CustomTextArea
              label="Description"
              name="description"
              data={data}
              onChange={handleChange}
            />
          </div>
          <div>
            <CustomDropdown
              label="Catalog"
              name="catalogId"
              data={data}
              options={catalogOptions}
              value={selectedCatalog}
              onChange={handleSelectedCatalog}
              placeholder="Select Category"
              required
            />
          </div>
          <div className="sm:col-span-1 mb-2">
            <CustomDropdown
              label="Select Promotional Category"
              options={catalogPromoOptions}
              value={selectedPromo}
              onChange={(e) => setSelectedPromo(e.value)}
              placeholder="Select a Promotional Category"
              ignoreError={true}
            />
          </div>
          <div>
            <CustomInput
              label="Price"
              name="basePrice"
              data={data}
              onChange={handleChange}
              onlyPositiveNumber
              currencySymbol="$"
              maxLength={7}
              required
            />
          </div>
           <div>
            <CustomInput
              label="Brand"
              name="brand"
              data={data}
              onChange={handleChange}
              required={false}
            />
          </div>
           <div className="flex gap-2">
            <div className="flex-1">
              <CustomInput
                label="Base Quantity"
                name="value"
                value={data.baseQuantity?.value || ""}
                onChange={(e) => handleBaseQuantityChange({ name: "value", value: e.value })}
                onlyPositiveNumber
                maxLength={7}
                placeholder="e.g., 500"
                required
                errorMessage={data?.formErrors?.baseQuantityValue}
              />
            </div>
            <div className="w-[120px]">
              <CustomDropdown
                label="Unit"
                options={QUANTITY_UNIT_OPTIONS}
                value={data.baseQuantity?.unit || ""}
                onChange={(e) => handleBaseQuantityChange({ name: "unit", value: e.value })}
                placeholder="Unit"
                required
                errorMessage={data?.formErrors?.baseQuantityUnit}
              />
            </div>
          </div>
           <div>
            <CustomCalendar
              label="Expiry Date"
              name="expiryDate"
              data={data}
              required={false}
              onChange={handleChange}
              minDate={new Date()}
              placeholder="Select expiry date"
            />
          </div>
        </div>

        {/* Grocery-Specific Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <CustomInput
              label="Stock Quantity"
              name="stockQuantity"
              data={data}
              onChange={handleChange}
              onlyPositiveNumber
              maxLength={7}
            />
          </div>
          {/* <div className="flex items-center h-full pt-5">
            <CustomToggle
              label="Available"
              name="availability"
              data={data}
              onChange={handleChange}
            />
          </div> */}
        </div>

        {/* Item Variants Section */}
        {/* <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Item Variants</h3>
            <CustomButton
              variant="line"
              label="Add Variant"
              onClick={addVariant}
              fullWidth={false}
              className="text-sm"
            />
          </div>

          {data.itemVariants.length > 0 && (
            <div className="space-y-4">
              {data.itemVariants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CustomInput
                        label="Variant Name"
                        name={`variantName_${index}`}
                        value={variant.variantName}
                        onChange={(e) =>
                          updateVariant(index, "variantName", e.target?.value ?? e.value)
                        }
                        required
                        errorMessage={data?.formErrors?.[`variantName_${index}`]}
                      />
                    </div>
                    <div>
                      <CustomInput
                        label="Price"
                        name={`variantPrice_${index}`}
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(index, "price", e.target?.value ?? e.value)
                        }
                        onlyPositiveNumber
                        maxLength={7}
                        required
                        errorMessage={data?.formErrors?.[`variantPrice_${index}`]}
                      />
                    </div>
                    <div>
                      <CustomInput
                        label="Quantity"
                        name={`variantQuantity_${index}`}
                        value={variant.quantity}
                        onChange={(e) =>
                          updateVariant(index, "quantity", e.target?.value ?? e.value)
                        }
                        onlyPositiveNumber
                        maxLength={7}
                        required
                        errorMessage={data?.formErrors?.[`variantQuantity_${index}`]}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="w-full">
                        <CustomImageUploaderBox
                          name="variantImg"
                          label="Variant Image"
                          data={{ variantImg: variant.variantImg }}
                          onChange={({ value }) =>
                            updateVariant(index, "variantImg", value)
                          }
                          uploadApi={uploadVariantImage(index)}
                          hasError={!!data?.formErrors?.[`variantImg_${index}`]}
                          aspectRatio={361/288}
                          sizeHint="Recommended size: 361 x 288px"
                        />
                        {data?.formErrors?.[`variantImg_${index}`] && (
                          <p className="text-primary 2xl:text-sm lg:text-xs text-[10px] mt-1">
                            {data.formErrors[`variantImg_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <CustomButton
                        variant="line"
                        label="Remove"
                        onClick={() => removeVariant(index)}
                        fullWidth={false}
                        className="text-red-600 hover:text-red-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Product Image */}
        <div>
          <CustomImageUploaderBox
            name="item_img"
            label="Product Images"
            data={data}
            onChange={handleChange}
            uploadApi={uploadDocuments}
            multiple
            aspectRatio={361 / 288}
            sizeHint="Recommended size: 361 x 288px"
            hasError={!!data?.formErrors?.item_img}
            isUploading={api.fileUploadLoading}
          />
          {data?.formErrors?.item_img && (
            <p className="text-primary 2xl:text-sm lg:text-xs text-[10px] mt-1">
              {/* {data.formErrors.item_img}sss */}
              product image required
            </p>
          )}
        </div>
      </div>

      {(loading) && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
          <ClipLoader size={40} color="#ff69b4" />
        </div>
      )}
    </BaseModal>
  );
}
