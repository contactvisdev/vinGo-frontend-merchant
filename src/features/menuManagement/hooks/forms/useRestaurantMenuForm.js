import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useGetFoodTypesQuery } from "@/store/api/foodTypeApi";
import { useMenuFormBase } from "./useMenuFormBase";
import { useDynamicList } from "./useDynamicList";
import validateRestaurantMenuForm from "../../utils/validateRestaurantMenuForm";

const PREP_TIME_OPTIONS = [
  { name: "10 min", value: "10" },
  { name: "20 min", value: "20" },
  { name: "30 min", value: "30" },
  { name: "45 min", value: "45" },
  { name: "1 hour", value: "60" },
];

const INITIAL_FORM_STATE = {
  itemType: "",
  catalogId: "",
  promotionalCatalogId: "",
  foodTypeId: "",
  merchantId: "",
  name: "",
  description: "",
  basePrice: "",
  item_img: "",
  availability: true,
  preparationTime: "",
  foodType: "",
  isDefaultVariant: false,
  defaultVariantName: "",
  variants: [],
  addons: [],
};

const mapItemToForm = (item, ctx) => {
  const rawVariants = item?.itemVariants || [];
  const defaultVariant = rawVariants.find((v) => v?.isDefault);
  const nonDefaultVariants = rawVariants.filter((v) => !v?.isDefault);

  return {
    ...INITIAL_FORM_STATE,
    itemType: ctx.itemType,
    categoryId: item?.categoryId || ctx.categoryId,
    catalogId: item?.catalogId || null,
    promotionalCatalogId: item?.promotionalCatalogId || null,
    foodTypeId: item?.foodTypeId || null,
    merchantId: item?.merchantId || ctx.merchantId,
    name: item?.name || "",
    description: item?.description || "",
    basePrice: item?.basePrice || "",
    item_img: item?.item_img || "",
    availability: item?.availability || true,
    preparationTime: item?.preparationTime || "",
    foodType: item?.dishType || item?.foodType || "",
    // isDefaultVariant: !!defaultVariant,
    // defaultVariantName: defaultVariant?.variantName || "",
    variants: rawVariants.map((v) => ({
      name: v.variantName,
      price: v.price?.toString() || "",
      isDefault: v.isDefault,
    })),
    addons: item?.addOns?.length
      ? item.addOns.map((a) => ({
          name: a.addOnName,
          price: a.addOnPrice?.toString() || "",
        }))
      : [],
  };
};

