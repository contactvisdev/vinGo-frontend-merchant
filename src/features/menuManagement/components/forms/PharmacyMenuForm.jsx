import { useState, useMemo, useCallback } from "react";
import BaseModal from "@/components/ui/Modal/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import CustomInput from "@/components/forms/CustomInput";
import { CustomToggle } from "@/components/forms/CustomToggle";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomTextArea } from "@/components/forms/CustomTextArea";
import CustomButton from "@/components/ui/Button/Button";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import CustomCalendar from "@/components/forms/CustomCalendar";
import { showFormErrors, normalizeImageValue } from "@/helpers/commonFunctions";
import { useMenuFormBase } from "../../hooks/forms/useMenuFormBase";
import { useGetSubCatalogsQuery } from "@/store/api/subCatalogApi";

const QUANTITY_UNIT_OPTIONS = [
  { name: "mg", value: "mg" },
  { name: "g", value: "g" },
  { name: "kg", value: "kg" },
  { name: "ml", value: "ml" },
  { name: "ltr", value: "ltr" },
  { name: "pcs", value: "pcs" },
  { name: "dozen", value: "dozen" },
];

const INITIAL_STATE = {
  itemType: "",
  catalogId: "",
  subCatalogId: "",
  merchantId: "",
  name: "",
  description: "",
  basePrice: "",
  item_img: "",
  availability: true,
  stockQuantity: "",
  baseQuantity: { value: "", unit: "" },
  expiryDate: "",
  addOns: [],
  itemVariants: [],
};

const resolveId = (val) =>
  (typeof val === "object" && val !== null ? val._id : val) || "";

