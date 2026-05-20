import { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/ui/Button/Button";
import IconButton from "@/components/ui/Button/IconButton";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomSearchInput } from "@/components/forms/CustomSearchInput";
import MenuForm from "@/features/menuManagement/components/forms/MenuForm";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import DeleteItemDialog from "../components/shared/DeleteItemDialog";
import { setCurrentStep } from "../store/onboardingSlice";
import { useCategory } from "@hooks/api";
import { useAuthState } from "@/hooks";
import { useBusinessCategory } from "@hooks/useBusinessCategory";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { useGetCatalogsByMerchantQuery } from "@/store/api/catalogApi";
import { useGetPromotionalCatalogsByMerchantQuery } from "@/store/api/promotionalCatalogApi";
import {
  useGetItemsQuery,
  useDeleteItemMutation,
} from "@/store/api/menuApi";

const SEARCH_DEBOUNCE_MS = 400;
const ROWS_PER_PAGE = 5;

const RESTAURANT_COLUMNS = [
  { key: "name", label: "Product" },
  { key: "catalogName", label: "Category" },
  { key: "basePrice", label: "Price" },
  { key: "availability", label: "Status" },
  { key: "actions", label: "Actions", headerClassName: "text-left" },
];

const GROCERY_COLUMNS = [
  { key: "name", label: "Product" },
  { key: "brand", label: "Brand" },
  { key: "catalogName", label: "Category" },
  { key: "basePrice", label: "Price" },
  { key: "availability", label: "Status" },
  { key: "actions", label: "Actions", headerClassName: "text-left" },
];

const PAGE_CONFIG = {
  restaurant: { title: "Edit Food & Beverages", subtitle: "Modify your menu items" },
  grocery: { title: "Edit Grocery Products", subtitle: "Modify your grocery products" },
  pharmacy: { title: "Edit Pharmacy Products", subtitle: "Modify your pharmacy products" },
};

