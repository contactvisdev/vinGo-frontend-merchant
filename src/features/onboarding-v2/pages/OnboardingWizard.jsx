import { useSelector } from "react-redux";
import { useCategory } from "@hooks/api";
import { selectCurrentStep } from "../store/onboardingSlice";
import InformationPage from "./InformationPage";
import DocumentsPage from "./DocumentsPage";
import ProductSetupPage from "./ProductSetupPage";
import ReviewAndSubmitPage from "./ReviewAndSubmitPage";

const CERT_LABELS = {
  pharmacy: "Upload Pharmacy License",
  grocery: "Upload Business Registration Certificate",
};

export default function OnboardingWizard() {
  const currentStep = useSelector(selectCurrentStep);
  const { categorySlug } = useCategory();

  const registrationCertificateLabel =
    CERT_LABELS[categorySlug] || "Upload KvK Registration Certificate";

  switch (currentStep) {
    case 2:
      return <DocumentsPage registrationCertificateLabel={registrationCertificateLabel} />;
    case 3:
      return <ProductSetupPage />;
    case 4:
      return <ReviewAndSubmitPage />;
    default:
      return <InformationPage />;
  }
}
