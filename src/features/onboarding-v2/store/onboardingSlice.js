import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  information: {
    ownerName: "",
    email: "",
    phone: "",
    businessName: "",
    businessLinkUrl: "",
    storeTypeId: "",
    address: {
      plot_no: "",
      floor: "",
      building_name: "",
      pincode: "",
      complete_address: "",
      lat: 28.6139,
      lng: 77.209,
    },
    hours: [],
  },
  documents: {
    registrationNumber: "",
    taxIdentificationNumber: "",
    registrationCertificateUrl: "",
    businessDocumentUrl: "",
    idProofUrl: "",
    selfieUrl: "",
    storeLogo: "",
    storePic: "",
  },
  consent: {
    agreeToTermsAndConditions: false,
    allowNotifications: false,
  },
  initialized: false,
  currentStep: 1,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setInformation(state, action) {
      state.information = { ...state.information, ...action.payload };
    },
    setDocuments(state, action) {
      state.documents = { ...state.documents, ...action.payload };
    },
    setConsent(state, action) {
      state.consent = { ...state.consent, ...action.payload };
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    hydrateFromProfile(state, action) {
      const { merchant, ownerDetails, ownerProfile } = action.payload;
      const business = merchant?.business || {};
      const loc = business.location || {};
      const verification = business.verification || {};
      const branding = business.branding || {};
      const ownerVerification = merchant?.ownerVerification || {};

      state.information = {
        ownerName: ownerDetails?.ownerName || ownerProfile?.ownerName || "",
        email: ownerDetails?.email || ownerProfile?.email || "",
        phone: ownerDetails?.phone || ownerProfile?.phone || "",
        businessName: business.businessName || "",
        businessLinkUrl: merchant.businessLinkUrl || business.businessLinkUrl || "",
        storeTypeId: merchant.storeTypeId || business.storeTypeId || "",
        address:
          loc?.coordinates?.latitude || loc?.coordinates?.longitude
            ? {
                plot_no: loc.plot_no || "",
                floor: loc.floor || "",
                building_name: loc.building_name || "",
                pincode: loc.pincode || "",
                complete_address: loc.complete_address || "",
                lat: loc.coordinates.latitude,
                lng: loc.coordinates.longitude,
              }
            : initialState.information.address,
        hours: business.hours || [],
      };

      state.documents = {
        registrationNumber: verification.registrationNumber || "",
        taxIdentificationNumber: verification.taxIdentificationNumber || "",
        registrationCertificateUrl:
          verification.registrationCertificateUrl || "",
        businessDocumentUrl: verification.businessDocumentUrl || "",
        idProofUrl: ownerVerification.idProofUrl || "",
        selfieUrl: ownerVerification.selfieUrl || "",
        storeLogo: branding.storeLogo || "",
        storePic: branding.storePic || "",
      };

      state.initialized = true;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  setInformation,
  setDocuments,
  setConsent,
  setCurrentStep,
  hydrateFromProfile,
  resetOnboarding,
} = onboardingSlice.actions;

export const selectInformation = (state) => state.onboarding.information;
export const selectDocuments = (state) => state.onboarding.documents;
export const selectConsent = (state) => state.onboarding.consent;
export const selectCurrentStep = (state) => state.onboarding.currentStep;
export const selectIsInitialized = (state) => state.onboarding.initialized;

export default onboardingSlice.reducer;
