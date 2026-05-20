import { useState } from "react";
import CustomButton from "@/components/ui/Button/Button";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import SkeletonImage from "@/components/ui/SkeletonImage";
import { toImageList } from "@/helpers/commonFunctions";

export default function ProductList({
  products,
  onDelete,
  onEdit,
  catalogList,
  setProductData,
  categorySlug,
}) {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    item: null,
  });

  const handleDeleteClick = (item) => {
    setDeleteModal({ open: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.item) {
      onDelete(deleteModal?.item);
      setDeleteModal({ open: false, item: null });
    }
  };

  const getCatalogName = (catalogId) => {
    const catalog = catalogList?.find((cat) => cat._id === catalogId);
    return catalog?.catalogName || "Unknown";
  };

  if (!products?.length) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 text-lg">No products added yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "Add Product" to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        {products.map((product, index) => (
          <div
            key={product._id || index}
            className="w-full flex items-center justify-between gap-4 rounded-xl p-4 border border-neutral-400"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Product Image */}
              <div className="border border-neutral-400 rounded-lg p-2 h-24 w-24 flex items-center justify-center bg-gray-100 flex-shrink-0">
                {(() => {
                  const firstImg = toImageList(product.item_img)[0];
                  return firstImg ? (
                    <SkeletonImage
                      src={firstImg}
                      alt={product.name}
                      className="object-contain rounded"
                      skeletonClassName="rounded"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">
                      No Image
                    </div>
                  );
                })()}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">{product.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {getCatalogName(product.catalogId)}
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600 break-all">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-xl font-semibold text-primary">
                    ${product.basePrice}
                  </span>
                  {product.availability ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      In Stock
                      {product.stockQuantity != null &&
                        ` (${product.stockQuantity})`}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <i
                className="pi pi-pencil text-blue-600 cursor-pointer text-lg hover:text-blue-800"
                onClick={() => onEdit?.(product)}
                title="Edit"
              />
              <i
                className="pi pi-trash text-red-600 cursor-pointer text-lg hover:text-red-800"
                onClick={() => handleDeleteClick(product)}
                title="Delete"
              />
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationDialog
        visible={deleteModal.open}
        setVisible={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
