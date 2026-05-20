import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useCategory } from '@hooks/api';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';

export const useBusinessCategory = () => {
  const { profile } = useSelector((state) => state?.businessProfile);
  const { categoryName, categoryConfig, categorySlug } = useCategory();
  const { data: categoryList = [] } = useGetCategoriesQuery();


  const businessCategoryId = useMemo(() => {
    if (!categoryList || categoryList.length === 0) {
      return profile?.categoryId || null;
    }

    const businessCategory = categoryList.find(
      (cat) => cat.name === categoryName || cat._id === profile?.categoryId
    );

    return businessCategory?._id || profile?.categoryId || null;
  }, [categoryList, categoryName, profile?.categoryId]);


  const businessCategory = useMemo(() => {
    if (!categoryList || categoryList.length === 0) {
      return null;
    }

    return (
      categoryList.find(
        (cat) => cat.name === categoryName || cat._id === profile?.categoryId
      ) || null
    );
  }, [categoryList, categoryName, profile?.categoryId]);

  return {
    businessCategoryId,
    businessCategory,
    categoryName,
    categoryConfig,
    categorySlug: categoryConfig?.slug || categorySlug,
    categoryList,
    isRestaurant: categoryName === 'Restaurant',
    isPharmacy: categoryName === 'Pharmacy',
    isGrocery: categoryName === 'Grocery',
    isLiquor: categoryName === 'Liquor',
  };
};
