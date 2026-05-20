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
  // { name: "kg", value: "kg" },
  // { name: "g", value: "g" },
  { name: "ltr", value: "ltr" },
  { name: "ml", value: "ml" },
  // { name: "pcs", value: "pcs" },
  // { name: "dozen", value: "dozen" },
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
  ageRestriction: "",
  alcoholPercentage: "",
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
  setSelectedPromo,
) => {
  const catalogId = resolveId(item?.catalogId);
  const subCatalogId = resolveId(item?.subCatalogId);
  const promotionalCatalogId = resolveId(item?.promotionalCatalogId);
  setSelectedCatalog(catalogId || null);
  setSelectedSubCatalog(subCatalogId || null);
  setSelectedPromo(promotionalCatalogId || null);
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
    ageRestriction:
      item?.ageRestriction?.toString?.() || item?.ageRestriction || "",
    alcoholPercentage:
      item?.alcoholPercentage?.toString?.() || item?.alcoholPercentage || "",
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

const buildLiquorPayload = (
  formData,
  ctx,
  selectedCatalog,
  selectedSubCatalog,
  selectedPromo,
) => ({
  itemType: ctx.itemType,
  categoryId: ctx.categoryId,
  catalogId: selectedCatalog,
  subCatalogId: selectedSubCatalog || undefined,
  promotionalCatalogId: selectedPromo || undefined,
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
  ageRestriction:
    formData.ageRestriction !== ""
      ? Number(formData.ageRestriction)
      : undefined,
  alcoholPercentage:
    formData.alcoholPercentage !== ""
      ? Number(formData.alcoholPercentage)
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

export default function LiquorMenuForm({
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
  const [selectedSubCatalog, setSelectedSubCatalog] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
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
        mapItemToForm(
          item,
          ctx,
          setSelectedCatalog,
          setSelectedSubCatalog,
          setSelectedPromo,
        ),
      [],
    ),
    buildPayload: useCallback(
      (formData, ctx) =>
        buildLiquorPayload(
          formData,
          ctx,
          selectedCatalog,
          selectedSubCatalog,
          selectedPromo,
        ),
      [selectedCatalog, selectedSubCatalog, selectedPromo],
    ),
    onSuccess: useCallback(() => {
      setSelectedCatalog(null);
      setSelectedSubCatalog(null);
      setSelectedPromo(null);
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

  const handleHide = useCallback(() => {
    setSelectedCatalog(null);
    setSelectedSubCatalog(null);
    setSelectedPromo(null);
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

  const catalogPromoOptions = useMemo(
    () =>
      (promotionalCatalogList || []).map((cat) => ({
        name: cat?.title,
        value: cat?._id,
      })),
    [promotionalCatalogList],
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

  const handleFormSubmit = useCallback(() => {
    const formValid = showFormErrors(data, setData, [
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
    if (!data.expiryDate) {
      extraErrors.expiryDate = "Expiry Date is required";
    }
    if (data.alcoholPercentage === "" || data.alcoholPercentage == null) {
      extraErrors.alcoholPercentage = "Alcohol Percentage is required";
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
    mode === "add" ? "Add Liquor Product" : "Edit Liquor Product";
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

          <div className="sm:col-span-2">
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
              required
              onChange={handleChange}
              minDate={new Date()}
              placeholder="Select expiry date"
              errorMessage={data?.formErrors?.expiryDate}
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
          {/* <div>
            <CustomInput
              label="Age Restriction"
              name="ageRestriction"
              data={data}
              onChange={handleChange}
              onlyPositiveNumber
              maxLength={3}
              placeholder="e.g., 21"
              required={false}
            />
          </div> */}
          <div>
            <CustomInput
              label="Alcohol Percentage (%)"
              name="alcoholPercentage"
              data={data}
              onChange={handleChange}
              onlyPositiveNumber
              maxLength={5}
              placeholder="e.g., 5.5"
              required
              errorMessage={data?.formErrors?.alcoholPercentage}
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
