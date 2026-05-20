import { ArrowLeft } from "lucide-react";
import CustomInput from "@/components/forms/CustomInput";
import { CustomPhoneInput } from "@/components/forms/CustomPhoneInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomSwitch } from "@/components/forms/CustomSwitch";
import CustomButton from "@/components/ui/Button/Button";
import BaseCard from "@/components/ui/Card/Card";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import PermissionsEditor from "@features/businessStaff/components/PermissionsEditor";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { STAFF_ROLE_OPTIONS } from "@/helpers/constants/staffConstants";
import { useStaffForm } from "../hooks";

export default function StaffForm() {
  const {
    isEdit,
    navigate,
    merchantOptions,
    loadFetch,
    errors,
    form,
    loading,
    handleChange,
    setPermissions,
    toggleMerchant,
    setRole,
    handleSubmit,
    handleUploadProfilePic,
  } = useStaffForm();

  return (
    <AutoSkeleton loading={loadFetch} config={{ animation: "shimmer" }}>
      <div className="w-full">
        <button
          type="button"
          onClick={() => navigate("/staff")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Staff
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          {errors._ && (
            <p className="text-error text-sm bg-error-50 px-3 py-2 rounded-lg">
              {errors._}
            </p>
          )}

          {/* Profile + Basic Info — side-by-side layout matching design */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left: Profile Card */}
            <BaseCard extraClassName="flex flex-col items-center text-center gap-4 lg:w-[280px] shrink-0">
              <div className="w-full">
                <CustomImageUploaderBox
                  name="profilePic"
                  label=""
                  data={form}
                  required={false}
                  onChange={handleChange}
                  uploadApi={handleUploadProfilePic}
                  aspectRatio={1 / 1}
                  sizeHint="Recommended: 1:1 (e.g. 500×500px)"
                />
              </div>
              {form.name && (
                <div>
                  <p className="font-bold text-gray-900 text-sm">{form.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {form.roles?.[0]?.role
                      ?.replace(/_/g, " ")
                      ?.toLowerCase()
                      ?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
                      "Staff Member"}
                  </p>
                </div>
              )}
              {isEdit && (
                <div className="w-full border-t border-gray-100 pt-3 flex justify-between items-start">
                  <div className="text-left">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      Status
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        form.isActive ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {form.isActive ? "Member Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <CustomSwitch
                      name="isActive"
                      hideSwitchText
                      ignoreLabel
                      ignoreError
                      value={form.isActive}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </BaseCard>

            {/* Right: Basic Info Fields */}
            <BaseCard extraClassName="flex-1">
              <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <i className="pi pi-user text-[14px]"></i>
                </span>
                Basic Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <CustomInput
                  name="name"
                  label="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  errorMessage={errors.name}
                />
                <CustomInput
                  name="email"
                  type="email"
                  label="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                  errorMessage={errors.email}
                />
                <div className="sm:col-span-2">
                  <CustomPhoneInput
                    name="phone"
                    label="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+971 50 123 4567"
                    required
                    errorMessage={errors.phone}
                  />
                </div>
              </div>
            </BaseCard>
          </div>

          <BaseCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Role & merchants
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomDropdown
                name="role"
                label="Role"
                value={form.roles?.[0]?.role}
                onChange={setRole}
                options={STAFF_ROLE_OPTIONS}
                optionLabel="label"
                optionValue="value"
                placeholder="Select role"
              />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to merchants
                </label>
                {errors.merchantIds && (
                  <p className="text-error text-sm mb-1">
                    {errors.merchantIds}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {merchantOptions.length === 0 && (
                    <span className="text-gray-500 text-sm">
                      No merchants found for this owner.
                    </span>
                  )}
                  {merchantOptions.map((m) => {
                    const mid = m._id || m.id;
                    const checked = (
                      form.roles?.[0]?.merchantIds || []
                    ).includes(mid);
                    const label =
                      m.businessName ||
                      m.business?.businessName ||
                      m.name ||
                      mid;
                    return (
                      <label
                        key={mid}
                        className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMerchant(mid)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </BaseCard>

          <BaseCard>
            <PermissionsEditor
              value={form.roles?.[0]?.permissions}
              onChange={setPermissions}
              disabled={loading}
            />
          </BaseCard>

          {/* Sticky bottom action bar */}
          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-end gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
            <CustomButton
              type="button"
              label="Cancel"
              variant="gray"
              onClick={() => navigate("/staff")}
              disabled={loading}
            />
            <CustomButton
              type="submit"
              label={isEdit ? "Update" : "Create"}
              variant="primary"
              loading={loading}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </AutoSkeleton>
  );
}