const buildPayload = (formData, ctx, dropdownValues) => {
  const userVariants = formData.variants.map((v) => ({
    variantName: v.name,
    price: Number(v.price),
    isDefault: !!v.isDefault,
  }));

  let itemVariants = formData.defaultVariantName
    ? [
        // {
        //   variantName: formData.defaultVariantName,
        //   price: Number(formData.basePrice),
        //   isDefault: !!formData.isDefaultVariant,
        // },
        ...userVariants,
      ]
    : userVariants;
  console.log(itemVariants);
  if (itemVariants.length === 0) {
    itemVariants = [
      {
        variantName: "default",
        price: Number(formData.basePrice),
        isDefault: true,
      },
    ];
  }

  // basePrice must come from default variant
  // const defaultVariant =
  //   itemVariants.find((variant) => variant.isDefault) || itemVariants[0];

  // const basePrice = Number(defaultVariant?.price || 0);

  return {
    itemType: ctx.itemType,
    categoryId: ctx.categoryId,
    catalogId: dropdownValues.catalog,
    promotionalCatalogId: dropdownValues.promo,
    foodTypeId: dropdownValues.foodType,
    merchantId: ctx.merchantId,
    name: formData.name,
    description: formData.description,
    basePrice: Number(formData.basePrice),
    item_img: formData.item_img,
    availability: formData.availability,
    preparationTime: dropdownValues.prepTime,
    dishType: formData.foodType,
    itemVariants,
    addOns: formData.addons.map((a) => ({
      addOnName: a.name,
      addOnPrice: Number(a.price),
    })),
  };
};
export function useRestaurantMenuForm({
  catalogList,
  promotionalCatalogList,
  setMenuData,
  onHide,
  itemId,
  mode = "add",
  visible,
}) {
  const onSuccess = useCallback(() => {
    onHide?.();
    setMenuData?.();
  }, [onHide, setMenuData]);

  const [dropdownValues, setDropdownValues] = useState({
    catalog: null,
    foodType: null,
    promo: null,
    prepTime: null,
  });
  const [dropdownErrors, setDropdownErrors] = useState({
    catalog: "",
    foodType: "",
    promo: "",
    prepTime: "",
  });

  const {
    data,
    setData,
    loading,
    handleChange,
    uploadDocument,
    handleSubmit: baseSubmit,
    api,
    resetForm,
  } = useMenuFormBase({
    initialState: INITIAL_FORM_STATE,
    mode,
    itemId,
    mapItemToForm: useCallback((item, ctx) => {
      const formData = mapItemToForm(item, ctx);
      const prepTimeOption = PREP_TIME_OPTIONS.find(
        (option) => option.value === item?.preparationTime,
      );
      setDropdownValues({
        catalog: item?.catalogId || null,
        foodType: item?.foodTypeId || null,
        promo: item?.promotionalCatalogId || null,
        prepTime: prepTimeOption ? item?.preparationTime : null,
      });
      return formData;
    }, []),
    buildPayload: useCallback(
      (formData, ctx) => buildPayload(formData, ctx, dropdownValues),
      [dropdownValues],
    ),
    onSuccess,
  });

  const prevVisibleRef = useRef(false);
  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      if (mode === "add") {
        resetForm();
        setDropdownValues({ catalog: null, foodType: null, promo: null, prepTime: null });
        setDropdownErrors({ catalog: "", foodType: "", promo: "", prepTime: "" });
      }
    }
    prevVisibleRef.current = visible;
  }, [visible, mode, resetForm]);

  const { data: foodTypeList = [], isLoading: foodTypesLoading } =
    useGetFoodTypesQuery();

  const variantHandlers = useDynamicList("variants", "variant", "Variant Name", data, setData);
  const addonHandlers = useDynamicList("addons", "addon", "Add-on Name", data, setData);

  const catalogOptions = useMemo(
    () => (catalogList || []).map((cat) => ({ name: cat?.catalogName, value: cat?._id })),
    [catalogList],
  );
  const catalogPromoOptions = useMemo(
    () => (promotionalCatalogList || []).map((cat) => ({ name: cat?.title, value: cat?._id })),
    [promotionalCatalogList],
  );
  const foodTypeOptions = useMemo(
    () => (foodTypeList || []).map((food) => ({ name: food?.foodType, value: food?._id })),
    [foodTypeList],
  );

  const handleDropdownChange = useCallback((field, value) => {
    setDropdownValues((prev) => ({ ...prev, [field]: value }));
    setDropdownErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const result = validateRestaurantMenuForm(data, dropdownValues, ["catalogId"]);
    setDropdownErrors(result.dropdownErrors);
    setData((prev) => ({ ...prev, formErrors: result.formErrors }));
    return !result.hasError;
  }, [data, dropdownValues, setData]);

  const handleFormSubmit = useCallback(() => {
    baseSubmit(validateForm);
  }, [baseSubmit, validateForm]);

  const handleTopLevelDefaultChange = useCallback(
    (e) => {
      const nextValue = !!e.value;
      setData((prev) => {
        const formErrors = { ...(prev.formErrors || {}) };
        if (nextValue) delete formErrors.defaultVariantRequired;
        return {
          ...prev,
          isDefaultVariant: nextValue,
          variants: nextValue
            ? (prev.variants || []).map((v) => ({ ...v, isDefault: false }))
            : prev.variants,
          formErrors,
        };
      });
    },
    [setData],
  );

  const handleVariantChange = useCallback(
    (index, field, value) => {
      if (field === "isDefault") {
        const nextValue = !!value;
        setData((prev) => {
          const updatedVariants = (prev.variants || []).map((item, i) => ({
            ...item,
            isDefault: i === index ? nextValue : false,
          }));
          const formErrors = { ...(prev.formErrors || {}) };
          if (nextValue) delete formErrors.defaultVariantRequired;
          return {
            ...prev,
            variants: updatedVariants,
            isDefaultVariant: nextValue ? false : prev.isDefaultVariant,
            formErrors,
          };
        });
        return;
      }
      variantHandlers.handleChange(index, field, value);
    },
    [setData, variantHandlers],
  );

  const wrappedVariantHandlers = {
    ...variantHandlers,
    handleChange: handleVariantChange,
  };

  return {
    data,
    loading,
    api,
    handleChange,
    handleTopLevelDefaultChange,
    uploadDocument,
    dropdownValues,
    dropdownErrors,
    handleDropdownChange,
    catalogOptions,
    catalogPromoOptions,
    foodTypeOptions,
    foodTypesLoading,
    variantHandlers: wrappedVariantHandlers,
    addonHandlers,
    handleFormSubmit,
    PREP_TIME_OPTIONS,
  };
}
