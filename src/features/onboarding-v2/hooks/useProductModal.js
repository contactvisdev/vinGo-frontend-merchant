import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCategory } from "@hooks/api";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from "@/store/api/menuApi";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { getInitialProductState } from "../utils/categoryFieldConfig";

export const useProductModal = ({
  categorySlug: slugProp,
  catalogList = [],
  itemId = null,
  itemData = null,
  onHide,
}) => {
  const { profile } = useSelector((state) => state?.businessProfile);
  const { categoryName, categorySlug: slugFromHook } = useCategory();
  const categorySlug = slugProp || slugFromHook;

  const [loading, setLoading] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState("");
  const [uploadFileMutation] = useUploadFileMutation();
  const [createItemMut] = useCreateItemMutation();
  const [updateItemMut] = useUpdateItemMutation();

  const { data: categoryList = [] } = useGetCategoriesQuery();
  const businessCategoryId = useMemo(() => {
    const cat = categoryList.find(
      (c) => c.name === categoryName || c._id === profile?.categoryId,
    );
    return cat?._id || profile?.categoryId || null;
  }, [categoryList, categoryName, profile?.categoryId]);

  const [data, setData] = useState(() => getInitialProductState(categorySlug));
  const isEditMode = !!itemId && !!itemData;

  useEffect(() => {
    if (isEditMode) {
      const formatted = itemData.expiryDate
        ? new Date(itemData.expiryDate).toISOString().split("T")[0]
        : "";
      setData({
        ...getInitialProductState(categorySlug),
        name: itemData.name || "",
        description: itemData.description || "",
        basePrice: itemData.basePrice?.toString() || "",
        item_img: itemData.item_img || "",
        availability: itemData.availability ?? true,
        catalogId: itemData.catalogId || "",
        ...(categorySlug === "grocery" && {
          brand: itemData.brand || "",
          quantity: itemData.quantity || "",
          pcs: itemData.pcs?.toString() || "",
          expiryDate: formatted,
        }),
        ...(categorySlug === "pharmacy" && {
          stockQuantity: itemData.stockQuantity?.toString() || "",
          expiryDate: formatted,
        }),
        addOns:
          itemData.addOns?.map((a) => ({
            addOnName: a.addOnName || "",
            addOnPrice: a.addOnPrice?.toString() || "",
            addOnImg: a.addOnImg || "",
          })) || [],
        formErrors: {},
      });
      setSelectedCatalog(itemData.catalogId || null);
    } else {
      setData(getInitialProductState(categorySlug));
      setSelectedCatalog(null);
    }
  }, [itemId, itemData, categorySlug]);

  const handleChange = ({ name, value }) => {
    setData((prev) => {
      const formErrors = formValidation(name, value, prev);
      return { ...prev, [name]: value, formErrors };
    });
  };

  const handleSelectedCatalog = (e) => {
    setSelectedCatalog(e.value);
    setCatalogError("");
    setData((prev) => ({ ...prev, catalogId: e.value }));
  };

  const uploadFile = async (file) => {
    setLoading(true);
    try {
      const result = await uploadFileMutation(file).unwrap();
      return result?.data?.url;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file, name) => {
    const url = await uploadFile(file);
    if (url) handleChange({ name, value: url });
  };

  const uploadAddOnImage = (index) => async (file) => {
    const url = await uploadFile(file);
    if (url) {
      setData((prev) => {
        const addOns = [...prev.addOns];
        addOns[index] = { ...addOns[index], addOnImg: url };
        return { ...prev, addOns };
      });
    }
  };

  const addAddOn = () => {
    setData((prev) => ({
      ...prev,
      addOns: [...prev.addOns, { addOnName: "", addOnPrice: "", addOnImg: "" }],
    }));
  };

  const removeAddOn = (index) => {
    setData((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index),
    }));
  };

  const updateAddOn = (index, field, value) => {
    setData((prev) => {
      const addOns = [...prev.addOns];
      addOns[index] = { ...addOns[index], [field]: value };
      return { ...prev, addOns };
    });
  };

  const handleSubmit = async () => {
    if (!selectedCatalog) {
      setCatalogError("Please select a category");
      return;
    }
    if (!showFormErrors(data, setData)) return;
    if (!profile?.merchant?._id || !businessCategoryId) return;

    const payload = {
      itemType: categorySlug,
      categoryId: businessCategoryId,
      catalogId: selectedCatalog,
      merchantId: profile.merchant._id,
      name: data.name,
      description: data.description,
      basePrice: Number(data.basePrice),
      item_img: data.item_img,
      availability: data.availability,
      ...(categorySlug === "grocery" && {
        brand: data.brand,
        quantity: data.quantity,
        pcs: data.pcs ? Number(data.pcs) : undefined,
      }),
      ...(categorySlug === "pharmacy" && {
        stockQuantity: data.stockQuantity
          ? Number(data.stockQuantity)
          : undefined,
      }),
      expiryDate: data.expiryDate
        ? new Date(data.expiryDate).toISOString()
        : undefined,
      addOns: data.addOns
        .filter((a) => a.addOnName && a.addOnPrice)
        .map((a) => ({
          addOnName: a.addOnName,
          addOnPrice: Number(a.addOnPrice),
          addOnImg: a.addOnImg || undefined,
        })),
    };

    try {
      setLoading(true);
      if (isEditMode && itemId) {
        await updateItemMut({ id: itemId, ...payload }).unwrap();
      } else {
        await createItemMut(payload).unwrap();
      }
      setData(getInitialProductState(categorySlug));
      setSelectedCatalog(null);
      onHide?.();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Product creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const catalogOptions = catalogList?.map((cat) => ({
    name: cat?.catalogName,
    value: cat?._id,
  }));

  return {
    data,
    setData,
    loading,
    isEditMode,
    selectedCatalog,
    catalogError,
    catalogOptions,
    handleChange,
    handleSelectedCatalog,
    uploadDocument,
    uploadAddOnImage,
    addAddOn,
    removeAddOn,
    updateAddOn,
    handleSubmit,
  };
};
