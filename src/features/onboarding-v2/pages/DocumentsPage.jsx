import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseCard from "@/components/ui/Card/Card";
import CustomInput from "@/components/forms/CustomInput";
import CustomFileUpload from "../components/shared/UploadedDocument";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { useCategory } from "@hooks/api";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { OnboardingPage } from "../components";
import { useOnboardingNavigation } from "../hooks";
import { selectDocuments, setDocuments } from "../store/onboardingSlice";

export default function DocumentsPage({ registrationCertificateLabel }) {
  const dispatch = useDispatch();
  const { categoryConfig, categoryName } = useCategory();
  const { navigateNext, navigateBack } = useOnboardingNavigation();
  const storedDocs = useSelector(selectDocuments);

  const [uploadingFields, setUploadingFields] = useState(new Set());
  const [uploadFileMutation] = useUploadFileMutation();
  const isUploading = uploadingFields.size > 0;

  const [data, setData] = useState({
    registrationNumber: storedDocs.registrationNumber,
    taxIdentificationNumber: storedDocs.taxIdentificationNumber,
    registrationCertificateUrl: storedDocs.registrationCertificateUrl,
    businessDocumentUrl: storedDocs.businessDocumentUrl,
    idProofUrl: storedDocs.idProofUrl,
    selfieUrl: storedDocs.selfieUrl,
    storeLogo: storedDocs.storeLogo,
    storePic: storedDocs.storePic,
  });

  const handleChange = useCallback(({ name, value }) => {
    setData((prev) => {
      const formErrors = formValidation(name, value, prev);
      return { ...prev, [name]: value, formErrors };
    });
  }, []);

  const uploadDocument = useCallback(async (file, name) => {
    setUploadingFields((prev) => new Set(prev).add(name));
    setData((prev) => ({ ...prev, formErrors: { ...prev.formErrors, [name]: "" } }));
    try {
      const result = await uploadFileMutation(file).unwrap();
      handleChange({ name, value: result?.data?.url });
    } catch {
      setData((prev) => ({
        ...prev,
        formErrors: { ...prev.formErrors, [name]: "Upload failed. Please try again." },
      }));
    } finally {
      setUploadingFields((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  }, [uploadFileMutation, handleChange]);

  const handleNext = () => {
    const { formErrors: _, ...formFields } = data;
    if (!showFormErrors(formFields, (validated) => setData((prev) => ({ ...prev, ...validated })))) return;

    // Store in Redux — NO API call
    dispatch(setDocuments({
      registrationNumber: data.registrationNumber,
      taxIdentificationNumber: data.taxIdentificationNumber,
      registrationCertificateUrl: data.registrationCertificateUrl,
      businessDocumentUrl: data.businessDocumentUrl,
      idProofUrl: data.idProofUrl,
      selfieUrl: data.selfieUrl,
      storeLogo: data.storeLogo,
      storePic: data.storePic,
    }));
    navigateNext("documents");
  };

  return (
    <OnboardingPage
      BackTo={() => navigateBack("documents")}
      NextTo={handleNext}
      head={categoryConfig.documentsLabel}
      btnclass="py-[1.4rem]! px-[10%]! md:px-[9%]!"
      subHead={categoryConfig.documentsDescription}
      step={2}
      disabled={isUploading}
    >
      <BaseCard extraClassName="px-[14%]!" title="Business Verification">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <CustomInput label="Registration Number" name="registrationNumber" onChange={handleChange} data={data} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomInput label="Tax Identification Number" name="taxIdentificationNumber" onChange={handleChange} data={data} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label={registrationCertificateLabel || "Registration Certificate"} name="registrationCertificateUrl" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} required isLoading={uploadingFields.has("registrationCertificateUrl")} errorMessage={data.formErrors?.registrationCertificateUrl && "Please upload the registration certificate"} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label="Business License / Permit" name="businessDocumentUrl" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} required isLoading={uploadingFields.has("businessDocumentUrl")} errorMessage={data.formErrors?.businessDocumentUrl && "Please upload the business license or permit"} />
          </div>
        </div>
      </BaseCard>

      <BaseCard extraClassName="px-[14%]!" title="Representative Verification">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label="Authorized Representative ID Proof" name="idProofUrl" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} required isLoading={uploadingFields.has("idProofUrl")} errorMessage={data.formErrors?.idProofUrl && "Please upload the ID proof"} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label="Upload Owner Selfie with ID (optional but adds authenticity)" name="selfieUrl" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} onlyImage required={false} isLoading={uploadingFields.has("selfieUrl")} errorMessage={data.formErrors?.selfieUrl && "Please upload the selfie with ID"} />
          </div>
        </div>
      </BaseCard>

      <BaseCard extraClassName="px-[14%]!" title="Business Branding">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label="Store Logo" name="storeLogo" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} onlyImage required isLoading={uploadingFields.has("storeLogo")} errorMessage={data.formErrors?.storeLogo && "Please upload the store logo"} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <CustomFileUpload label="Store Cover Photo / Banner" name="storePic" data={data} labelClassName="mb-2" onChange={handleChange} uploadApi={uploadDocument} onlyImage required isLoading={uploadingFields.has("storePic")} errorMessage={data.formErrors?.storePic && "Please upload the store cover photo"} />
          </div>
        </div>
      </BaseCard>
    </OnboardingPage>
  );
}
