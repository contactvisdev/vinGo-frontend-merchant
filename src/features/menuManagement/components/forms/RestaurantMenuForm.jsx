import ClipLoader from "react-spinners/ClipLoader";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomInput from "@/components/forms/CustomInput";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import { CustomRadio } from "@/components/forms/CustomRadio";
import { CustomTextArea } from "@/components/forms/CustomTextArea";
import { CustomToggle } from "@/components/forms/CustomToggle";
import CustomButton from "@/components/ui/Button/Button";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import DynamicItemList from "./DynamicItemList";
import { useRestaurantMenuForm } from "../../hooks/forms/useRestaurantMenuForm";

function DropdownsAndNameSection({
  catalogOptions,
  foodTypeOptions,
  foodTypesLoading,
  catalogPromoOptions,
  dropdownValues,
  dropdownErrors,
  handleDropdownChange,
  handleChange,
  data,
  mode,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 menu-row">
      <div className="sm:col-span-1">
        <CustomInput
          label="Item Name"
          name="name"
          onChange={handleChange}
          data={data}
          placeholder='Please enter an item name (e.g. "Margherita Pizza")'
          // errorMessage={data?.formErrors?.name && "Please enter an item name"}
        />
      </div>
      <div className="sm:col-span-1">
        <CustomDropdown
          label="Select Catalog"
          options={catalogOptions}
          value={dropdownValues.catalog}
          onChange={(e) => handleDropdownChange("catalog", e.value)}
          placeholder="Select a Catalog"
          // ignoreError={true}
          errorMessage={dropdownErrors.catalog}
          required
        />
        {/* <p className={`text-error min-h-5 2xl:text-xs lg:text-[10px] text-[8px] ${dropdownErrors.catalog ? "visible" : "invisible"}`}>
          {dropdownErrors.catalog || "\u00A0"}
        </p> */}
      </div>

      <div className="sm:col-span-1">
        <CustomDropdown
          label="Food Type"
          options={foodTypeOptions}
          value={dropdownValues.foodType}
          onChange={(e) => handleDropdownChange("foodType", e.value)}
          placeholder="Select Food Type"
          loading={foodTypesLoading}
          filter
          errorMessage={dropdownErrors.foodType}
          filterBy="name"
          required
        />
        {/* <p className={`text-error min-h-5 2xl:text-xs lg:text-[10px] text-[8px] ${dropdownErrors.foodType ? "visible" : "invisible"}`}>
          {dropdownErrors.foodType || "\u00A0"}
        </p> */}
      </div>

      <div className="sm:col-span-1 mb-2">
        <CustomDropdown
          label="Select Promotional Category"
          options={catalogPromoOptions}
          value={dropdownValues.promo}
          onChange={(e) => handleDropdownChange("promo", e.value)}
          placeholder="Select a Promotional Category"
          ignoreError={true}
        />
        {/* <p className={`text-error min-h-5 2xl:text-xs lg:text-[10px] text-[8px] ${dropdownErrors.promo ? "visible" : "invisible"}`}>
          {dropdownErrors.promo || "\u00A0"}
        </p> */}
      </div>
    </div>
  );
}

function PriceAndTimeSection({
  handleChange,
  data,
  dropdownValues,
  dropdownErrors,
  handleDropdownChange,
  prepTimeOptions,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 menu-row">
      <div className="sm:col-span-1 mb-2">
        <CustomInput
          label="Price"
          name="basePrice"
          onChange={handleChange}
          data={data}
          currencySymbol="$"
          onlyPositiveNumber
          maxLength={7}
          errorMessage={
            data?.formErrors?.basePrice && "Please enter a valid price"
          }
        />
      </div>
      <div className="sm:col-span-1">
        <CustomDropdown
          label="Preparation Time"
          name="preparationTime"
          options={prepTimeOptions}
          required
          value={dropdownValues.prepTime}
          onChange={(e) => handleDropdownChange("prepTime", e.value)}
          placeholder="Select Time"
          errorMessage={
            dropdownErrors.prepTime && "Please select preparation time"
          }
        />
      </div>
    </div>
  );
}

function ImageAndAvailabilitySection({
  data,
  handleChange,
  uploadDocument,
  isUploading,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <div className="relative">
        <CustomImageUploaderBox
          name="item_img"
          data={data}
          onChange={handleChange}
          uploadApi={uploadDocument}
          isUploading={isUploading}
          hasError={!!data?.formErrors?.item_img}
          aspectRatio={361 / 288}
          sizeHint="Recommended size: 361 x 288px"
        />

<p
            className={`text-error min-h-5 text-[14px] mt-1 ${data?.formErrors?.item_img ? "visible" : "invisible"}`}
        >
          {(data?.formErrors?.item_img && "Image is required") || "\u00A0"}
        </p>
      </div>

      <div className="space-y-4">
        <label className="2xl:text-base lg:text-sm text-xs text-neutral-900 block mb-1">
          Availability
        </label>
        <CustomToggle
          name="availability"
          data={data}
          onChange={handleChange}
          label="In Stock"
        />

        <div>
          <label className="font-medium text-sm mb-2 flex gap-[2px]">
            Veg/Non-Veg
            <i className="pi pi-asterisk -mt-1" />
          </label>
          <div className="flex items-center gap-6">
            <CustomRadio
              name="foodType"
              value="veg"
              label="Veg"
              color="green"
              data={data}
              onChange={handleChange}
            />
            <CustomRadio
              name="foodType"
              value="non-veg"
              label="Non-Veg"
              color="red"
              data={data}
              onChange={handleChange}
            />
          </div>
          <p
            className={`text-error min-h-5  text-[14px] mt-1 ${data?.formErrors?.foodType ? "visible" : "invisible"}`}
          >
            {data?.formErrors?.foodType || "\u00A0"}
          </p>
        </div>
      </div>
    </div>
  );
}

