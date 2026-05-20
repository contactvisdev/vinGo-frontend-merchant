import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Galleria } from "primereact/galleria";
import { toImageList } from "@/helpers/commonFunctions";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import MenuForm from "../components/forms/MenuForm";
import { useViewItem, useViewActions } from "../hooks";
import usePermission from "@/hooks/usePermission";

const ITEM_PLACEHOLDER = {
  _id: "__skeleton__",
  name: "Menu Item Name Placeholder",
  description:
    "A detailed description of this menu item placeholder text for skeleton loading state display",
  basePrice: "0.00",
  preparationTime: "00 min",
  availability: true,
  foodType: "Category",
  item_img: "",
  itemVariants: [
    {
      variantName: "test2 ",
      price: 30,
      _id: "69ce41caafe52e91586fab53",
    },
  ],
  addOns: [
    {
      addOnName: "test2",
      addOnPrice: 90,
      _id: "69ce41caafe52e91586fab52",
    },
  ],
  brand: "Brand",
  stockQuantity: 0,
  baseQuantity: { value: 0, unit: "g" },
  expiryDate: null,
};

const formatExpiryDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MenuItemDetails() {
  const view = useViewItem();
  const actions = useViewActions({
    item: view.item,
    deleteItem: view.deleteItem,
    fetchItem: view.fetchItem,
  });
  const navigate = useNavigate();

  const hasPermission = usePermission();
  const canEdit = hasPermission("menu", "canEdit");
  const canDelete = hasPermission("menu", "canDelete");

  const rawItem = view.loading ? ITEM_PLACEHOLDER : view.item;
  const imageList = useMemo(
    () => toImageList(rawItem?.item_img),
    [rawItem?.item_img],
  );
  const galleriaImages = useMemo(
    () =>
      imageList.map((url) => ({
        itemImageSrc: url,
        thumbnailImageSrc: url,
        alt: rawItem?.name,
      })),
    [imageList, rawItem?.name],
  );

  if (!view.loading && (view.error || !view.item)) {
    return (
      <div className="mx-auto">
        <BaseCard extraClassName="p-6!">
          <div className="text-center py-12">
            <p className="text-[#8C8C8C] text-lg">
              {view.error || "Item not found"}
            </p>
            <CustomButton
              label="Go Back"
              onClick={() => navigate(-1)}
              extraClassName="mt-4"
            />
          </div>
        </BaseCard>
      </div>
    );
  }

  const item = rawItem;
  const isLiquor = item.categoryName === "Liquor";
  const isProduct =
    item.categoryName === "Grocery" ||
    item.categoryName === "Pharmacy" ||
    isLiquor;

  let stockLabel = item.availability ? "In Stock" : "Out of Stock";
  let stockColor = item.availability ? "bg-green-600" : "bg-red-500";

  if (
    isProduct &&
    item.stockQuantity !== undefined &&
    item.stockQuantity !== null
  ) {
    if (item.stockQuantity <= 0) {
      stockLabel = "Out of Stock";
      stockColor = "bg-red-100 text-red-700";
    } else if (item.stockQuantity <= 15) {
      stockLabel = "Low Stock";
      stockColor = "bg-orange-100 text-orange-700";
    } else {
      stockLabel = "In Stock";
      stockColor = "bg-green-100 text-green-700";
    }
  }

  return (
    <>
      <AutoSkeleton loading={view.loading} config={{ animation: "shimmer" }}>
        <main className="flex-1 md:ml-0 p-4 md:p-8 bg-background">
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              {/* <nav className="flex text-xs text-on-surface-variant font-label mb-2 gap-2 text-neutral-800">
                <span>{item.categoryName || "Catalog"}</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span>{item.catalogName || "Category"}</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-primary font-semibold text-primary">Product Detail</span>
              </nav> */}
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                {item.name}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={actions.openDelete}
                disabled={!canDelete}
                className="px-6 py-2.5 rounded-md border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Delete Product
              </button>
              <button
                onClick={actions.openEdit}
                disabled={!canEdit}
                className="px-6 py-2.5 rounded-md bg-gradient-to-br bg-primary hover:bg-primary-600 text-white font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {/* <span className="material-symbols-outlined text-sm">edit</span> */}
                Edit Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-6">
              {/* Main Image Card */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group relative border border-gray-100 shadow-sm">
                <div className="absolute top-4 right-10 z-10">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${stockColor}`}
                  >
                    {stockLabel}
                  </span>
                </div>
                {galleriaImages.length > 1 ? (
                  <Galleria
                    value={galleriaImages}
                    numVisible={5}
                    circular
                    showItemNavigators={false}
                    showIndicators={false}
                    style={{ maxWidth: "100%" }}
                    item={(img) => (
                      <img
                        src={img.itemImageSrc}
                        alt={img.alt}
                        style={{ width: "100%", display: "block" }}
                        className="aspect-[361/288] object-contain"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-food.svg";
                        }}
                      />
                    )}
                    thumbnail={(img) => (
                      <img
                        src={img.thumbnailImageSrc}
                        alt={img.alt}
                        style={{
                          display: "block",
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/placeholder-food.svg";
                        }}
                      />
                    )}
                  />
                ) : (
                  <img
                    src={imageList[0] || "/images/placeholder-food.svg"}
                    alt={item.name}
                    className="w-full aspect-[361/288] object-contain"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-food.svg";
                    }}
                  />
                )}
              </div>

              {/* General Info Card */}
              <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl">
                <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-4 font-label">
                  Product Intelligence
                </h3>
                <div className="space-y-6">
                  {/* <div>
                    <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                      Item ID
                    </label>
                    <p className="text-neutral-900 font-medium text-sm mt-1">{item._id?.slice(-10)}</p>
                  </div> */}
                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-neutral-900 text-sm leading-relaxed mt-1">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-primary uppercase tracking-wide">
                        Category
                      </label>
                      <p className="text-neutral-900 text-sm font-medium mt-1">
                        {item.categoryName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-primary uppercase tracking-wide">
                        Catalog
                      </label>
                      <p className="text-neutral-900 text-sm font-medium mt-1">
                        {item.catalogName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100  shadow-sm p-5 rounded-xl flex flex-col justify-between h-30">
                  <p className="text-xs font-bold text-primary uppercase">
                    Base Price
                  </p>
                  <div>
                    <p className="text-3xl font-extrabold text-neutral-900 font-headline tracking-tight">
                      ${item.basePrice || "0.00"}
                    </p>
                  </div>
                </div>

                {isProduct ? (
                  <>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex flex-col justify-between h-30">
                      <p className="text-xs font-bold text-primary uppercase">
                        Current Stock
                      </p>
                      <div>
                        <p className="text-3xl font-extrabold text-neutral-900 font-headline tracking-tight">
                          {item.stockQuantity ?? 0}{" "}
                          <span className="text-sm font-medium text-neutral-800">
                            units
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex flex-col justify-between h-30">
                      <p className="text-xs font-bold text-primary uppercase">
                        Base Quantity
                      </p>
                      <div>
                        <p className="text-3xl font-extrabold text-neutral-900 font-headline tracking-tight">
                          {item.baseQuantity?.value || 0}{" "}
                          <span className="text-sm font-medium text-neutral-800">
                            {item.baseQuantity?.unit || "units"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex flex-col justify-between h-30">
                      <p className="text-xs font-bold text-primary uppercase">
                        Prep Time
                      </p>
                      <div>
                        <p className="text-3xl font-extrabold text-neutral-900 font-headline tracking-tight">
                          {item.preparationTime || 0}{" "}
                          <span className="text-sm font-medium text-neutral-800">
                            min
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex flex-col justify-between h-30">
                      <p className="text-xs font-bold text-primary uppercase">
                        Rating
                      </p>
                      <div>
                        <p className="text-3xl font-extrabold text-neutral-900 font-headline tracking-tight">
                          {item.rating || "N/A"}{" "}
                          <span className="text-sm font-medium text-neutral-800">
                            / 5
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl">
                  <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6 font-label">
                    {isProduct ? "Product Attributes" : "Dish Specifications"}
                  </h3>
                  <div className="space-y-2">
                    {isLiquor ? (
                      <>
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Alcohol Percentage
                            </label>
                            <p className="text-lg font-bold text-neutral-900 mt-1">
                              {item.alcoholPercentage != null
                                ? `${item.alcoholPercentage}%`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Age Restriction
                            </label>
                            <p className="text-lg font-bold text-neutral-900 mt-1">
                              {item.ageRestriction != null
                                ? `${item.ageRestriction}+`
                                : "N/A"}
                            </p>
                          </div>
                        </div> */}
                        <div className="flex justify-between items-end">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Product Type
                            </label>
                            <p className="text-sm font-bold text-gray-600 mt-1">
                              {item.productTypeName || "N/A"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : isProduct ? (
                      <>
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Brand
                            </label>
                            <p className="text-lg font-bold text-neutral-900 mt-1">
                              {item.brand || "Generic"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Product Type
                            </label>
                            <p className="text-sm font-bold text-gray-600 mt-1">
                              {item.productTypeName || "N/A"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                          <div>
                            <label className="text-xs font-bold text-neutral-600 uppercase">
                              Food Type
                            </label>
                            <p className="text-lg font-bold text-neutral-800 mt-1">
                              {item.foodType || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <label className="text-xs font-bold text-neutral-600 uppercase">
                            Dish Type
                          </label>
                          <p className="text-sm font-bold text-neutral-800 mt-1">
                            {item.dishType || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl">
                  <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6 font-label">
                    Additional Details
                  </h3>
                  <div className="space-y-6">
                    {isProduct ? (
                      <div>
                        <label className="text-xs font-bold text-neutral-600 uppercase">
                          Expiry Date
                        </label>
                        <p className="text-sm font-medium mt-1 text-neutral-900">
                          {formatExpiryDate(item.expiryDate)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs font-bold text-neutral-600 uppercase">
                          Variants & Addons
                        </label>
                        <p className="text-sm font-medium mt-1 text-neutral-800">
                          {item.itemVariants?.length || 0} Variants,{" "}
                          {item.addOns?.length || 0} Addons
                        </p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-xs text-neutral-600 font-bold">
                          Status
                        </span>
                        <span className="text-xs font-bold text-primary uppercase">
                          {item.isDeleted ? "Deleted" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isProduct &&
                (item.itemVariants?.length > 0 || item.addOns?.length > 0) && (
                  <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl">
                    <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6 font-label">
                      Menu Configuration
                    </h3>

                    {item.itemVariants?.length > 0 && (
                      <div className="mb-6">
                        <label className="text-xs font-bold text-neutral-600 uppercase block mb-3">
                          Variants
                        </label>
                        <div className="space-y-2">
                          {item.itemVariants.map((variant, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-100"
                            >
                              <span className="text-gray-700 text-sm font-medium">
                                {variant.variantName || variant.type}
                              </span>
                              <span className="text-neutral-900 text-sm font-semibold">
                                +$
                                {variant.price ||
                                  variant.additionalPrice ||
                                  "0.00"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.addOns?.length > 0 && (
                      <div>
                        <label className="text-xs font-bold text-neutral-600 uppercase block mb-3">
                          Add-ons
                        </label>{" "}
                        <div className="space-y-2">
                          {item.addOns.map((addon, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-100"
                            >
                              <span className="text-gray-700 text-sm font-medium">
                                {addon.addOnName}
                              </span>
                              <span className="text-neutral-900 text-sm font-semibold">
                                +${addon.addOnPrice || "0.00"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="h-24"></div>
        </main>
      </AutoSkeleton>

      {!view.loading && actions.showForm && (
        <MenuForm
          visible
          mode="edit"
          itemId={item._id}
          catalogList={view.catalogs}
          promotionalCatalogList={view.promotionalCatalogs}
          onHide={actions.closeForm}
          setMenuData={actions.reloadItem}
        />
      )}

      {!view.loading && (
        <DeleteConfirmationDialog
          visible={actions.showDelete}
          setVisible={actions.closeDelete}
          onConfirm={actions.confirmDelete}
        />
      )}
    </>
  );
}
