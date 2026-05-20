import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { toImageList } from "@/helpers/commonFunctions";
import { useTapDetection } from "@/hooks/ui/useTapDetection";

function formatExpiryDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LiquorItemCard({
  item,
  selectedItems,
  handleToggleSelect,
  handleToggleAvailability,
  handleEdit,
  handleDelete,
  canEdit = true,
  canDelete = true,
}) {
  const navigate = useNavigate();
  const images = toImageList(item.item_img);
  const hasMultiple = images.length > 1;
  const goToDetail = () => navigate(`/menu-item/${item._id}`);
  const tapHandlers = useTapDetection(goToDetail);
  const descriptionText = item.description || "";
  const variantsCount = item.itemVariants?.length || 0;
  const addOnsCount = item.addOns?.length || item.addons?.length || 0;
  const expiryFormatted = formatExpiryDate(item.expiryDate);
  const alcoholPercentage =
    item.alcoholPercentage != null && item.alcoholPercentage !== ""
      ? `${item.alcoholPercentage}%`
      : null;
  const ageRestriction =
    item.ageRestriction != null && item.ageRestriction !== ""
      ? `${item.ageRestriction}+`
      : null;

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md border border-gray-100 group transition-all duration-500 hover:-translate-y-1 border-gray-200
      hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Image Area */}
      <div
        className={`relative aspect-[4/3] bg-gray-100 overflow-hidden shrink-0 ${hasMultiple ? "" : "cursor-pointer"}`}
        onClick={hasMultiple ? undefined : goToDetail}
      >
        {hasMultiple ? (
          <Carousel
            value={images}
            numVisible={1}
            numScroll={1}
            circular
            autoplayInterval={3000}
            showIndicators={false}
            showNavigators={false}
            className="absolute inset-0 w-full h-full"
            itemTemplate={(url) => (
              <div
                className="w-full aspect-[4/3] cursor-pointer"
                {...tapHandlers}
              >
                <SkeletonImage
                  src={url}
                  alt={item.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            )}
          />
        ) : (
          <SkeletonImage
            src={images[0]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={item.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder-food.svg";
            }}
          />
        )}

        {/* Tags Overlay */}
        <div className="absolute top-4 left-4 flex flex-row items-center gap-2 pointer-events-none">
          {ageRestriction && (
            <div className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-black/5 shadow-sm">
              {ageRestriction}
            </div>
          )}
          {alcoholPercentage && (
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-black/5 shadow-sm">
              ABV {alcoholPercentage}
            </div>
          )}
        </div>

        {/* Checkbox Overlay */}
        {canDelete && (
          <div
            className="absolute top-4 right-4 rounded-lg p-1 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomCheckbox
              standalone
              value={selectedItems.includes(item.id)}
              onChange={() => handleToggleSelect(item.id)}
              disabled={!canDelete}
            />
          </div>
        )}

        {/* Rating Overlay */}
        {item.rating != null && (
          <div className="absolute bottom-4 right-4 bg-white/90 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-black/5 pointer-events-none shadow-sm">
            <i className="pi pi-star-fill text-yellow-500 text-[12px]"></i>
            <span className="text-[11px] font-bold text-gray-800">
              {item.rating}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div
          className="flex flex-col gap-1.5 mb-3 cursor-pointer"
          onClick={() => navigate(`/menu-item/${item._id}`)}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            {item.catalogName || "UNCLASSIFIED"}
            {item.productTypeName ? ` · ${item.productTypeName}` : ""}
          </span>
          <h2 className="text-lg font-bold leading-tight text-gray-900">
            {item.name}
          </h2>
          {item.brand && (
            <span className="text-[11px] font-semibold text-gray-500">
              by {item.brand}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <span className="text-xl font-extrabold text-primary tracking-tight">
            ${item.basePrice}
          </span>
          {item.baseQuantity?.value && (
            <>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-[11px] text-gray-700 font-bold">
                {item.baseQuantity.value}
                {item.baseQuantity.unit || ""}
              </span>
            </>
          )}
          {alcoholPercentage && (
            <>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                ABV {alcoholPercentage}
              </span>
            </>
          )}
        </div>

        {descriptionText && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {descriptionText}
          </p>
        )}

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Alcohol
            </p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {alcoholPercentage || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Stock
            </p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {item.stockQuantity ?? 0}
              <span className="text-[10px] text-gray-500 font-medium"> units</span>
            </p>
          </div>
        </div>

        {/* Variants & Addons Count */}
        {(variantsCount > 0 || addOnsCount > 0) && (
          <div className="flex items-center gap-2 mb-4">
            {variantsCount > 0 && (
              <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-medium border border-gray-100 shadow-sm transition-all hover:bg-gray-100">
                {variantsCount} {variantsCount === 1 ? "Variant" : "Variants"}
              </span>
            )}
            {addOnsCount > 0 && (
              <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-medium border border-gray-100 shadow-sm transition-all hover:bg-gray-100">
                {addOnsCount} {addOnsCount === 1 ? "Add-on" : "Add-ons"}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <div className="bg-gray-50 p-2 mb-2 sm:p-2.5 rounded-xl border border-gray-100 flex justify-between min-w-0">
            <div className="flex items-center gap-1 mb-0.5 min-w-0 text-gray-400">
              <i className="pi pi-calendar text-[10px] shrink-0"></i>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider truncate">
                Expires
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
              {expiryFormatted || "N/A"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 sm:gap-3">
            <button
              onClick={() => handleEdit(item)}
              disabled={!canEdit}
              className="flex-[2] bg-primary hover:opacity-90 text-white font-bold py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs tracking-widest uppercase shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              <i className="pi pi-pencil text-[12px]"></i>
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              disabled={!canDelete}
              className="flex-1 border border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-500 hover:text-red-500 font-bold py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-transparent cursor-pointer"
            >
              <i className="pi pi-trash text-[14px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