const ViewItem = ({ BackTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useAuthState();
  const { categoryName, categorySlug, isGrocery } = useCategory();
  const { businessCategoryId } = useBusinessCategory();

  const merchantId = profile?.merchant?._id || profile?._id || "";

  const tableColumns = isGrocery ? GROCERY_COLUMNS : RESTAURANT_COLUMNS;
  const pageConfig = PAGE_CONFIG[categorySlug] || PAGE_CONFIG.restaurant;

  const { data: catalogList = [] } = useGetCatalogsByMerchantQuery(
    merchantId,
    { skip: !merchantId },
  );
  const { data: promotionalCatalogList = [] } =
    useGetPromotionalCatalogsByMerchantQuery(merchantId, {
      skip: !merchantId,
    });

  const [openEditItem, setOpenEditItem] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatalogFilter, setSelectedCatalogFilter] = useState(null);
  const [page, setPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const {
    data: menuQueryData,
    isLoading,
    isFetching,
    refetch: refetchItems,
  } = useGetItemsQuery(
    {
      categoryId: businessCategoryId,
      itemType: categorySlug,
      merchantId: merchantId,
      catalogId: selectedCatalogFilter || "",
      page: 1,
      limit: 100,
      searchName: debouncedSearchQuery,
    },
    {
      skip: !merchantId || !businessCategoryId,
    },
  );
  const loading = isLoading || isFetching;
  const menuData = menuQueryData?.list || [];
  const hasActiveSearchOrFilter = Boolean(
    searchQuery?.trim() || selectedCatalogFilter,
  );
  const shouldDisableSearchAndCatalog =
    menuData.length === 0 && !hasActiveSearchOrFilter;
  const setMenuData = () => {};

  const totalPages = Math.max(1, Math.ceil(menuData.length / ROWS_PER_PAGE));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return menuData.slice(start, start + ROWS_PER_PAGE);
  }, [menuData, page]);

  const [deleteItemMutation] = useDeleteItemMutation();
  const deleteItem = async (id) => {
    await deleteItemMutation({ itemType: categorySlug, ids: [id] }).unwrap();
  };

  const handleBack = () => {
    dispatch(setCurrentStep(4));
    navigate("/onboarding");
  };

  const handleEdit = (row) => {
    setSelectedItemId(row._id);
    setOpenEditItem(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete._id);
      setDeleteConfirmDialog(false);
      setItemToDelete(null);
    } catch {
      setDeleteConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleEditClose = () => {
    setOpenEditItem(false);
    setSelectedItemId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCatalogFilter(null);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderRow = useCallback(
    (row, index) => (
      <tr key={row._id || index} className="border-b border-gray-200 text-sm text-gray-800">
        <td className="py-4">
          <div className="pl-3">
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-400">{row.description?.length > 50 ? `${row.description.slice(0, 50)}...` : row.description}</p>
          </div>
        </td>
        {isGrocery && (
          <td className="py-4 pl-3">{row.brand || "N/A"}</td>
        )}
        <td className="py-4 pl-3">
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
            {row.catalogName || "N/A"}
          </span>
        </td>
        <td className="py-4 pl-3">${row.basePrice || "0"}</td>
        <td className="py-4 pl-3">
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              row.availability
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {row.availability ? "In Stock" : "Out of Stock"}
          </span>
        </td>
        <td className="flex py-4 px-2 text-right space-x-1">
          <IconButton
            icon={Pencil}
            onClick={() => handleEdit(row)}
            ariaLabel="Edit row"
            size={16}
          />
          <IconButton
            icon={Trash2}
            onClick={() => handleDelete(row)}
            ariaLabel="Delete row"
            variant="danger"
            size={16}
          />
        </td>
      </tr>
    ),
    [handleEdit, handleDelete, isGrocery],
  );

  return (
    <>
      <div className="items">
        <div className="flex gap-2 text-left w-full">
          <i
            onClick={handleBack}
            className="pi pi-chevron-left cursor-pointer"
            style={{ fontSize: "24px" }}
          ></i>
          <p
            onClick={handleBack}
            className="cursor-pointer  2xl:text-base lg:text-sm text-xs"
          >
            Back
          </p>
        </div>
        <div className="mt-8">
          <h1 className="text-3xl font-medium">{pageConfig.title}</h1>
          <p className="text-base ">{pageConfig.subtitle}</p>
        </div>
        <div className="w-full mt-16">
          <div className="bg-white rounded-2xl p-6">
            {/* Search + Filter - always visible */}
            <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
              <div className="flex w-max gap-3 mt-8 mb-8">
                <CustomSearchInput
                  name="searchQuery"
                  value={searchQuery}
                  onChange={({ value }) => setSearchQuery(value)}
                  placeholder="Search by name or description"
                  disabled={shouldDisableSearchAndCatalog}
                  className="w-80"
                  ignoreLabel
                  ignoreError
                />
                <CustomDropdown
                  placeholder="All Catalog"
                  className=""
                  options={catalogList?.map((cat) => ({
                    name: cat?.catalogName,
                    value: cat?._id,
                  }))}
                  value={selectedCatalogFilter}
                  onChange={(e) => setSelectedCatalogFilter(e.value)}
                  disabled={shouldDisableSearchAndCatalog}
                />
                <button
                  type="button"
                  onClick={handleResetFilters}
                  disabled={!hasActiveSearchOrFilter}
                  aria-label="Reset filters"
                  className="flex items-center gap-2 px-3 h-11.5 border border-neutral-400 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </AutoSkeleton>

            <Table
              columns={tableColumns}
              data={paginatedData}
              loading={loading}
              skeletonRows={5}
              emptyMessage={hasActiveSearchOrFilter ? "No results match your search or filter" : "No items added yet"}
              pagination={{
                currentPage: page,
                totalPages,
                totalItems: menuData.length,
                limit: ROWS_PER_PAGE,
              }}
              onPageChange={handlePageChange}
              renderRow={renderRow}
              headerClassName="!bg-transparent font-semibold text-gray-700 pb-3"
              className="border-0"
            />
          </div>
        </div>
        {/* Edit Item Dialog */}
        {openEditItem && selectedItemId && (
          <MenuForm
            visible={openEditItem}
            itemId={selectedItemId}
            onHide={handleEditClose}
            catalogList={catalogList}
            promotionalCatalogList={promotionalCatalogList}
            setMenuData={setMenuData}
            mode="edit"
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteItemDialog
          visible={deleteConfirmDialog}
          onHide={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          item={itemToDelete}
        />
      </div>
    </>
  );
};

export default ViewItem;
