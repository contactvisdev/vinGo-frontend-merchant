import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import CustomButton from "@/components/ui/Button/Button";
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

export default function PharmacyItemCard({
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

  const isVeg = item.dishType === "veg" || item.dishType === "vegan";

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
          {item.foodType && (
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-black/5 shadow-sm">
              {item.foodType}
            </div>
          )}
          {item.dishType && (
            <div
              className={`flex items-center justify-center bg-white w-4.5 h-4.5 border ${isVeg ? "border-green-600" : "border-red-600"}`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`}
              ></span>
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
          className="flex flex-col gap-1.5 mb-4 cursor-pointer"
          onClick={() => navigate(`/menu-item/${item._id}`)}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            {item.catalogName || "UNCLASSIFIED"}
          </span>
          <h2 className="text-lg font-bold leading-tight text-gray-900">
            {item.name}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl font-extrabold text-primary tracking-tight">
            ${item.basePrice}
          </span>
          <span className="h-4 w-px bg-gray-300"></span>
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
            Base Price
          </span>
        </div>

        {descriptionText && (
          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
            {descriptionText}
          </p>
        )}

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
           <div className="bg-gray-50 p-2 mb-2 sm:p-2.5 rounded-xl border border-gray-100 flex  justify-between min-w-0">
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
          {/* Status Layout - Grid Col 1 for full width */}
          {/* <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-5 overflow-hidden">
            <div className="bg-gray-50 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-gray-100 shadow-sm">
                  <i className="pi pi-box text-[12px] text-gray-400"></i>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                    {item.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors border-none cursor-pointer p-0 mr-1
                    ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}
                    ${item.availability ? "bg-primary" : "bg-gray-300"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canEdit && handleToggleAvailability)
                    handleToggleAvailability(item.id);
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                      ${item.availability ? "translate-x-[14px]" : "translate-x-[2px]"}`}
                />
              </button>
            </div>
          </div> */}

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