function DefaultVariantSection({ data, handleChange, onDefaultChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 items-start">
      <div className="sm:col-span-1 flex items-center pt-2">
        <CustomCheckbox
          name="isDefaultVariant"
          label="Mark as Default Variant"
          data={data}
          onChange={onDefaultChange}
        />
      </div>
      <div className="sm:col-span-1">
        <CustomInput
          label="Variant Name"
          name="defaultVariantName"
          onChange={handleChange}
          data={data}
          placeholder="e.g. Regular"
          errorMessage={data?.formErrors?.defaultVariantName}
        />
      </div>
    </div>
  );
}

function FormActions({ onHide, onSubmit, submitButtonLabel, disabled }) {
  return (
    <div className="flex justify-end px-6 gap-3 py-4 rounded-b-2xl">
      <CustomButton
        variant="gray"
        onClick={onHide}
        className="w-[15%]! border-neutral-600!"
        label="Cancel"
        fullWidth={false}
      />
      <CustomButton
        variant="primary"
        label={submitButtonLabel}
        fullWidth={false}
        className="whitespace-nowrap"
        onClick={onSubmit}
        disabled={disabled}
      />
    </div>
  );
}

export default function RestaurantMenuForm({
  open,
  catalogList,
  promotionalCatalogList,
  setMenuData,
  visible,
  onHide,
  itemId,
  mode = "add",
}) {
  const {
    data,
    loading,
    api,
    handleChange,
    handleTopLevelDefaultChange,
    uploadDocument,
    dropdownValues,
    dropdownErrors,
    handleDropdownChange,
    catalogOptions,
    catalogPromoOptions,
    foodTypeOptions,
    foodTypesLoading,
    variantHandlers,
    addonHandlers,
    handleFormSubmit,
    PREP_TIME_OPTIONS,
  } = useRestaurantMenuForm({
    catalogList,
    promotionalCatalogList,
    setMenuData,
    onHide,
    itemId,
    mode,
    visible,
  });

  if (!visible && !open) return null;

  const headerText = mode === "add" ? "Add Menu Items" : "Edit Menu Items";
  const submitButtonLabel = mode === "add" ? "Add" : "Save Changes";
  return (
    <BaseModal
      visible={visible}
      onHide={onHide}
      title={headerText}
      width="min(90vw, 960px)"
      contentClassName="p-0"
      footer={
        <FormActions
          onHide={onHide}
          onSubmit={handleFormSubmit}
          submitButtonLabel={submitButtonLabel}
          disabled={api.fileUploadLoading}
        />
      }
    >
      <div
        className="overflow-auto hide-scrollbar"
        style={{ maxHeight: "70vh" }}
      >
        <div className="mt-4">
          <DropdownsAndNameSection
            catalogOptions={catalogOptions}
            foodTypeOptions={foodTypeOptions}
            foodTypesLoading={foodTypesLoading}
            catalogPromoOptions={catalogPromoOptions}
            dropdownValues={dropdownValues}
            dropdownErrors={dropdownErrors}
            handleDropdownChange={handleDropdownChange}
            handleChange={handleChange}
            data={data}
            mode={mode}
          />

          <div>
            <CustomTextArea
              label="Short Description"
              name="description"
              required
              className={"hide-scrollbar"}
              onChange={handleChange}
              data={data}
              maxLength={300}
            />
            <p
              className={`text-xs mt-1 text-right ${(data?.description?.length || 0) > 300 ? "text-primary" : "text-neutral-400"}`}
            >
              {data?.description?.length || 0}/300
            </p>
          </div>

          <PriceAndTimeSection
            handleChange={handleChange}
            data={data}
            dropdownValues={dropdownValues}
            dropdownErrors={dropdownErrors}
            handleDropdownChange={handleDropdownChange}
            prepTimeOptions={PREP_TIME_OPTIONS}
          />

          <ImageAndAvailabilitySection
            data={data}
            handleChange={handleChange}
            uploadDocument={uploadDocument}
            isUploading={api.fileUploadLoading}
          />
          <div className="">
            {/* <DefaultVariantSection
              data={data}
              handleChange={handleChange}
              onDefaultChange={handleTopLevelDefaultChange}
            /> */}
          </div>

          <div className="p-4 sm:p-6 space-y-5 m-0">
            <DynamicItemList
              items={data.variants}
              title="Variants"
              buttonLabel="Add Variant"
              nameLabel="Variant Name"
              onAdd={variantHandlers.handleAdd}
              onRemove={variantHandlers.handleRemove}
              onChange={variantHandlers.handleChange}
              errors={data.formErrors || {}}
              prefix="variant"
              showDefaultCheckbox
            />
            {data?.formErrors?.defaultVariantRequired && (
              <p className="text-error text-[14px] px-4 sm:px-6 mt-1">
                {data.formErrors.defaultVariantRequired}
              </p>
            )}
            <DynamicItemList
              items={data.addons}
              title="Add-Ons"
              buttonLabel="Add Add-on"
              nameLabel="Add-on Name"
              onAdd={addonHandlers.handleAdd}
              onRemove={addonHandlers.handleRemove}
              onChange={addonHandlers.handleChange}
              errors={data.formErrors || {}}
              prefix="addon"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
          <ClipLoader
            size={40}
            color="#ff69b4"
            cssOverride={{ borderWidth: "4px" }}
          />
        </div>
      )}
    </BaseModal>
  );
}
