import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getCategoryConfig } from "@/helpers/constants/categories";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";

export const useCategory = () => {
  const { profile } = useSelector((state) => state?.businessProfile);
  const { data: categoryList = [] } = useGetCategoriesQuery();

  const categoryName = useMemo(() => {
    const directName =
      profile?.merchant?.categoryName ||
      profile?.category?.name ||
      profile?.categoryName;

    if (directName) return directName;

    if (profile?.categoryId && categoryList.length > 0) {
      const matched = categoryList.find((cat) => cat._id === profile.categoryId);
      if (matched?.name) return matched.name;
    }

    return "Restaurant";
  }, [profile, categoryList]);

  const categoryConfig = getCategoryConfig(categoryName);

  return {
    categoryName,
    categoryConfig,
    categorySlug: categoryConfig?.slug || "restaurant",
    isRestaurant: categoryName === "Restaurant",
    isPharmacy: categoryName === "Pharmacy",
    isGrocery: categoryName === "Grocery",
    isLiquor: categoryName === "Liquor",
    ...categoryConfig,
  };
};

