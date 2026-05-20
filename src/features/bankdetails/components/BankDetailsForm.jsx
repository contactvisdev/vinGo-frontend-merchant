import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import CustomInput from "@/components/forms/CustomInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomSwitch } from "@/components/forms/CustomSwitch";
import CustomButton from "@/components/ui/Button/Button";
import { COUNTRY_OPTIONS, COUNTRY_NAME_TO_CODE } from "@/helpers/constants/countries";
import { getFieldsForCountry } from "../helpers/bankValidation";

export default function BankDetailsForm({
  form,
  errors,
  loading,
  isEdit,
  onChange,
  onSubmit,
  onCancel,
}) {
  const countryCode = COUNTRY_NAME_TO_CODE[form.country] || "";
  const bankFields = useMemo(() => getFieldsForCountry(countryCode), [countryCode]);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 transition-opacity duration-200 mt-3"
      style={{ opacity: loading ? 0.85 : 1 }}
    >
      {errors._ && (
        <div
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-red-700 text-sm border border-red-100 transition-opacity duration-200"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errors._}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 w-full *:min-w-0">
        <CustomDropdown
          name="country"
          label="Country"
          value={form.country}
          onChange={(e) => onChange({ name: "country", value: e.value ?? "" })}
          options={COUNTRY_OPTIONS}
          optionLabel="name"
          optionValue="value"
          placeholder="Select country"
          required
          errorMessage={errors.country}
          maxHeight="240px"
          filter
          filterPlaceholder="Search countries"
        />

        <CustomInput
          name="bankName"
          label="Bank Name"
          value={form.bankName}
          onChange={onChange}
          placeholder="e.g. HDFC Bank"
          required
          errorMessage={errors.bankName}
        />

        <CustomInput
          name="accountHolderName"
          label="Account Holder Name"
          value={form.accountHolderName}
          onChange={onChange}
          placeholder="John Doe"
          required
          errorMessage={errors.accountHolderName}
        />

        {/* Country-specific bank fields */}
        {bankFields.map(({ name, label, placeholder, required }) => (
          <CustomInput
            key={name}
            name={name}
            label={label}
            value={form[name] || ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            errorMessage={errors[name]}
          />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 transition-colors duration-200 hover:bg-gray-50 focus-within:bg-primary-50/30 focus-within:border-primary-200">
        <CustomSwitch
          name="isPrimary"
          label="Set as primary account"
          value={form.isPrimary}
          onChange={onChange}
        />
        <p className="text-gray-500 text-xs mt-1.5 ml-0">
          Payouts will be sent to this account by default when enabled.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 mb-4">
        <CustomButton
          type="button"
          label="Cancel"
          variant="gray"
          onClick={onCancel}
          disabled={loading}
        />
        <CustomButton
          type="submit"
          label={isEdit ? "Update" : "Add"}
          variant="primary"
          loading={loading}
          disabled={loading}
        />
      </div>
    </form>
  );
}
