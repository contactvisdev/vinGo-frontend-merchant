import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useCategory } from "@hooks/api";
import { useOnboardingNavigation } from "../hooks";
import { useModalWithData } from "@/hooks";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetCatalogsByMerchantQuery } from "@/store/api/catalogApi";
import { useGetPromotionalCatalogsByMerchantQuery } from "@/store/api/promotionalCatalogApi";
import { useGetItemsQuery, useDeleteItemMutation } from "@/store/api/menuApi";
import RestaurantMenuForm from "@features/menuManagement/components/forms/RestaurantMenuForm";
import GroceryMenuForm from "@features/menuManagement/components/forms/GroceryMenuForm";
import PharmacyMenuForm from "@features/menuManagement/components/forms/PharmacyMenuForm";
import LiquorMenuForm from "@features/menuManagement/components/forms/LiquorMenuForm";
import { PromotionalCatalogForm } from "@/features/menuManagement/components";
import MenuEdit from "../components/shared/MenuList";
import ProductList from "../components/shared/ProductList";
import {
  OnboardingPage,
  FullScreenLoader,
  CatalogManager,
} from "../components";

export default function ProductSetupPage() {
  const { navigateBack, navigateToReview } = useOnboardingNavigation();
  const merchant = useSelector(
    (state) => state?.businessProfile?.profile?.merchant,
  );
  const merchantId = merchant?._id;
  const { categoryConfig, categoryName, categorySlug } = useCategory();

  const [loading, setLoading] = useState(false);
  const isGrocery = categorySlug === "grocery";
  const isPharmacy = categorySlug === "pharmacy";
  const isLiquor = categorySlug === "liquor";
  const {
    isOpen: openAddItem,
    open: openAddItemModal,
    close: closeAddItemModal,
  } = useModalWithData();
  const {
    isOpen: openEditItem,
    open: openEditItemModal,
    close: closeEditItemModal,
    data: editItemData,
    setData: setEditItemData,
  } = useModalWithData(null);

  const { data: categoryList = [] } = useGetCategoriesQuery();
  const businessCategoryId = useMemo(() => {
    const cat = categoryList.find(
      (c) => c.name === categoryName || c._id === merchant?.categoryId,
    );
    return cat?._id || merchant?.categoryId || null;
  }, [categoryList, categoryName, merchant?.categoryId]);

  const itemType = categorySlug || "restaurant";
  const { data: catalogList = [], isLoading: catalogListLoading } =
    useGetCatalogsByMerchantQuery(merchantId, {
      skip: !merchantId,
    });
  const { data: promotionalCatalogList = [] } =
    useGetPromotionalCatalogsByMerchantQuery(merchantId, { skip: !merchantId });
  const { data: menuQueryData, isLoading: menuLoading } = useGetItemsQuery(
    {
      categoryId: businessCategoryId,
      itemType,
      merchantId,
      catalogId: "",
      page: 1,
      limit: 100,
      searchName: "",
    },
    { skip: !merchantId || !businessCategoryId },
  );
  const menuData = menuQueryData?.list || [];
  const setMenuData = () => {};

  const [deleteItemMutation] = useDeleteItemMutation();
  const handleDelete = useCallback(
    async (item) => {
      try {
        setLoading(true);
        await deleteItemMutation({
          itemType,
          ids: [item?.id || item?._id],
        }).unwrap();
      } finally {
        setLoading(false);
      }
    },
    [deleteItemMutation, itemType],
  );

  const handleEditProduct = useCallback(
    (product) => {
      setEditItemData(product);
      openEditItemModal();
    },
    [openEditItemModal, setEditItemData],
  );

  const canProceed = menuData.length > 0;
  const handleProceed = () => {
    if (canProceed) navigateToReview();
  };

  const isRestaurant = categorySlug === "restaurant";

  return (
    <div className="relative">
      <OnboardingPage
        BackTo={() => navigateBack("menu-setup")}
        head={categoryConfig.menuSetupLabel}
        headClass="text-2xl sm:text-3xl lg:text-[40px]"
        subHead={categoryConfig.menuSetupDescription}
        step={3}
        nextbtn={false}
      >
        <BaseCard
          title={`Create ${categoryConfig.catalogLabel || "Menu Catalog"}`}
          titleClass="mb-2 text-[26px] font-semibold text-black"
          extraClassName="px-[14%]! gap-0!"
        >
          <CatalogManager
            type="standard"
            emptyMessage="No catalogs added yet."
            label={`Enter ${categoryConfig.catalogLabel || "Catalog"} name`}
            showProductType={isGrocery || isPharmacy || isLiquor}
            catalogOptionsLoading={catalogListLoading}
            extraPayload={(isGrocery || isPharmacy || isLiquor) ? {merchantId, categoryId: businessCategoryId } : {}}
            onCreated={() => {}}
          />
        </BaseCard>

        {(categorySlug === "pharmacy" || categorySlug === "liquor") && (
          <BaseCard
            title="Create Sub Catalogs"
            titleClass="mb-2 text-[26px] font-semibold text-black"
            extraClassName="px-[14%]! gap-0!"
          >
            <CatalogManager
              type="subcatalog"
              label="Enter Sub Catalog name"
              showCatalog
              catalogOptionsLoading={catalogListLoading}
              emptyMessage="No sub catalogs added yet for this catalog."
              catalogOptions={catalogList.map((cat) => ({
                name: cat?.catalogName,
                value: cat?._id,
              }))}
              extraPayload={{ merchantId }}
              onCreated={() => {}}
            />
          </BaseCard>
        )}

        <PromotionalCatalogForm merchantId={merchantId} navigateTo={() => {}} />
        <BaseCard
          title={isRestaurant ? "Menu Setup" : categoryConfig.menuSetupLabel}
          btnLabel={
            isRestaurant ? "Create Menu" : `Add ${categoryConfig.itemLabel}`
          }
          btnClass={
            isRestaurant ? "custom-btn w-[22%]! xl:w-[18%]!" : undefined
          }
          extraClassName="px-[14%]!"
          onClick={openAddItemModal}
          titleClass="text-2xl sm:text-3xl lg:text-[40px]"
        >
          <AutoSkeleton loading={menuLoading} config={{ animation: "shimmer" }}>
            <div className="flex flex-col items-center justify-center w-full">
              {isRestaurant ? (
                <MenuEdit
                  menuData={menuData}
                  onDelete={handleDelete}
                  catalogList={catalogList}
                  promotionalCatalogList={promotionalCatalogList}
                  setMenuData={setMenuData}
                />
              ) : (
                <ProductList
                  products={menuData}
                  onDelete={handleDelete}
                  onEdit={handleEditProduct}
                  catalogList={catalogList}
                  categorySlug={categorySlug}
                />
              )}
            </div>
          </AutoSkeleton>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8">
            <div />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <CustomButton
                variant="gray"
                fullWidth={false}
                label={
                  isRestaurant
                    ? "Add More Products"
                    : `Add More ${categoryConfig.itemsLabel}`
                }
                onClick={openAddItemModal}
                className="w-full border-neutral-600! sm:w-auto"
              />
              <CustomButton
                variant="primary"
                fullWidth={false}
                label="Proceed to Review"
                onClick={handleProceed}
                disabled={!canProceed}
                className="w-full sm:w-auto md:whitespace-nowrap!"
              />
            </div>
          </div>
        </BaseCard>
      </OnboardingPage>

      {isRestaurant ? (
        <RestaurantMenuForm
          visible={openAddItem}
          onHide={closeAddItemModal}
          catalogList={catalogList}
          promotionalCatalogList={promotionalCatalogList}
          setMenuData={setMenuData}
          mode="add"
        />
      ) : categorySlug === "pharmacy" ? (
        <>
          <PharmacyMenuForm
            visible={openAddItem}
            onHide={closeAddItemModal}
            catalogList={catalogList}
            setMenuData={setMenuData}
            mode="add"
          />
          <PharmacyMenuForm
            visible={openEditItem}
            onHide={() => {
              closeEditItemModal();
              setEditItemData(null);
            }}
            catalogList={catalogList}
            setMenuData={setMenuData}
            mode="edit"
            itemId={editItemData?._id}
          />
        </>
      ) : categorySlug === "liquor" ? (
        <>
          <LiquorMenuForm
            visible={openAddItem}
            onHide={closeAddItemModal}
            catalogList={catalogList}
            promotionalCatalogList={promotionalCatalogList}
            setMenuData={setMenuData}
            mode="add"
          />
          <LiquorMenuForm
            visible={openEditItem}
            onHide={() => {
              closeEditItemModal();
              setEditItemData(null);
            }}
            catalogList={catalogList}
            promotionalCatalogList={promotionalCatalogList}
            setMenuData={setMenuData}
            mode="edit"
            itemId={editItemData?._id}
          />
        </>
      ) : (
        <>
          <GroceryMenuForm
            visible={openAddItem}
            onHide={closeAddItemModal}
            catalogList={catalogList}
            promotionalCatalogList={promotionalCatalogList}
            setMenuData={setMenuData}
            mode="add"
          />
          <GroceryMenuForm
            visible={openEditItem}
            onHide={() => {
              closeEditItemModal();
              setEditItemData(null);
            }}
            catalogList={catalogList}
            promotionalCatalogList={promotionalCatalogList}
            setMenuData={setMenuData}
            mode="edit"
            itemId={editItemData?._id}
          />
        </>
      )}

      <FullScreenLoader loading={loading} />
    </div>
  );
}
