/**
 * Build the final payload for the updateMerchant API call.
 * Merges information (step 1), documents (step 2), and consent (step 4) data.
 */
export function buildFinalPayload(
  information,
  documents,
  consent,
  merchantProfile,
  isProfileCompleted = true,
) {
  const filteredHours = (information.hours || []).filter(
    (h) => h.enabled && h.open && h.close,
  );
  return {
    OwnerId: merchantProfile?.OwnerId || null,
    ownerName: information.ownerName || null,
    email: information.email || null,
    businessLinkUrl: information.businessLinkUrl || null,
    storeTypeId: information?.storeTypeId || null,
    business: {
      businessName: information.businessName || null,
      location: information.address?.complete_address
        ? {
            plot_no: information.address.plot_no || null,
            floor: information.address.floor || null,
            building_name: information.address.building_name || null,
            pincode: information.address.pincode || null,
            complete_address: information.address.complete_address || null,
            coordinates: {
              latitude: information.address.lat || null,
              longitude: information.address.lng || null,
            },
          }
        : merchantProfile?.business?.location || null,
      hours: filteredHours.length > 0
        ? filteredHours
        : merchantProfile?.business?.hours || [],
      verification: {
        registrationNumber: documents.registrationNumber || null,
        taxIdentificationNumber: documents.taxIdentificationNumber || null,
        registrationCertificateUrl: documents.registrationCertificateUrl || null,
        businessDocumentUrl: documents.businessDocumentUrl || null,
      },
      branding: {
        storeLogo: documents.storeLogo || null,
        storePic: documents.storePic || null,
      },
    },
    ownerVerification: {
      idProofUrl: documents.idProofUrl || null,
      selfieUrl: documents.selfieUrl || null,
    },
    isProfileCompleted,
    agreeToTermsAndConditions: consent.agreeToTermsAndConditions,
    allowNotifications: consent.allowNotifications,
  };
}
