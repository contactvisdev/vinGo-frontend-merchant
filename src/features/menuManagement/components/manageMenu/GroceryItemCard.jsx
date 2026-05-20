import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import CustomButton from "@/components/ui/Button/Button";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { toImageList } from "@/helpers/commonFunctions";
import { useTapDetection } from "@/hooks/ui/useTapDetection";

function getDisplayPrice(item) {
  const variants = item.itemVariants || [];
  if (variants.length > 0) {
    const minPrice = Math.min(...variants.map((v) => v.price));
    return { label: `Starts from $${minPrice}`, hasVariants: true };
  }
  return { label: `$${item.basePrice}`, hasVariants: false };
}

function formatExpiryDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GroceryItemCard({
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
  const priceInfo = getDisplayPrice(item);
  const expiryFormatted = formatExpiryDate(item.expiryDate);
  const isInStock = item.stockQuantity > 0;
  const isLowStock = item.stockQuantity > 0 && item.stockQuantity < 15;
  let mainName = item.name;
  let subName = "";
  if (item.name && item.name.includes("(")) {
    const parts = item.name.split("(");
    mainName = parts[0].trim();
    subName = "(" + parts.slice(1).join("(").trim();
  }

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md border border-gray-100 group transition-all duration-500 hover:-translate-y-1 border border-gray-200
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
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {priceInfo.hasVariants && (
            <div className="bg-white/90 backdrop-blur-sm text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm border border-black/5">
              Multiple Variants
            </div>
          )}
          {isLowStock ? (
            <div className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm border border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Low Stock: {item.stockQuantity}
            </div>
          ) : (
            <div
              className={`bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm border border-black/5 ${isInStock ? "text-green-600" : "text-red-500"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${isInStock ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              {isInStock ? `${item.stockQuantity} In Stock` : "Out of Stock"}
            </div>
          )}
        </div>

        {/* Checkbox Overlay */}
        {canDelete && (
          <div
            className="absolute top-4 right-4 rounded-lg p-1"
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
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-black/5 pointer-events-none shadow-sm">
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
            {item.brand || "UNBRANDED"}
          </span>
          <h2 className="text-lg font-bold leading-tight text-gray-900">
            {mainName}
            {subName && (
              <span className="text-gray-500 font-medium block text-sm mt-0.5">
                {subName}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl font-extrabold text-primary tracking-tight">
            {priceInfo.label}
          </span>
          {item.baseQuantity?.unit && (
            <>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                Per {item.baseQuantity.unit}
              </span>
            </>
          )}
        </div>

        {item.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto">
          {/* Modern Metadata Layout */}
          <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-5 overflow-hidden">
            <div className="bg-gray-50 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex  justify-between min-w-0">
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

            {/* <div className="bg-gray-50 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-center min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="flex items-center gap-1 min-w-0 text-gray-400">
                  <i className="pi pi-box text-[10px] shrink-0"></i>
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider truncate">
                    Status
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!canEdit}
                  className={`relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors border-none cursor-pointer p-0
                    ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}
                    ${item.availability ? "bg-primary" : "bg-gray-300"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canEdit && handleToggleAvailability)
                      handleToggleAvailability(item.id);
                  }}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform
                      ${item.availability ? "translate-x-[12px]" : "translate-x-[2px]"}`}
                  />
                </button>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.availability ? "Available" : "Unavailable"}
              </span>
            </div> */}
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
