import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCatalogsByMerchantQuery } from "@/store/api/catalogApi";
import { useGetPromotionalCatalogsByMerchantQuery } from "@/store/api/promotionalCatalogApi";
import { useGetItemByIdQuery, useDeleteItemMutation } from "@/store/api/menuApi";
import { useMenuContext } from "../forms/useMenuContext";

/**
 * Hook for fetching and managing a single menu item's data.
 */
export const useViewItem = () => {
  const { id } = useParams();
  const ctx = useMenuContext();

  const {
    data: itemResponse,
    isLoading: itemLoading,
    error: queryError,
    refetch,
  } = useGetItemByIdQuery(
    { id, itemType: ctx.itemType },
    { skip: !id }
  );

  const [deleteItemMutation] = useDeleteItemMutation();

  const { data: catalogs = [] } = useGetCatalogsByMerchantQuery(ctx.merchantId, { skip: !ctx.merchantId });
  const { data: promotionalCatalogs = [] } = useGetPromotionalCatalogsByMerchantQuery(ctx.merchantId, { skip: !ctx.merchantId });

  const item = itemResponse?.data || itemResponse || null;
  const error = queryError?.message || (!itemLoading && !item && id ? "Item not found" : null);

  const deleteItem = async (ids) => {
    const payload = {
      itemType: ctx.itemType,
      ids: Array.isArray(ids) ? ids : [ids],
    };
    await deleteItemMutation(payload).unwrap();
  };

  return {
    item,
    loading: itemLoading || ctx.categoriesLoading,
    error,
    catalogs,
    promotionalCatalogs,
    fetchItem: refetch,
    deleteItem,
  };
};

export const useViewActions = ({ item, deleteItem, fetchItem }) => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const confirmDelete = async () => {
    if (!item?._id) return;
      await deleteItem(item._id);
      setShowDelete(false);
      navigate(-1);
  };

  return {
    showForm,
    openEdit: () => setShowForm(true),
    closeForm: () => setShowForm(false),
    reloadItem: fetchItem,
    showDelete,
    openDelete: () => setShowDelete(true),
    closeDelete: () => setShowDelete(false),
    confirmDelete,
  };
};
