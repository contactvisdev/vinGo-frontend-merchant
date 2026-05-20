import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useLazyGetUserProfileQuery } from "@/store/api/userProfileApi";
import { useAuthApi } from "@features/auth/hooks";
import { setBusinessProfile } from "@/store/businessProfileSlice";
import { resetOnboarding } from "@/features/onboarding-v2/store/onboardingSlice";
import { useLazyGetStaffByIdQuery } from "@/store/api/businessStaffApi";

export default function useSelectCategory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxMerchants = useSelector((s) => s?.ownerProfile?.merchants || []);
  const isPreloaded = useRef(reduxMerchants.length > 0);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [existingBusinesses, setExistingBusinesses] = useState(reduxMerchants);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);

  const { data: categoryList = [] } = useGetCategoriesQuery();

  const profileId = useSelector((s) => s?.ownerProfile?.profile?._id);
  const profileCategoryId = useSelector(
    (s) => s?.ownerProfile?.profile?.categoryId,
  );
  const merchantExists = useSelector((s) => s?.ownerProfile?.merchantExists);
  const role = useSelector((s) => s?.ownerProfile?.profile?.role);

  const [triggerGetUserProfile, { isFetching: profileLoading }] =
    useLazyGetUserProfileQuery();
  const { createMerchant, loading, getMerchantsByOwner, deleteMerchant } = useAuthApi();
  const [triggerGetStaffById] = useLazyGetStaffByIdQuery();

  const findCategoryById = useCallback(
    (id) => categoryList.find((cat) => cat._id === id),
    [categoryList],
  );

  const findRestaurantCategory = useCallback(
    () => categoryList.find((cat) => cat.name === "Restaurant"),
    [categoryList],
  );

  const setDefaultCategory = useCallback(
    (setTab = false) => {
      const fallback = findRestaurantCategory() || categoryList[0];
      if (!fallback) return null;
      setSelectedCategory(fallback);
      if (setTab) setActiveTab(fallback._id);
      return fallback;
    },
    [findRestaurantCategory, categoryList],
  );

  const setInitialCategoryFromBusinesses = useCallback(
    (businesses) => {
      if (businesses.length === 0 || categoryList.length === 0) {
        return setDefaultCategory(true);
      }
      const first = findCategoryById(businesses[0].categoryId);
      if (first) {
        setActiveTab(first._id);
        setSelectedCategory(first);
        return;
      }
      setDefaultCategory(true);
    },
    [categoryList, findCategoryById, setDefaultCategory],
  );

  useEffect(() => {
    if (!profileId) triggerGetUserProfile();
  }, []);

  useEffect(() => {
    if (!merchantExists || !profileId || categoryList.length === 0) return;

    if (isPreloaded.current) {
      isPreloaded.current = false;
      setInitialCategoryFromBusinesses(reduxMerchants);
      return;
    }

    const fetchBusinesses = async () => {
      setBusinessesLoading(true);
      try {
        if (role === "staff") {
          const result = await triggerGetStaffById({ id: profileId }).unwrap();
          const merchants = result?.data?.roles[0]?.merchants || [];
          setExistingBusinesses(merchants);
          setInitialCategoryFromBusinesses(merchants);
        } else {
          const result = await getMerchantsByOwner(profileId);
          const list = result?.data?.list || [];
          setExistingBusinesses(list);
          setInitialCategoryFromBusinesses(list);
        }
      } catch(error) {
        if(import.meta.env.DEV) console.log("Error fetching businesses", error);
      } finally {
        setBusinessesLoading(false);
      }
    };

    fetchBusinesses();
  }, [merchantExists, profileId, categoryList.length]);

  useEffect(() => {
    if (merchantExists || selectedCategory || profileLoading) return;
    if (categoryList.length === 0) return;

    if (profileCategoryId) {
      const fromProfile = findCategoryById(profileCategoryId);
      if (fromProfile) {
        setSelectedCategory(fromProfile);
        return;
      }
    }
    const restaurant = findRestaurantCategory();
    if (restaurant) setSelectedCategory(restaurant);
  }, [
    categoryList,
    selectedCategory,
    profileCategoryId,
    profileLoading,
    merchantExists,
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (merchantExists) setActiveTab(category._id);
  };

  const handleTabChange = (categoryId) => {
    setActiveTab(categoryId);
    const category = findCategoryById(categoryId);
    if (category) setSelectedCategory(category);
  };

  const sortBusinesses = (businesses) => {
    const priority = (b) => {
      if (b.status === "accepted") return 0;
      if (b.isProfileCompleted) return 1;
      return 2;
    };
    return [...businesses].sort((a, b) => priority(a) - priority(b));
  };

  const getBusinessesForCategory = (categoryId) =>
    sortBusinesses(existingBusinesses.filter((b) => b.categoryId === categoryId));

  const handleBusinessClick = (business) => {
    if (role === "staff") {
      dispatch(setBusinessProfile(business));
      navigate("/dashboard");
      return;
    }

    const { isProfileCompleted, isDocumentVerified } = business;

    if (isProfileCompleted && !isDocumentVerified) {
      setShowReviewModal(true);
      return;
    }
    if (isProfileCompleted && isDocumentVerified) {
      dispatch(setBusinessProfile(business));
      navigate("/dashboard");
      return;
    }
    if (!isProfileCompleted) {
      const category = findCategoryById(business.categoryId);
      if (category) {
        dispatch(setBusinessProfile({ merchant: business }));
        dispatch(resetOnboarding());
        navigate("/onboarding", {
          state: { merchantId: business._id },
        });
      }
    }
  };

  const handleContinue = async () => {
    if (!selectedCategory || !profileId) return;
    try {
      const result = await createMerchant({
        OwnerId: profileId,
        categoryId: selectedCategory._id,
      });
      dispatch(resetOnboarding());
      const newMerchantId = result?.data?.merchant?._id;
      navigate("/onboarding", {
        state: newMerchantId ? { merchantId: newMerchantId } : undefined,
      });
    } catch(error) {
      if(import.meta.env.DEV) console.log("Error creating merchant", error);
    }
  };

  const handleDeleteClick = (business) => {
    setBusinessToDelete(business);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;
    try {
      await deleteMerchant([businessToDelete._id]);
      setExistingBusinesses((prev) =>
        prev.filter((b) => b._id !== businessToDelete._id),
      );
    } catch(error) {
      if(import.meta.env.DEV) console.log("Error deleting merchant", error);
    } finally {
      setBusinessToDelete(null);
    }
  };

  const currentCategoryBusinesses = activeTab
    ? getBusinessesForCategory(activeTab)
    : [];

  return {
    categoryList,
    selectedCategory,
    activeTab,
    merchantExists,
    role,
    loading: loading || profileLoading || businessesLoading,
    showReviewModal,
    currentCategoryBusinesses,
    hasBusinessesForActiveTab: currentCategoryBusinesses.length > 0,
    handleCategorySelect,
    handleTabChange,
    handleBusinessClick,
    handleContinue,
    getBusinessesForCategory,
    setShowReviewModal,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
