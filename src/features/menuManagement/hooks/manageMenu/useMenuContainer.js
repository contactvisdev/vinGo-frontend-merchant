import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetCatalogsByMerchantQuery } from "@/store/api/catalogApi";
import { useGetPromotionalCatalogsByMerchantQuery } from "@/store/api/promotionalCatalogApi";
import {
  useGetItemsQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
  menuApiUtil,
} from "@/store/api/menuApi";
import { useDebounce } from "@/hooks";
import { useMenuContext } from "../forms/useMenuContext";

export const useMenuList = () => {
  const ctx = useMenuContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: catalogs = [] } = useGetCatalogsByMerchantQuery(ctx.merchantId, { skip: !ctx.merchantId });
  const { data: promotionalCatalogs = [] } = useGetPromotionalCatalogsByMerchantQuery(ctx.merchantId, { skip: !ctx.merchantId });

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCatalogId, setSelectedCatalogId] = useState(
    searchParams.get("catalog") || null
  );
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(
    searchParams.get("productType") || null
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const isTogglingRef = useRef(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const toggleTimeoutRef = useRef(null);
  const isDeletingRef = useRef(false);
  const deleteTimeoutRef = useRef(null);
  const isReloadingRef = useRef(false);
  const reloadTimeoutRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);

  const effectiveSearch = useMemo(() => debouncedSearch.trim(), [debouncedSearch]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCatalogId) params.catalog = selectedCatalogId;
    if (selectedProductTypeId) params.productType = selectedProductTypeId;
    if (page > 1) params.page = page.toString();
    
    setSearchParams(params, { replace: true });
  }, [search, selectedCatalogId, selectedProductTypeId, page, setSearchParams]);

  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    error: menuError,
    isError: menuIsError,
    refetch,
  } = useGetItemsQuery(
    {
      categoryId: ctx.categoryId,
      itemType: ctx.itemType,
      merchantId: ctx.merchantId,
      catalogId: selectedCatalogId || "",
      ...(selectedProductTypeId && { productTypeId: selectedProductTypeId }),
      page,
      limit: 12,
      searchName: effectiveSearch,
    },
    {
      skip: !ctx.ready,
    }
  );

  const dispatch = useDispatch();
  const [updateItemMutation] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const queryArgs = useMemo(() => ({
    categoryId: ctx.categoryId,
    itemType: ctx.itemType,
    merchantId: ctx.merchantId,
    catalogId: selectedCatalogId || "",
    ...(selectedProductTypeId && { productTypeId: selectedProductTypeId }),
    page,
    limit: 12,
    searchName: effectiveSearch,
  }), [ctx.categoryId, ctx.itemType, ctx.merchantId, selectedCatalogId, selectedProductTypeId, page, effectiveSearch]);

  useEffect(() => {
    setPage(1);
  }, [effectiveSearch, selectedCatalogId, selectedProductTypeId]);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";
    const urlCatalog = searchParams.get("catalog") || null;
    const urlProductType = searchParams.get("productType") || null;

    if (urlPage !== page) setPage(urlPage);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlCatalog !== selectedCatalogId) setSelectedCatalogId(urlCatalog);
    if (urlProductType !== selectedProductTypeId) setSelectedProductTypeId(urlProductType);
  }, [searchParams]);

  useEffect(() => {
    if (isTogglingRef.current) {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }

      if (!menuFetching) {
        toggleTimeoutRef.current = setTimeout(() => {
          isTogglingRef.current = false;
          setIsTogglingAvailability(false);
        }, 500); 
      }
    }
    return () => {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
    };
  }, [menuFetching]);

  useEffect(() => {
    if (isReloadingRef.current) {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      if (!menuFetching) {
        reloadTimeoutRef.current = setTimeout(() => {
          isReloadingRef.current = false;
        }, 500);
      }
    }
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [menuFetching]);

  useEffect(() => {
    if (isDeletingRef.current) {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      if (!menuFetching) {
        deleteTimeoutRef.current = setTimeout(() => {
          isDeletingRef.current = false;
        }, 500);
      }
    }
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, [menuFetching]);

  const toggleAvailability = useCallback(async (id) => {
    if (isTogglingRef.current) return;

    const items = menuData?.list || [];
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const newAvailability = !item.availability;

    if (toggleTimeoutRef.current) {
      clearTimeout(toggleTimeoutRef.current);
    }

    isTogglingRef.current = true;
    setIsTogglingAvailability(true);

    const patchResult = dispatch(
      menuApiUtil.updateQueryData("getItems", queryArgs, (draft) => {
        const target = draft.list.find((i) => i._id === id);
        if (target) target.availability = newAvailability;
      })
    );

    try {
      await updateItemMutation({
        id,
        ...item,
        availability: newAvailability,
        itemType: ctx.itemType,
      }).unwrap();
    } catch {
      patchResult.undo();
      isTogglingRef.current = false;
      setIsTogglingAvailability(false);
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
    }
  }, [menuData, queryArgs, dispatch, updateItemMutation, ctx.itemType]);

  const deleteItem = async (ids) => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }
    isDeletingRef.current = true;

    const payload = {
      itemType: ctx.itemType,
      ids: Array.isArray(ids) ? ids : [ids],
    };
    try {
      await deleteItemMutation(payload).unwrap();
    } catch {
      isDeletingRef.current = false;
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    }
  };

  const loading = !ctx.ready || menuLoading;
  const fetching = menuFetching && !isTogglingRef.current && !isDeletingRef.current && !isReloadingRef.current;

  const silentReload = useCallback(() => {
    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current);
    }
    isReloadingRef.current = true;
    refetch();
  }, [refetch]);

  return {
    catalogs,
    promotionalCatalogs,
    items: menuData?.list || [],
    pagination: menuData?.pagination || {},
    totalItems: menuData?.totalItems || 0,
    catalogCount: menuData?.catalogCounts || [],
    search,
    setSearch,
    selectedCatalogId,
    setSelectedCatalogId,
    selectedProductTypeId,
    setSelectedProductTypeId,
    selectedIds,
    setSelectedIds,
    page,
    setPage,
    loading,
    fetching,
    error: menuError,
    isError: menuIsError,
    toggleAvailability,
    reload: silentReload,
    deleteItem,
  };
};

export const useMenuForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  return {
    showForm,
    editingItem,
    openAdd: () => {
      setEditingItem(null);
      setShowForm(true);
    },
    openEdit: (item) => {
      setEditingItem(item);
      setShowForm(true);
    },
    closeForm: () => {
      setShowForm(false);
      setEditingItem(null);
    },
  };
};

export const useMenuDelete = ({ deleteItem, selectedIds, setSelectedIds, reload }) => {
  const [showDelete, setShowDelete] = useState(false);

  const confirmDelete = async () => {
    if (!selectedIds.length) return;
    await deleteItem(selectedIds);
    setSelectedIds([]);
    setShowDelete(false);
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
  };

  return {
    showDelete,
    openDelete: () => setShowDelete(true),
    closeDelete: () => setShowDelete(false),
    confirmDelete,
    handleDeleteItem,
  };
};
