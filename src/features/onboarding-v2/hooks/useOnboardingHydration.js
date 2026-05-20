import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "@/store/api/userProfileApi";
import { setOwnerProfile } from "@/store/ownerProfileSlice";
import {
  hydrateFromProfile,
  selectIsInitialized,
} from "../store/onboardingSlice";

export const useOnboardingHydration = (passedMerchantId) => {
  const dispatch = useDispatch();
  const initialized = useSelector(selectIsInitialized);
  const { profile } = useSelector((state) => state?.businessProfile);
  const ownerProfile = useSelector((state) => state?.ownerProfile?.profile);

  const merchant = profile?.merchant;
  const merchantId = merchant?._id || passedMerchantId;
  const { data: queryResult } = useGetUserProfileQuery(merchantId, { skip: !merchantId });

  useEffect(() => {
    const ownerDetails = queryResult?.data?.ownerDetails;
    if (ownerDetails) {
      dispatch(setOwnerProfile({ user: { ...ownerProfile, ...ownerDetails } }));
    }
  }, [queryResult, dispatch]);

  useEffect(() => {
    if (!initialized && merchant?._id) {
      dispatch(
        hydrateFromProfile({
          merchant,
          ownerDetails: profile?.ownerDetails || {},
          ownerProfile: ownerProfile || {},
        }),
      );
    }
  }, [initialized, merchant, profile?.ownerDetails, ownerProfile, dispatch]);

  return { merchantId, merchant, profile, ownerProfile, initialized };
};
