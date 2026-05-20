import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { persistor } from "@/store";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import VerifiedDocuments from "../components/shared/VerifiedDocuments";
import FoodList from "../components/shared/FoodList";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { setCurrentStep } from "../store/onboardingSlice";
import { useAuthApi } from "@features/auth/hooks";
import { showToastAction } from "@/store/commonSlice";
import { useGetItemsQuery } from "@/store/api/menuApi";
import { useGetStoreTypesQuery } from "@/store/api/storeTypeApi";
import { useGetTermsPoliciesQuery } from "@/store/api/termsPolicyApi";
import BaseModal from "@/components/ui/Modal/Modal";
import AutoSkeleton from "@/components/ui/Skeleton/AutoSkeleton";
import { useBusinessCategory } from "@/hooks/useBusinessCategory";
import { OnboardingPage } from "../components";
import {
  selectInformation,
  selectDocuments,
  resetOnboarding,
} from "../store/onboardingSlice";
import { buildFinalPayload } from "../utils/transformPayload";

export default function ReviewAndSubmitPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryConfig, isGrocery, isPharmacy, businessCategoryId } = useBusinessCategory();
  const { updateMerchant } = useAuthApi();
  const { profile } = useSelector((state) => state?.businessProfile);
  const ownerProfile = useSelector((state) => state?.ownerProfile?.profile);
  const information = useSelector(selectInformation);
  const documents = useSelector(selectDocuments);

  const merchantProfile = useMemo(
    () => profile?.merchant || profile,
    [profile],
  );
  const ownerDetails = useMemo(
    () => profile?.ownerDetails || {},
    [profile?.ownerDetails],
  );

  const { data: menuData } = useGetItemsQuery(
    {
      categoryId: merchantProfile?.categoryId || "",
      itemType: (merchantProfile?.categoryName || "").toLowerCase(),
      merchantId: merchantProfile?._id,
    },
    { skip: !merchantProfile?._id },
  );

  const shouldFetchStoreTypes = isGrocery || isPharmacy;
  const { data: storeTypes = [] } = useGetStoreTypesQuery(
    { categoryId: businessCategoryId },
    { skip: !shouldFetchStoreTypes || !businessCategoryId },
  );

  const storeTypeName = useMemo(() => {
    const storeTypeId = information.storeTypeId || merchantProfile?.storeTypeId;
    if (!storeTypeId || storeTypes.length === 0) return "-";
    const found = storeTypes.find((st) => st._id === storeTypeId);
    return found?.storeType || "-";
  }, [information.storeTypeId, merchantProfile?.storeTypeId, storeTypes]);

  const [showTermsModal, setShowTermsModal] = useState(false);

  const { data: termsData, isLoading: isTermsLoading, error: termsError } = useGetTermsPoliciesQuery({
    type: "terms_conditions",
    userType: "merchant"
  }, { skip: !showTermsModal });

  const terms = termsData?.find(item => item.isActive && item.type === "terms_conditions");

  const [data, setData] = useState({
    agreeToTermsAndConditions: false,
    allowNotifications: false,
  });
  const [draftLoading, setDraftLoading] = useState(false);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const info = {
    ownerFullName:
      information.ownerName ||
      ownerDetails?.ownerName ||
      ownerProfile?.ownerName ||
      "-",
    businessName:
      information.businessName ||
      merchantProfile?.business?.businessName ||
      "-",
    phoneNumber:
      information.phone || ownerDetails?.phone || ownerProfile?.phone || "-",
    email:
      information.email || ownerDetails?.email || ownerProfile?.email || "-",
    registrationNumber:
      documents.registrationNumber ||
      merchantProfile?.business?.verification?.registrationNumber ||
      "-",
    restaurantLocation:
      information.address?.complete_address ||
      merchantProfile?.business?.location?.complete_address ||
      "",
    zipCode:
      information.address?.pincode ||
      merchantProfile?.business?.location?.pincode ||
      "-",
    operatingHours:
      information.hours?.length > 0
        ? information.hours
        : merchantProfile?.business?.hours || [],
  };

  const docsList = [
    (documents.registrationCertificateUrl ||
      merchantProfile?.business?.verification?.registrationCertificateUrl) && {
      title: "Registration Certificate",
      fileName: "View Uploaded File",
      status: merchantProfile?.isDocumentVerified ? "Verified" : "Pending",
      url:
        documents.registrationCertificateUrl ||
        merchantProfile?.business?.verification?.registrationCertificateUrl,
    },
    (documents.businessDocumentUrl ||
      merchantProfile?.business?.verification?.businessDocumentUrl) && {
      title: "Business License / Permit",
      fileName: "View Uploaded File",
      status: merchantProfile?.isDocumentVerified ? "Verified" : "Pending",
      url:
        documents.businessDocumentUrl ||
        merchantProfile?.business?.verification?.businessDocumentUrl,
    },
    (documents.idProofUrl ||
      merchantProfile?.ownerVerification?.idProofUrl) && {
      title: "Representative ID Proof",
      fileName: "View Uploaded File",
      status: merchantProfile?.isDocumentVerified ? "Verified" : "Pending",
      url:
        documents.idProofUrl || merchantProfile?.ownerVerification?.idProofUrl,
    },
    (documents.selfieUrl || merchantProfile?.ownerVerification?.selfieUrl) && {
      title: "Owner Selfie with ID",
      fileName: "View Uploaded File",
      status: merchantProfile?.isDocumentVerified ? "Verified" : "Pending",
      url: documents.selfieUrl || merchantProfile?.ownerVerification?.selfieUrl,
    },
  ].filter(Boolean);

  const InfoRow = ({ label, value }) => (
    <div className="mb-4 min-w-0">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900 break-words whitespace-pre-line">
        {value || "-"}
      </div>
    </div>
  );

  const handleSaveAsDraft = async () => {
    const consent = {
      agreeToTermsAndConditions: data.agreeToTermsAndConditions,
      allowNotifications: data.allowNotifications,
    };
    const payload = buildFinalPayload(
      information,
      documents,
      consent,
      merchantProfile,
      false,
    );
    try {
      const merchantId = merchantProfile?._id;
      if (!merchantId) return;
      setDraftLoading(true);
      await updateMerchant(payload, merchantId, () => {
        dispatch(
          showToastAction({
            type: "success",
            title: "Draft saved successfully",
          }),
        );
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error("Draft save failed:", error);
      dispatch(
        showToastAction({ type: "error", title: "Failed to save draft" }),
      );
    } finally {
      setDraftLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!showFormErrors(data, setData)) return;

    const consent = {
      agreeToTermsAndConditions: data.agreeToTermsAndConditions,
      allowNotifications: data.allowNotifications,
    };
    const payload = buildFinalPayload(
      information,
      documents,
      consent,
      merchantProfile,
    );

    try {
      const merchantId = merchantProfile?._id;
      if (!merchantId) return;
      await updateMerchant(payload, merchantId, () => {
        navigate("/submitted");
        dispatch(resetOnboarding());
        persistor.purge();
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error("Submission failed:", error);
    }
  };

  return (
    <OnboardingPage
      BackTo={() => dispatch(setCurrentStep(3))}
      nextbtn={false}
      head="Review & Submit"
      subHead={`Please review all the information below before submitting your ${categoryConfig.displayName.toLowerCase()} application`}
      step={4}
    >
      <BaseCard
        title={categoryConfig.informationLabel}
        linkLabel="Edit"
        onClick={() => dispatch(setCurrentStep(1))}
      >
        <div className="grid grid-cols-2 gap-x-8">
          <InfoRow label="Owner Full Name" value={info.ownerFullName} />
          <InfoRow label="Business Name" value={info.businessName} />
          <InfoRow label="Phone number" value={info.phoneNumber} />
          <InfoRow label="Email" value={info.email} />
          <InfoRow
            label="Registration Number"
            value={info.registrationNumber}
          />
          {shouldFetchStoreTypes && (
            <InfoRow label="Store Type" value={storeTypeName} />
          )}
          <InfoRow
            label="Restaurant Location"
            value={info.restaurantLocation}
          />
          <InfoRow label="Zip Code" value={info.zipCode} />
          <div className="col-span-2">
            <div className="col-span-2 mb-4">
              <div className="text-sm text-gray-500 mb-1">Operating Hours</div>
              {info.operatingHours.length > 0 ? (
                info.operatingHours
                  .filter((h) => h.open && h.close)
                  .map((item) => (
                    <div
                      key={item._id || item.day}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item.day}: {item.open} - {item.close}
                    </div>
                  ))
              ) : (
                <div className="text-sm font-medium text-gray-900">-</div>
              )}
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="Uploaded Documents"
        linkLabel="Edit"
        onClick={() => dispatch(setCurrentStep(2))}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docsList.map((doc, idx) => (
            <VerifiedDocuments
              key={idx}
              title={doc.title}
              fileName={doc.fileName}
              status={doc.status}
              onClick={() => window.open(doc.url, "_blank")}
            />
          ))}
        </div>
      </BaseCard>

      <BaseCard
        title="Added Food & Beverages"
        linkLabel="Edit"
        onClick={() => navigate("/view-items")}
      >
        <FoodList menuData={menuData} />
      </BaseCard>

      <BaseCard title="Terms & Conditions">
        <div className="space-y-3 mt-4 text-black">
          <CustomCheckbox
            label="I agree to the Terms of Service. I confirm that all information provided is accurate and complete."
            highlight="Terms of Service"
            onHighlightClick={() => setShowTermsModal(true)}
            data={data}
            onChange={handleChange}
            name="agreeToTermsAndConditions"
            inputClass="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <CustomCheckbox
            label="I would like to receive updates about new features, promotions, and pharmacy management tips via email."
            data={data}
            onChange={handleChange}
            name="allowNotifications"
            inputClass="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
        </div>
        <div className="flex justify-between mt-6">
          <div>
            <CustomButton
              variant="gray"
              label="save as draft"
              fullWidth={false}
              onClick={handleSaveAsDraft}
              loading={draftLoading}
              className="border-neutral-600! px-20 whitespace-nowrap"
            />
          </div>
          <div className="flex gap-4">
            <CustomButton
              variant="gray"
              label="Back to Edit"
              fullWidth={false}
              onClick={() => dispatch(setCurrentStep(3))}
              className="px-20! border-neutral-600! whitespace-nowrap"
            />
            <CustomButton
              variant="primary"
              label="Submit Application"
              fullWidth={false}
              onClick={handleSubmit}
              className="px-20 w-[-webkit-fill-available]!"
            />
          </div>
        </div>
      </BaseCard>

      <BaseModal
        visible={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        title="Terms of Service"
        width="60rem"
        contentClassName="px-6 py-4"
      >
        <AutoSkeleton loading={isTermsLoading} config={{ animation: "pulse", borderRadius: 8 }}>
          <div className="space-y-6">
            {termsError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600">Error loading terms & conditions. Please try again later.</p>
              </div>
            )}
            
            {!termsError && !terms && !isTermsLoading && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                <p className="text-gray-600">No terms & conditions available.</p>
              </div>
            )}
            
            {(terms?.content || isTermsLoading) && (
              <div 
                className="terms-conditions-content prose prose-sm max-w-none min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: isTermsLoading ? `
                  <h3>Terms of Service</h3>
                  <p>Please wait while we fetch the terms and conditions data...</p>
                  <p>Loading section content details... Loading section content details... Loading section content details... Loading section content details...</p>
                  <p>Loading section content details... Loading section content details... Loading section content details... Loading section content details...</p>
                  <ul><li>List item loading</li><li>List item loading</li><li>List item loading</li></ul>
                  <p>Loading section content details... Loading section content details...</p>
                  <br /><br /><br /><br /><br />
                ` : terms.content }}
              />
            )}
          </div>
        </AutoSkeleton>
      </BaseModal>
    </OnboardingPage>
  );
}
