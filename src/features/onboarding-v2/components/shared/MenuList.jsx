import { useState } from "react";
import { useModalWithData } from "@hooks/ui/useModal";
import DownArrow from "@/assets/images/icons/down-arrow.png";
import EditIcon from "@/assets/images/icons/edit.png";
import deleteIcon from "@/assets/images/icons/delete.png";
import food from "@/assets/images/food.webp";
import RestaurantMenuForm from "@features/menuManagement/components/forms/RestaurantMenuForm";
import SkeletonImage from "@/components/ui/SkeletonImage";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";

// -----------------------------------------
// REUSABLE MENU ITEM CARD (main items & addons)
// -----------------------------------------
const MenuItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 rounded-xl p-4 border border-neutral-400 mt-2">
      <div className="border border-neutral-400 rounded-lg p-2 h-32 w-32 flex items-center justify-center bg-gray-100">
        <SkeletonImage
          src={item.image}
          alt="Food item"
          className="h-28 w-28 object-contain rounded"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium truncate">{item.name}</span>

          {/* Food type badge */}
          <span className="text-sm bg-success-50 text-success px-3 py-1 rounded-full whitespace-nowrap">
            {item.foodType}
          </span>
        </div>
        <p className="text-lg text-neutral-600 break-words whitespace-pre-line">
          {item.description?.length > 150
            ? `${item.description.slice(0, 100)}...`
            : item.description}
        </p>

        <span className="text-[24px] font-semibold text-primary">
          ${item.price}
        </span>
      </div>

      <div className="flex gap-3 text-gray-600 mr-4">
        <SkeletonImage
          src={EditIcon}
          className="h-[21px] cursor-pointer"
          onClick={() => onEdit(item)}
        />
        <SkeletonImage
          src={deleteIcon}
          className="h-[21px] cursor-pointer"
          onClick={() => onDelete(item)}
        />
      </div>
    </div>
  );
};

// -----------------------------------------
// VARIANTS SECTION (collapsible list)
// -----------------------------------------
const VariantsSection = ({ variants }) => {
  const [open, setOpen] = useState(false);

  if (!variants || variants.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-neutral-400">
      <div
        className="flex items-center justify-between mr-10 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[22px] font-semibold">Variants</span>
        <SkeletonImage
          src={DownArrow}
          className={`h-[7px] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="flex flex-col gap-5 my-5">
          {variants.map((variant, idx) => (
            <div key={idx} className="flex text-[22px] text-neutral-700">
              <p className="w-1/2">{variant.name}</p>
              <span className="w-1/2">${variant.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------
// ADDONS SECTION (same style as Variants)
// -----------------------------------------
const AddonsSection = ({ addons }) => {
  const [open, setOpen] = useState(false);

  if (!addons || addons.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-neutral-400">
      {/* Header */}
      <div
        className="flex items-center justify-between mr-10 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[22px] font-semibold">Add-ons</span>
        <SkeletonImage
          src={DownArrow}
          className={`h-[7px] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="flex flex-col gap-5 my-5">
          {addons.map((addon, idx) => (
            <div key={idx} className="flex text-[22px] text-neutral-700">
              <p className="w-1/2">{addon.name}</p>
              <span className="w-1/2">${addon.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------
// CATEGORY SECTION
// -----------------------------------------
const CategorySection = ({ category, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      <span className="text-[22px] font-semibold">{category.name}</span>

      {category.items.map((item, idx) => (
        <div key={idx}>
          <MenuItemCard item={item} onEdit={onEdit} onDelete={onDelete} />

          <VariantsSection variants={item.variants} />

          <AddonsSection
            addons={item.addons}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------
// MAIN COMPONENT
// -----------------------------------------
export default function MenuEdit({
  menuData,
  onEdit,
  onDelete,
  catalogList,
  promotionalCatalogList,
  setMenuData,
}) {
  const {
    isOpen: openEditItem,
    open: openEditModal,
    close: closeEditModal,
    data: selectedItem,
  } = useModalWithData();

  // FORMAT DATA FOR UI
  const transformMenuData = (raw = []) => {
    const categoryMap = {};

    raw.forEach((item) => {
      const category = item.catalogName || "Uncategorized";

      if (!categoryMap[category]) {
        categoryMap[category] = { name: category, items: [] };
      }

      categoryMap[category].items.push({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.basePrice,
        image: item.item_img,
        foodType: item?.foodType,
        variants: (item.itemVariants || []).map((v) => ({
          name: v.variantName,
          price: v.price,
        })),

        addons: (item.addOns || []).map((a) => ({
          id: a._id,
          name: a.addOnName,
          price: a.addOnPrice,
        })),
      });
    });

    return Object.values(categoryMap);
  };

  const data = menuData?.length ? transformMenuData(menuData) : [];

  // edit/delete handlers
  const handleEditClick = (item) => {
    openEditModal(item);
    onEdit?.(item);
  };

  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const handleDeleteClick = (item) => {
    setDeleteModal({ open: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.item) {
      onDelete?.(deleteModal.item);
      setDeleteModal({ open: false, item: null });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-6 mt-10">
        {data.map((category, idx) => (
          <CategorySection
            key={idx}
            category={category}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {data.length === 0 && (
        <div className="flex flex-col items-center">
          <SkeletonImage src={food} className="h-[129px] w-[220px] mb-4" />

          <p className="text-center text-primary font-semibold mb-2 text-[26px]">
            No Food Items Yet
          </p>

          <p className="text-center text-base text-gray-600">
            Start by adding your first dish to make your menu deliciously
            complete.
          </p>
        </div>
      )}

      {openEditItem && selectedItem && (
        <RestaurantMenuForm
          visible={openEditItem}
          onHide={closeEditModal}
          catalogList={catalogList}
          promotionalCatalogList={promotionalCatalogList}
          itemId={selectedItem.id}
          setMenuData={setMenuData}
          mode="edit"
        />
      )}

      <DeleteConfirmationDialog
        visible={deleteModal.open}
        setVisible={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
