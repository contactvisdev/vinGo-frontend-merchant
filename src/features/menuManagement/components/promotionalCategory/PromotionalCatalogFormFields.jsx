import React from "react";
import CustomInput from "@/components/forms/CustomInput";
import { CustomTextArea } from "@/components/forms/CustomTextArea";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import { CustomMultiSelect } from "@/components/forms/AllInput";
import CustomCalendar from "@/components/forms/CustomCalendar";
import { PAYMENT_METHOD_OPTIONS } from "../../constants";

export default function PromotionalCatalogFormFields({
  formData,
  onChange,
  onImageUpload,
  isUploading,
  formErrors,
  showAllErrors,
}) {
  const renderError = (field) => {
    const hasError = formErrors?.[field];
    if (!showAllErrors && !hasError) return null;
    return (
      <small
        className={`text-error min-h-5 block mt-1 text-sm ${hasError ? "visible" : "invisible"}`}
      >
        {hasError || "\u00A0"}
      </small>
    );
  };

  return (
    <div className="space-y-4 ">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <CustomInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            errorMessage={formErrors?.title}
          />
        </div>
        <div>
          <CustomInput
            label="Discount"
            name="DiscountPercentage"
            value={formData.DiscountPercentage}
            onChange={onChange}
            currencySymbol="%"
            symbolPosition="right"
            onlyPositiveNumber
            placeholder="0.00"
            required
            errorMessage={formErrors?.DiscountPercentage}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) =>
            onChange({ name: "description", value: e.target.value })
          }
          rows={3}
          placeholder="Enter description"
          className={`w-full border rounded-lg px-4 py-2 ${formErrors?.description ? "border-error!" : "border-neutral-400"}`}
        />
        {renderError("description")}
      </div>

      <div>
        <CustomTextArea
          name="offer_details"
          label="Offer Details"
          data={formData}
          value={formData.offer_details ?? ""}
          onChange={onChange}
          required
          placeholder="Enter one offer detail per line"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Promo Image <span className="text-danger">*</span>
        </label>
        <CustomImageUploaderBox
          name="promo_image"
          data={formData}
          onChange={onChange}
          uploadApi={onImageUpload}
          isUploading={isUploading}
          hasError={!!formErrors?.promo_image}
          aspectRatio ={331/161}
          sizeHint="Recommended size: 331 x 161px"
        />
        {renderError("promo_image")}
      </div>

      <div>
        <CustomMultiSelect
          label="Payment Methods"
          name="paymentMethods"
          required
          value={formData.paymentMethods}
          options={PAYMENT_METHOD_OPTIONS}
          onChange={(e) =>
            onChange({ name: "paymentMethods", value: e.value })
          }
          placeholder="Select payment methods"
          display="chip"
          // filter
          errorMessage={formErrors?.paymentMethods}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <CustomCalendar
            label="Starts On"
            name="startsOn"
            value={formData.startsOn}
            onChange={onChange}
            showTime
            required
            errorMessage={formErrors?.startsOn}
          />
        </div>
        <div>
          <CustomCalendar
            label="Expires On"
            name="expiresOn"
            value={formData.expiresOn}
            onChange={onChange}
            showTime
            minDate={new Date()}
            required
            errorMessage={formErrors?.expiresOn}
          />
        </div>
      </div>
    </div>
  );
}
