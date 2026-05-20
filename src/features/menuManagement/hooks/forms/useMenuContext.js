import { useCategory } from "@hooks/api";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetUserProfileQuery } from "@/store/api/userProfileApi";
import { useBusinessCategory } from "@hooks/useBusinessCategory";
import { useAuthState } from "@/hooks";

export const useMenuContext = () => {
  const { profile } = useAuthState();

  useGetUserProfileQuery(undefined, { skip: !!profile?._id });

  const { categoryName, categorySlug } = useCategory();
  const { businessCategoryId, categorySlug: businessSlug } = useBusinessCategory();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const getCategoryByName = (name) => categories.find((c) => c.name === name);

  const merchantId = profile?.merchant?._id || profile?._id || "";

  const categoryId = businessCategoryId || getCategoryByName(categoryName)?._id || null;
  const itemType = (businessSlug || categorySlug || "restaurant").toLowerCase();

  const ready = !!merchantId && !!categoryId && !categoriesLoading;

  return { profile, merchantId, categoryId, itemType, categoriesLoading, ready };
};
