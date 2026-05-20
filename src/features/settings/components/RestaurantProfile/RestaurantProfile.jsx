import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import CustomInput from "@/components/forms/CustomInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import CustomButton from "@/components/ui/Button/Button";
import AddressDialog from "@/features/onboarding-v2/components/shared/AddressDialog";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/store/api/userProfileApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useGetStoreTypesQuery } from "@/store/api/storeTypeApi";
import { useForm } from "@/hooks";
import { useBusinessCategory } from "@hooks/useBusinessCategory";

export default function RestaurantProfile() {
  const businessProfile = useSelector((state) => state.businessProfile.profile);
  const ownerProfile = useSelector((state) => state.ownerProfile.profile);
  useGetUserProfileQuery(undefined, {
    skip: !!businessProfile?._id || !!ownerProfile?._id,
  });
  const [updateUserProfile, { isLoading: loading }] =
    useUpdateUserProfileMutation();
  const [uploadFileMutation] = useUploadFileMutation();
  const [uploadingField, setUploadingField] = useState(null);
  const { isGrocery, isPharmacy, businessCategoryId, categoryConfig } = useBusinessCategory();
  const showStoreType = isGrocery || isPharmacy;
  const { data: storeTypes = [] } = useGetStoreTypesQuery(
    { categoryId: businessCategoryId },
    { skip: !showStoreType || !businessCategoryId }
  );
  const storeTypeOptions = useMemo(
    () => storeTypes.map((st) => ({ name: st?.storeType, value: st?._id })),
    [storeTypes],
  );

  const [isEdit, setIsEdit] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressData, setAddressData] = useState({});
  const coordinatesRef = useRef(null);
  const initialDataRef = useRef(null);

  const { data, handleChange, handleMultipleChanges, validate, reset } =
    useForm({
      ownerName: "",
      email: "",
      phone: "",
      businessName: "",
      address: "",
      plotNo: "",
      floor: "",
      buildingName: "",
      pincode: "",
      storeLogo: "",
      storePic: "",
      selfieUrl: "",
      storeTypeId: "",
    });

  useEffect(() => {
    if (businessProfile) {
      const mappedData = {
        ownerName: ownerProfile.ownerName || "",
        email: ownerProfile.email || "",
        phone: ownerProfile.phone || "",
        businessName: businessProfile.business?.businessName || "",
        address: businessProfile.business?.location?.complete_address || "",
        plotNo: businessProfile.business?.location?.plot_no || "",
        floor: businessProfile.business?.location?.floor || "",
        buildingName: businessProfile.business?.location?.building_name || "",
        pincode: businessProfile.business?.location?.pincode || "",
        storeLogo: businessProfile.business?.branding?.storeLogo || "",
        storePic: businessProfile.business?.branding?.storePic || "",
        selfieUrl: businessProfile.ownerVerification?.selfieUrl || "",
        storeTypeId: businessProfile.storeTypeId || "",
      };

      handleMultipleChanges(mappedData);
      initialDataRef.current = mappedData;
      coordinatesRef.current =
        businessProfile.business?.location?.coordinates || null;
    }
  }, [businessProfile, ownerProfile, handleMultipleChanges]);

  const uploadApi = useCallback(
    async (file, name) => {
      setUploadingField(name);
      try {
        const result = await uploadFileMutation(file).unwrap();
        handleChange({ name, value: result?.data?.url });
      } finally {
        setUploadingField(null);
      }
    },
    [uploadFileMutation, handleChange],
  );

  const handleAddressSave = (addressResult) => {
    handleMultipleChanges({
      address: addressResult.complete_address || "",
      plotNo: addressResult.plot_no || "",
      floor: addressResult.floor || "",
      buildingName: addressResult.building_name || "",
      pincode: addressResult.pincode || "",
    });
    coordinatesRef.current = {
      latitude: addressResult.lat,
      longitude: addressResult.lng,
    };
  };

  const handleSave = async () => {
    if (!validate(["businessName"])) return;

    const payload = {
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      ...(showStoreType && data.storeTypeId ? { storeTypeId: data.storeTypeId } : {}),
      ownerVerification: {
        selfieUrl: data.selfieUrl,
      },
      business: {
        businessName: data.businessName,
        location: {
          complete_address: data.address,
          plot_no: data.plotNo,
          floor: data.floor,
          building_name: data.buildingName,
          pincode: data.pincode,
          ...(coordinatesRef.current && {
            coordinates: coordinatesRef.current,
          }),
        },
        branding: {
          storeLogo: data.storeLogo,
          storePic: data.storePic,
        },
      },
    };

    await updateUserProfile({
      id: businessProfile._id,
      data: payload,
    }).unwrap();
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const isSaving = isEdit && loading;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-5">
        <CustomImageUploaderBox
          name="storePic"
          label="Store Banner"
          data={data}
          onChange={handleChange}
          uploadApi={uploadApi}
          isUploading={uploadingField === "storePic"}
          disabled={!isEdit}
          aspectRatio={393 / 293}
          sizeHint="Recommended size: 393 x 293px"
        />
        <CustomImageUploaderBox
          name="storeLogo"
          label="Store Logo"
          data={data}
          onChange={handleChange}
          uploadApi={uploadApi}
          isUploading={uploadingField === "storeLogo"}
          disabled={!isEdit}
          aspectRatio={1 / 1}
          sizeHint="Recommended size: 1:1 (e.g. 500 x 500px)"
        />
        <CustomImageUploaderBox
          name="selfieUrl"
          label="Owner Selfie"
          data={data}
          onChange={handleChange}
          uploadApi={uploadApi}
          isUploading={uploadingField === "selfieUrl"}
          disabled={!isEdit}
          required={false}
          aspectRatio={1 / 1}
          sizeHint="Recommended size: 1:1 (e.g. 500 x 500px)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-5">
        <CustomInput
          label={`${categoryConfig?.displayName || "Restaurant"} Name`}
          name="businessName"
          col={10}
         value={data?.businessName}
          disabled={true}
          ignoreError
          onChange={(e) =>
            handleChange({ name: "businessName", value: e.target.value })
          }
        />

        {showStoreType && (
          <CustomDropdown
            label="Store Type"
            col={10}
            options={storeTypeOptions}
            value={data.storeTypeId}
            onChange={(e) => handleChange({ name: "storeTypeId", value: e.value ?? "" })}
            placeholder="Select Store Type"
            disabled={!isEdit}
          />
        )}

        <CustomInput
          label="Owner Name"
          name="ownerName"
          col={5}
          data={data}
          disabled={!isEdit}
          onChange={(e) =>
            handleChange({ name: "ownerName", value: e.target.value })
          }
        />

        <CustomInput
          label="Contact Number"
          name="phone"
          col={5}
          data={data}
          disabled
        />
        <CustomInput
          label="Email Address"
          name="email"
          col={10}
          data={data}
          disabled
        />

        <CustomInput
          label="Complete Address"
          name="address"
          col={10}
          data={data}
          disabled
        />

        <CustomInput
          label="Plot No"
          name="plotNo"
          col={5}
          required={false}
          data={data}
          disabled
        />

        <CustomInput
          label="Floor"
          name="floor"
          col={5}
          data={data}
          disabled
          required={false}
        />

        <CustomInput
          label="Zip Code"
          name="pincode"
          col={5}
          data={data}
          disabled
        />

        {isEdit && (
          <div className="col-span-5 flex items-end">
            <CustomButton
              variant="line"
              label="Change Address"
              onClick={() => setShowAddressDialog(true)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-7 justify-end">
        {!isEdit && (
          <CustomButton label="Edit" onClick={() => setIsEdit(true)} />
        )}

        {isEdit && (
          <>
            <CustomButton
              label="Save"
              onClick={handleSave}
              loading={isSaving}
              disabled={isSaving}
            />
            <CustomButton
              variant="line"
              label="Cancel"
              onClick={handleCancel}
              disabled={isSaving}
            />
          </>
        )}
      </div>

      <AddressDialog
        open={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        onSave={handleAddressSave}
        addressDetails={businessProfile?.business?.location}
        addressData={addressData}
        setAddressData={setAddressData}
      />
    </>
  );
}