const mapItemToForm = (
  item,
  ctx,
  setSelectedCatalog,
  setSelectedSubCatalog,
) => {
  const catalogId = resolveId(item?.catalogId);
  const subCatalogId = resolveId(item?.subCatalogId);
  setSelectedCatalog(catalogId || null);
  setSelectedSubCatalog(subCatalogId || null);
  return {
    ...INITIAL_STATE,
    itemType: ctx.itemType,
    catalogId,
    subCatalogId,
    merchantId: resolveId(item?.merchantId) || ctx.merchantId,
    name: item?.name || "",
    description: item?.description || "",
    basePrice: item?.basePrice?.toString?.() || item?.basePrice || "",
    item_img: normalizeImageValue(item?.item_img),
    availability: item?.availability ?? true,
    stockQuantity:
      item?.stockQuantity?.toString?.() || item?.stockQuantity || "",
    baseQuantity: {
      value:
        item?.baseQuantity?.value?.toString?.() ||
        item?.baseQuantity?.value ||
        "",
      unit: item?.baseQuantity?.unit || "",
    },
    expiryDate: item?.expiryDate ? new Date(item.expiryDate) : "",
    addOns: Array.isArray(item?.addOns)
      ? item.addOns.map((a) => ({
          addOnName: a?.addOnName || "",
          addOnPrice: a?.addOnPrice?.toString?.() || a?.addOnPrice || "",
          addOnImg: a?.addOnImg || "",
        }))
      : [],
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

const buildPharmacyPayload = (
  formData,
  ctx,
  selectedCatalog,
  selectedSubCatalog,
) => ({
  itemType: ctx.itemType,
  categoryId: ctx.categoryId,
  catalogId: selectedCatalog,
  subCatalogId: selectedSubCatalog || undefined,
  merchantId: ctx.merchantId,
  name: formData.name,
  description: formData.description,
  basePrice: formData.basePrice !== "" ? Number(formData.basePrice) : undefined,
  item_img: formData.item_img,
  availability: formData.availability,
  stockQuantity:
    formData.stockQuantity !== "" ? Number(formData.stockQuantity) : undefined,
  baseQuantity:
    formData.baseQuantity?.value && formData.baseQuantity?.unit
      ? {
          value: Number(formData.baseQuantity.value),
          unit: formData.baseQuantity.unit,
        }
      : undefined,
  expiryDate: formData.expiryDate
    ? new Date(formData.expiryDate).toISOString()
    : undefined,
  addOns: (formData.addOns || [])
    .filter((a) => a.addOnName && a.addOnPrice)
    .map((a) => ({
      addOnName: a.addOnName,
      addOnPrice: Number(a.addOnPrice),
      addOnImg: a.addOnImg || undefined,
    })),
  itemVariants: (formData.itemVariants || [])
    .filter((v) => v.variantName && v.price)
    .map((v) => ({
      variantName: v.variantName,
      price: Number(v.price),
      variantImg: v.variantImg || undefined,
      quantity: v.quantity !== "" ? Number(v.quantity) : undefined,
    })),
});

export default function PharmacyMenuForm({
  open,
  visible,
  onHide,
  itemId,
  mode = "add",
  catalogList,
  setMenuData,
}) {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedSubCatalog, setSelectedSubCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState("");

  const {
    data,
    setData,
    loading,
    handleChange,
    uploadDocuments,
    handleSubmit: baseSubmit,
    api,
    ctx,
    resetForm,
  } = useMenuFormBase({
    initialState: INITIAL_STATE,
    mode,
    itemId,
    mapItemToForm: useCallback(
      (item, ctx) =>
        mapItemToForm(item, ctx, setSelectedCatalog, setSelectedSubCatalog),
      [],
    ),
    buildPayload: useCallback(
      (formData, ctx) =>
        buildPharmacyPayload(
          formData,
          ctx,
          selectedCatalog,
          selectedSubCatalog,
        ),
      [selectedCatalog, selectedSubCatalog],
    ),
    onSuccess: useCallback(() => {
      setSelectedCatalog(null);
      setSelectedSubCatalog(null);
      setCatalogError("");
      onHide?.();
      if (typeof setMenuData === "function") setMenuData();
    }, [onHide, setMenuData]),
  });

  const {
    data: subCatalogList = [],
    isLoading: isSubCatalogLoading,
    isFetching: isSubCatalogFetching,
  } = useGetSubCatalogsQuery(
    { merchantId: ctx.merchantId, catalogId: selectedCatalog },
    { skip: !ctx.merchantId || !selectedCatalog },
  );
  const subCatalogLoading = isSubCatalogLoading || isSubCatalogFetching;

  console.log(ctx);

  const handleHide = useCallback(() => {
    setSelectedCatalog(null);
    setSelectedSubCatalog(null);
    setCatalogError("");
    resetForm();
    onHide?.();
  }, [onHide, resetForm]);

  const catalogOptions = useMemo(
    () =>
      (catalogList || []).map((cat) => ({
        name: cat?.catalogName,
        value: cat?._id,
      })),
    [catalogList],
  );

  const subCatalogOptions = useMemo(
    () =>
      (subCatalogList || []).map((subCat) => ({
        name: subCat?.name,
        value: subCat?._id,
      })),
    [subCatalogList],
  );

  const handleSelectedCatalog = useCallback(
    (e) => {
      const value = e.value;
      setSelectedCatalog(value);
      setSelectedSubCatalog(null);
      setCatalogError("");
      setData((prev) => ({
        ...prev,
        catalogId: value,
        subCatalogId: "",
        formErrors: {
          ...prev.formErrors,
          catalogId: "",
          subCatalogId: "",
        },
      }));
    },
    [setData],
  );

  const handleSelectedSubCatalog = useCallback(
    (e) => {
      const value = e.value;
      setSelectedSubCatalog(value);
      setData((prev) => ({
        ...prev,
        subCatalogId: value,
        formErrors: { ...prev.formErrors, subCatalogId: "" },
      }));
    },
    [setData],
  );

  const handleBaseQuantityChange = useCallback(
    ({ name, value }) => {
      const errorKey =
        name === "value" ? "baseQuantityValue" : "baseQuantityUnit";
      setData((prev) => ({
        ...prev,
        baseQuantity: { ...prev.baseQuantity, [name]: value },
        formErrors: { ...prev.formErrors, [errorKey]: "" },
      }));
    },
    [setData],
  );

  const uploadAddOnImage = useCallback(
    (index) => async (file) => {
      try {
        await api.uploadFile(file, (uploadData) => {
          setData((prev) => {
            const updatedAddOns = [...prev.addOns];
            updatedAddOns[index] = {
              ...updatedAddOns[index],
              addOnImg: uploadData.url,
            };
            return { ...prev, addOns: updatedAddOns };
          });
        });
      } catch {
        // handled by hook
      }
    },
    [api.uploadFile, setData],
  );

  const addAddOn = useCallback(() => {
    setData((prev) => ({
      ...prev,
      addOns: [...prev.addOns, { addOnName: "", addOnPrice: "", addOnImg: "" }],
    }));
  }, [setData]);

  const removeAddOn = useCallback(
    (index) => {
      setData((prev) => ({
        ...prev,
        addOns: prev.addOns.filter((_, i) => i !== index),
      }));
    },
    [setData],
  );

  const updateAddOn = useCallback(
    (index, field, value) => {
      setData((prev) => {
        const updatedAddOns = [...prev.addOns];
        updatedAddOns[index] = { ...updatedAddOns[index], [field]: value };
        return { ...prev, addOns: updatedAddOns };
      });
    },
    [setData],
  );

  const uploadVariantImage = useCallback(
    (index) => async (file) => {
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
        // handled by hook
      }
    },
    [api.uploadFile, setData],
  );

  const addVariant = useCallback(() => {
    setData((prev) => ({
      ...prev,
      itemVariants: [
        ...prev.itemVariants,
        { variantName: "", price: "", variantImg: "", quantity: "" },
      ],
    }));
  }, [setData]);

  const removeVariant = useCallback(
    (index) => {
      setData((prev) => ({
        ...prev,
        itemVariants: prev.itemVariants.filter((_, i) => i !== index),
      }));
    },
    [setData],
  );

  const updateVariant = useCallback(
    (index, field, value) => {
      const keyMap = {
        variantName: "variantName",
        price: "variantPrice",
        quantity: "variantQuantity",
        variantImg: "variantImg",
      };
      const errorKey = `${keyMap[field] || field}_${index}`;
      setData((prev) => {
        const updated = [...prev.itemVariants];
        updated[index] = { ...updated[index], [field]: value };
        return {
          ...prev,
          itemVariants: updated,
          formErrors: { ...prev.formErrors, [errorKey]: "" },
        };
      });
    },
    [setData],
  );

  const handleFormSubmit = useCallback(() => {
    const formValid = showFormErrors(data, setData, [
      "expiryDate",
      "catalogId",
      "addOns",
      "itemVariants",
    ]);

    let extraErrors = {};
    if (!selectedCatalog) {
      setCatalogError("Please select a category");
      extraErrors._catalog = true;
    }
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
    });

    if (Object.keys(extraErrors).length > 0) {
      const { _catalog, ...fieldErrors } = extraErrors;
      if (Object.keys(fieldErrors).length > 0) {
        setData((prev) => ({
          ...prev,
          formErrors: { ...prev.formErrors, ...fieldErrors },
        }));
      }
    }

    if (!formValid || Object.keys(extraErrors).length > 0) return;
    baseSubmit();
  }, [selectedCatalog, data, setData, baseSubmit]);

  if (!visible && !open) return null;

  const headerText =
    mode === "add" ? "Add Pharmacy Product" : "Edit Pharmacy Product";
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
            className="whitespace-nowrap"
            fullWidth={false}
          />
          <CustomButton
            variant="primary"
            label={submitLabel}
            onClick={handleFormSubmit}
            disabled={api.fileUploadLoading}
            loading={loading}
            className="whitespace-nowrap"
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
              required
              onChange={handleChange}
              maxLength={300}
            />
          </div>
          <div>
            <CustomDropdown
              label="Category"
              name="catalogId"
              options={catalogOptions}
              value={selectedCatalog}
              onChange={handleSelectedCatalog}
              placeholder="Select Category"
              required
              errorMessage={catalogError}
            />
          </div>
          <div>
            <CustomDropdown
              label="Sub Category"
              options={subCatalogOptions}
              value={selectedSubCatalog}
              onChange={handleSelectedSubCatalog}
              placeholder="Select Sub Category"
              loading={subCatalogLoading}
              disabled={!selectedCatalog || subCatalogLoading}
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
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomInput
                label="Base Quantity"
                name="value"
                value={data.baseQuantity?.value || ""}
                onChange={(e) =>
                  handleBaseQuantityChange({ name: "value", value: e.value })
                }
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
                onChange={(e) =>
                  handleBaseQuantityChange({ name: "unit", value: e.value })
                }
                placeholder="Unit"
                required
                errorMessage={data?.formErrors?.baseQuantityUnit}
              />
            </div>
          </div>
        </div>

        {/* Base Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          aspectRatio={361 / 288}
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
        </div>

        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add-Ons</h3>
            <CustomButton
              variant="line"
              label="Add Add-On"
              onClick={addAddOn}
              fullWidth={false}
              className="text-sm"
            />
          </div>

          {data.addOns.length > 0 && (
            <div className="space-y-4">
              {data.addOns.map((addOn, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <CustomInput
                        label="Add-On Name"
                        name={`addOnName_${index}`}
                        value={addOn.addOnName}
                        onChange={(e) =>
                          updateAddOn(index, "addOnName", e.target?.value ?? e.value)
                        }
                      />
                    </div>
                    <div>
                      <CustomInput
                        label="Add-On Price"
                        name={`addOnPrice_${index}`}
                        value={addOn.addOnPrice}
                        onChange={(e) =>
                          updateAddOn(index, "addOnPrice", e.target?.value ?? e.value)
                        }
                        onlyPositiveNumber
                        maxLength={7}
                      />
                    </div>
                    <div className="flex items-end">
                      <CustomImageUploaderBox
                        name="addOnImg"
                        label="Add-On Image"
                        data={{ addOnImg: addOn.addOnImg }}
                        onChange={({ value }) =>
                          updateAddOn(index, "addOnImg", value)
                        }
                        uploadApi={uploadAddOnImage(index)}
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <CustomButton
                        variant="line"
                        label="Remove"
                        onClick={() => removeAddOn(index)}
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
              Product image required
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
          <ClipLoader size={40} color="#ff69b4" />
        </div>
      )}
    </BaseModal>
  );
}
