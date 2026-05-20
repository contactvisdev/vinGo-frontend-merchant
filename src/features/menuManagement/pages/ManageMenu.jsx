import { useMemo, useRef, useEffect, useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { MenuItemCard } from "@features/menuManagement/components/manageMenu";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Table/Pagination";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import { useMenuList, useMenuForm, useMenuDelete } from "../hooks";
import { useMenuContext } from "../hooks/forms/useMenuContext";
import { useGetProductTypesQuery } from "@/store/api/productTypeApi";
import { MENU_ITEM_PLACEHOLDER } from "../constants";
import MenuForm from "../components/forms/MenuForm";
import usePermission from "@/hooks/usePermission";
import { CustomDropdown } from "@/components/forms/AllInput";
import CatalogEmptyState from "../components/menuCatalog/CatalogEmptyState";
import { CustomSearchInput } from "@/components/forms/CustomSearchInput";

function formatData(data) {
  if (!data) return [];
  return data.map((item) => ({
    value: item._id,
    name: item.name,
  }));
}

export default function ManageMenu() {
  const { merchantId, itemType } = useMenuContext();
  const isGrocery = itemType?.includes("grocery");

  const { data: productTypes = [] } = useGetProductTypesQuery(
    { merchantId },
    { skip: !isGrocery || !merchantId },
  );

  const list = useMenuList();
  const form = useMenuForm();
  const del = useMenuDelete({
    deleteItem: list.deleteItem,
    selectedIds: list.selectedIds,
    setSelectedIds: list.setSelectedIds,
    reload: list.reload,
  });

  const hasPermission = usePermission();
  const canCreate = hasPermission("menu", "canCreate");
  const canDelete = hasPermission("menu", "canDelete");
  const canEdit = hasPermission("menu", "canEdit");

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const catalogs = Array.isArray(list?.catalogCount) ? list.catalogCount : [];

  const tabItems = useMemo(() => {
    const allItemsCount =
      list?.search?.length >= 1
        ? (list?.pagination?.totalItems ?? 0)
        : (list?.totalItems ?? 0);

    const allTab = {
      id: null,
      template: (item, options) => (
        <button className={options.className} onClick={options.onClick}>
          <span className="flex items-center">
            All Items
            <span
              className={`ml-1 text-[14px] rounded-full  w-8 h-8 p-2 ${
                list.selectedCatalogId === null
                  ? "bg-primary-300 text-primary-800"
                  : "bg-[#C2C2C2]"
              }`}
            >
              {allItemsCount}
            </span>
          </span>
        </button>
      ),
    };

    const catalogTabs = catalogs.map((cat) => ({
      id: cat._id,
      template: (item, options) => (
        <button className={options.className} onClick={options.onClick}>
          <span className="flex items-center">
            {cat.catalogName}
            <span
              className={`ml-1 text-[14px] rounded-full w-8 h-8 p-2 ${
                list.selectedCatalogId === cat._id
                  ? "bg-primary-300 text-primary-800"
                  : "bg-neutral-300 text-[#404040]"
              }`}
            >
              {cat.count || 0}
            </span>
          </span>
        </button>
      ),
    }));

    return [allTab, ...catalogTabs];
  }, [
    catalogs,
    list.selectedCatalogId,
    list?.search,
    list?.pagination?.totalItems,
    list?.totalItems,
  ]);

  const activeTabIndex = useMemo(() => {
    if (list.selectedCatalogId === null) return 0;
    const idx = catalogs.findIndex((c) => c._id === list.selectedCatalogId);
    return idx === -1 ? 0 : idx + 1;
  }, [list.selectedCatalogId, catalogs]);

  const handleTabChange = (e) => {
    const selectedItem = tabItems[e.index];
    if (list.selectedIds.length) {
      list.setSelectedIds([]);
    }
    list.setSelectedCatalogId(selectedItem.id);
  };

  const selectAll = () => {
    if (!list.items.length) return;
    const currentPageIds = list.items.map((item) => item._id);
    const isAllSelected = currentPageIds.every((id) =>
      list.selectedIds.includes(id),
    );

    list.setSelectedIds((prev) => {
      if (isAllSelected) {
        return prev.filter((id) => !currentPageIds.includes(id));
      }
      const merged = new Set([...prev, ...currentPageIds]);
      return Array.from(merged);
    });
  };

  const deleteSelected = () => {
    if (!canDelete || !list.selectedIds.length) return;
    del.openDelete();
  };

  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        let inputElement = null;

        if (searchInputRef.current) {
          const element =
            searchInputRef.current.getElement?.() || searchInputRef.current;
          inputElement =
            element?.querySelector?.("input.p-inputtext") ||
            element?.querySelector?.("input") ||
            document.getElementById("search");
        }
        if (
          inputElement &&
          document.activeElement !== inputElement &&
          isSearchFocused
        ) {
          inputElement.focus();
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [list.items, isSearchFocused]);

  return (
    <>
      <BaseCard extraClassName="px-6! py-4! mb-4!">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto flex-1 lg:mr-4">
            <div className="flex-1 w-full">
              <CustomSearchInput
                ref={searchInputRef}
                name="search"
                placeholder="Search menu items"
                col={12}
                value={list.search}
                ignoreLabel={true}
                ignoreError={true}
                disabled={(list.loading || list.fetching) && !isSearchFocused}
                onChange={(e) => list.setSearch(e.value || "")}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            <CustomButton
              label="Add New Item"
              disabled={!canCreate}
              onClick={form.openAdd}
              className="shrink-0!"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto shrink-0">
            {isGrocery && (
              <div className="w-full sm:w-auto">
                <CustomDropdown
                  placeholder="Product Types"
                  options={[
                    { value: null, name: "All Product Types" },
                    ...formatData(productTypes),
                  ]}
                  optionLabel="name"
                  optionValue="value"
                  value={list.selectedProductTypeId}
                  disabled={list.loading || list.fetching}
                  onChange={(e) => list.setSelectedProductTypeId(e.value)}
                  className="m-0! w-full! sm:w-auto!"
                  layoutclass="!p-0"
                />
              </div>
            )}
            <div className="w-full sm:w-auto">
              <CustomDropdown
                placeholder="All Categories"
                options={[
                  { _id: null, catalogName: "All Categories" },
                  ...(list?.catalogCount || []),
                ]}
                optionLabel="catalogName"
                optionValue="_id"
                value={list.selectedCatalogId}
                disabled={list.loading || list.fetching}
                onChange={(e) => list.setSelectedCatalogId(e.value)}
                className="m-0! w-full! sm:w-auto!"
                layoutclass="!p-0"
              />
            </div>
          </div>
        </div>
      </BaseCard>
      <TabMenu
        model={tabItems}
        activeIndex={activeTabIndex}
        onTabChange={handleTabChange}
        className="menu-tabmenu mb-4 text-[#404040]"
      />

      {canDelete && (
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mb-4 sm:mb-">
          <CustomButton
            variant="line"
            label="Select All"
            onClick={selectAll}
            fullWidth={false}
            className="border-[#35C75E]! text-[#35C75E]! rounded-full! px-10!"
          />

          <CustomButton
            variant="line"
            label={`Delete Selected ${list.selectedIds.length > 1 ? `(${list.selectedIds.length})` : ""}`}
            onClick={deleteSelected}
            disabled={list.selectedIds.length === 0}
            fullWidth={false}
            className="border-[#E60000]! text-[#E60000]! rounded-full! "
          />
        </div>
      )}
      <AutoSkeleton
        loading={list.loading || list.fetching}
        config={{ animation: "shimmer" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.loading || list.fetching ? (
            <AutoSkeleton.Repeat count={8}>
              <MenuItemCard
                item={MENU_ITEM_PLACEHOLDER}
                selectedItems={[]}
                handleToggleSelect={() => {}}
                handleToggleAvailability={() => {}}
                handleEdit={() => {}}
                handleDelete={() => {}}
              />
            </AutoSkeleton.Repeat>
          ) : (
            list.items.map((item) => (
              <MenuItemCard
                key={item._id}
                handleDelete={() => {
                  list.setSelectedIds([item._id]);
                  del.openDelete();
                }}
                item={{ ...item, id: item._id }}
                selectedItems={list.selectedIds}
                handleToggleSelect={() =>
                  list.setSelectedIds((p) =>
                    p.includes(item._id)
                      ? p.filter((x) => x !== item._id)
                      : [...p, item._id],
                  )
                }
                handleToggleAvailability={() =>
                  list.toggleAvailability(item._id)
                }
                handleEdit={() => form.openEdit(item)}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))
          )}
        </div>
      </AutoSkeleton>
      {!list.loading && !list.fetching && list.items.length === 0 && (
        <CatalogEmptyState
          onAdd={form.openAdd}
          title="No menu items yet"
          description="Add menu items to showcase your offerings. Add your first item to get started."
          btnLabel="Add New Item"
        />
      )}
      {list.pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={list.page}
            totalPages={list.pagination.totalPages || 1}
            totalItems={list.pagination.totalItems || 0}
            pageSize={list.pagination.limit || 10}
            onPageChange={list.setPage}
          />
        </div>
      )}

      {form.showForm && (
        <MenuForm
          visible
          mode={form.editingItem ? "edit" : "add"}
          itemId={form.editingItem?._id}
          catalogList={list.catalogs}
          promotionalCatalogList={list.promotionalCatalogs}
          onHide={form.closeForm}
          setMenuData={list.reload}
        />
      )}

      <DeleteConfirmationDialog
        visible={del.showDelete}
        setVisible={del.closeDelete}
        onConfirm={del.confirmDelete}
      />
    </>
  );
}
