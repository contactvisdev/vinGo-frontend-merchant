import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import BaseCard from "@/components/ui/Card/Card";
import CustomInput from "@/components/forms/CustomInput";
import { CustomPhoneInput } from "@/components/forms/CustomPhoneInput";
import BusinessHoursSchedule from "../components/shared/BusinessHoursSchedule";
import AddressDialog from "../components/shared/AddressDialog";
import arrowIcon from "@/assets/images/icons/arrow.png";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { useCategory } from "@hooks/api";
import { useBusinessCategory } from "@hooks/useBusinessCategory";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { useGetStoreTypesQuery } from "@/store/api/storeTypeApi";
import { setOwnerProfile } from "@/store/ownerProfileSlice";
import { OnboardingPage } from "../components";
import { useOnboardingNavigation } from "../hooks";
import { selectInformation, setInformation } from "../store/onboardingSlice";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function InformationPage() {
  const dispatch = useDispatch();
  const { categoryConfig, isGrocery, isPharmacy, isLiquor } = useCategory();
  const { businessCategoryId } = useBusinessCategory();
  const { navigateNext } = useOnboardingNavigation();
  const shouldFetchStoreTypes = isGrocery || isPharmacy || isLiquor;
  const { data: storeTypes = [] } = useGetStoreTypesQuery(
    { categoryId: businessCategoryId },
    { skip: !shouldFetchStoreTypes || !businessCategoryId },
  );
  const ownerProfile = useSelector((state) => state?.ownerProfile?.profile);
  const storedInfo = useSelector(selectInformation);

  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [scheduleErr, setscheduleErr] = useState(null);
  const [addressData, setAddressData] = useState({
    plot_no: storedInfo.address.plot_no,
    floor: storedInfo.address.floor,
    building_name: storedInfo.address.building_name,
    pincode: storedInfo.address.pincode,
    complete_address: storedInfo.address.complete_address,
    lat: storedInfo.address.lat,
    lng: storedInfo.address.lng,
  });
  const [data, setData] = useState({
    ownerName: storedInfo.ownerName || ownerProfile?.ownerName || "",
    email: storedInfo.email || ownerProfile?.email || "",
    phone: storedInfo.phone || ownerProfile?.phone || "",
    businessName: storedInfo.businessName,
    businessLinkUrl: storedInfo.businessLinkUrl || "",
    storeTypeId: storedInfo.storeTypeId || "",
    complete_address: storedInfo.address.complete_address
      ? storedInfo.address
      : "",
    hours: storedInfo.hours,
  });

  const lastSyncRef = useRef(null);
  useEffect(() => {
    if (!storedInfo.ownerName && !storedInfo.email && !storedInfo.businessName)
      return;
    const syncKey = JSON.stringify(storedInfo);
    if (lastSyncRef.current === syncKey) return;
    lastSyncRef.current = syncKey;

    setData((prev) => ({
      ...prev,
      ownerName: storedInfo.ownerName || prev.ownerName,
      email: storedInfo.email || prev.email,
      phone: storedInfo.phone || prev.phone,
      businessName: storedInfo.businessName || prev.businessName,
      businessLinkUrl: storedInfo.businessLinkUrl || prev.businessLinkUrl,
      storeTypeId: storedInfo.storeTypeId || prev.storeTypeId,
      hours: storedInfo.hours?.length ? storedInfo.hours : prev.hours,
      complete_address: storedInfo.address?.complete_address
        ? storedInfo.address
        : prev.complete_address,
    }));
    if (storedInfo.address?.complete_address) {
      setAddressData(storedInfo.address);
    }
  }, [storedInfo]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSchedule = useCallback((schedule) => {
    setData((prev) => ({ ...prev, hours: schedule }));
  }, []);

  const handleAddressSave = (address) => {
    const formErrors = { ...data?.formErrors };
    delete formErrors.complete_address;
    setData((prev) => ({ ...prev, complete_address: address, formErrors }));
    setAddressData((prev) => ({ ...prev, ...address }));
  };

  const handleNext = () => {
    let allErrors = {};
    let hasAnyError = false;

    // Validate basic fields (ownerName, email, phone, businessName, complete_address)
    const {
      hours: _,
      formErrors: __,
      businessLinkUrl: _url,
      storeTypeId: _storeType,
      ...formFields
    } = data;
    const fieldEntries = Object.entries(formFields);
    fieldEntries.forEach(([key, value]) => {
      const result = formValidation(key, value, formFields);
      allErrors[key] = result[key] ?? "";
    });

    // Validate businessLinkUrl
    if (data.businessLinkUrl) {
      const urlErrors = formValidation(
        "businessLinkUrl",
        data.businessLinkUrl,
        data,
      );
      if (urlErrors.businessLinkUrl) {
        allErrors.businessLinkUrl = urlErrors.businessLinkUrl;
      }
    }

    // Validate storeTypeId for grocery/pharmacy
    if ((isGrocery || isPharmacy || isLiquor) && !data.storeTypeId) {
      allErrors.storeTypeId = "Please select a store type";
    }

    // Check if any field errors exist
    hasAnyError = Object.values(allErrors).some((v) => v !== "");

    // Validate hours
    const invalidEnabledDay = data.hours.some(
      (h) => h.enabled && (!h.open || !h.close),
    );
    if (invalidEnabledDay) {
      setscheduleErr(
        "Please fill both opening and closing time for all enabled days.",
      );
      hasAnyError = true;
    } else {
      setscheduleErr("");
    }

    let hoursError = false;
    const updatedHours = data.hours.map((h) => {
      const errors = { open: "", close: "", day: h.day };
      if (!h.enabled) return { ...h, formErrors: errors };
      if (h.open && h.close) {
        const openDate = new Date(`2000-01-01T${h.open}`);
        const closeDate = new Date(`2000-01-01T${h.close}`);
        if (closeDate <= openDate) {
          errors.close = `Closing time must be later than opening time for ${h.day}.`;
          hoursError = true;
        }
      }
      return { ...h, formErrors: errors };
    });

    if (hoursError) hasAnyError = true;

    const filteredHours = updatedHours.filter(
      (h) => h.enabled && h.open && h.close,
    );
    if (!invalidEnabledDay && filteredHours.length === 0) {
      setscheduleErr("Please enable at least one working day.");
      hasAnyError = true;
    }

    setData((prev) => ({
      ...prev,
      formErrors: allErrors,
      hours: updatedHours,
    }));
    if (hasAnyError) return;

    dispatch(
      setInformation({
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        businessLinkUrl: data.businessLinkUrl,
        storeTypeId: data.storeTypeId,
        address: addressData,
        hours: updatedHours,
      }),
    );
    dispatch(
      setOwnerProfile({
        user: { ...ownerProfile, ownerName: data.ownerName, email: data.email },
      }),
    );
    navigateNext("information");
  };

  const addressDetails = useSelector(
    (state) =>
      state?.businessProfile?.profile?.merchant?.business?.location || {},
  );

  return (
    <OnboardingPage
      BackTo="/select-category"
      NextTo={handleNext}
      btnclass="py-[1.4rem]! px-[10%]! md:px-[9%]!"
      head={categoryConfig.informationLabel}
      subHead={categoryConfig.informationDescription}
      step={1}
    >
      <BaseCard title="Basic Details" extraClassName="px-[14%]!">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <CustomInput
              label="Owner Full Name"
              name="ownerName"
              onChange={handleChange}
              data={data}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <CustomInput
              label="Business Name"
              name="businessName"
              onChange={handleChange}
              data={data}
            />
          </div>

          <div className="col-span-12 md:col-span-6 m-0 p-0">
            <label className="2xl:text-base lg:text-sm text-xs mb-0 relative inline-block">
              Add {categoryConfig.displayName} Location
              <i className="pi pi-asterisk absolute bottom-[50%] ml-0.5" />
            </label>

            <div
              onClick={() => setShowAddressDialog(true)}
              className={`flex items-center pt-0 mt-0 justify-between w-full border rounded-md px-3 bg-white cursor-pointer 2xl:h-[50px] lg:h-[45px] h-11.5 ${
                data?.formErrors?.complete_address
                  ? "border-primary"
                  : "border-neutral-400"
              }`}
            >
              <span
                className={`flex-1 min-w-0 2xl:text-base lg:text-sm text-xs ${
                  data?.complete_address?.complete_address ||
                  addressDetails?.complete_address
                    ? "text-black"
                    : "text-gray-500"
                } truncate`}
              >
                {data?.complete_address?.complete_address ||
                  addressDetails?.complete_address ||
                  "Select Address"}
              </span>

              <SkeletonImage
                src={arrowIcon}
                alt="arrow"
                className="h-2.5 ml-2 shrink-0"
              />
            </div>

            {data?.formErrors?.complete_address && (
              <p className="text-primary text-xs">
                {data.formErrors.complete_address}
              </p>
            )}
          </div>

          {(isGrocery || isPharmacy || isLiquor) && (
            <div className="col-span-12 md:col-span-6">
              <CustomDropdown
                name="storeTypeId"
                label="Store Type"
                value={data.storeTypeId}
                onChange={(e) => {
                  const value = e.value ?? "";
                  const formErrors = { ...data?.formErrors };
                  delete formErrors.storeTypeId;
                  setData((prev) => ({
                    ...prev,
                    storeTypeId: value,
                    formErrors,
                  }));
                }}
                options={storeTypes}
                optionLabel="storeType"
                optionValue="_id"
                placeholder="Select Store Type"
                required
                data={data}
              />
            </div>
          )}

          <div className="col-span-12 md:col-span-6">
            <CustomInput
              label="Business Website URL"
              name="businessLinkUrl"
              onChange={handleChange}
              data={data}
              required={false}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Owner Contact Details" extraClassName="px-[14%]!">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <CustomInput
              label="Email"
              name="email"
              onChange={handleChange}
              data={data}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomPhoneInput
              label="Phone Number"
              name="phone"
              value={data?.phone}
              onChange={handleChange}
              readOnly
              required
            />
          </div>
        </div>
      </BaseCard>

      <BaseCard title="Business Hours & Schedule" extraClassName="px-[14%]!">
        {scheduleErr && <p className="p-error text-primary">{scheduleErr}</p>}
        <div className="w-full">
          <BusinessHoursSchedule
            initialHours={data.hours}
            onScheduleChange={handleSchedule}
            setscheduleErr={setscheduleErr}
          />
        </div>
      </BaseCard>

      {showAddressDialog && (
        <AddressDialog
          open={showAddressDialog}
          onClose={() => setShowAddressDialog(false)}
          onSave={handleAddressSave}
          addressDetails={addressDetails}
          addressData={addressData}
        />
      )}
    </OnboardingPage>
  );
}
