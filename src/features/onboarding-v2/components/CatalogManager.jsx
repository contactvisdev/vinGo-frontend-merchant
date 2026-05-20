import { useState, useMemo } from "react";
import CustomInput from "@/components/forms/CustomInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import CustomButton from "@/components/ui/Button/Button";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useGetProductTypesQuery } from "@/store/api/productTypeApi";
import { useCatalogCRUD } from "../hooks";

export default function CatalogManager({
  type = "standard",
  title,
  label = "Enter Catalog name",
  extraPayload = {},
  showProductType = false,
  showCatalog = false,
  catalogOptions = [],
  catalogOptionsLoading = false,
  emptyMessage = "No items added yet.",
  onCreated,
  children,
}) {
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const {
    catalogs,
    catalogsLoading,
    catalogsFetching,
    loading,
    formData,
    handleFormChange,
    editingId,
    editValue,
    setEditValue,
    startEditing,
    createCatalog,
    saveEdit,
    deleteCatalog,
    nameField,
  } = useCatalogCRUD({
    type,
    queryArg:
      type === "subcatalog"
        ? selectedCatalogId
        : extraPayload?.catalogId ?? null,
  });
  const { data: productTypes = [], isLoading: productTypesLoading } =
    useGetProductTypesQuery(
    { categoryId: extraPayload?.categoryId },
    { skip: !showProductType || !extraPayload?.categoryId },
    );
  const productTypeOptions = useMemo(
    () => productTypes.map((pt) => ({ name: pt?.name, value: pt?._id })),
    [productTypes],
  );

  const handleInputChange = ({ name, value }) => {
    if (editingId) {
      setEditValue((prev) => ({ ...prev, [name]: value }));
    } else {
      handleFormChange({ name, value });
    }
  };

  const handleAdd = async () => {
    const mergedPayload = {
      ...extraPayload,
      ...(showProductType ? { productTypeId: selectedProductTypeId } : {}),
      ...(showCatalog ? { catalogId: selectedCatalogId } : {}),
    };
    const result = await createCatalog(mergedPayload);
    if (result) onCreated?.();
  };

  const handleSave = async (id) => {
    const mergedPayload = {
      ...extraPayload,
      ...(showProductType
        ? {
            productTypeId:
              editValue?.productTypeId?._id || editValue?.productTypeId,
          }
        : {}),
      ...(showCatalog
        ? {
            catalogId: editValue?.catalogId?._id || editValue?.catalogId,
          }
        : {}),
    };
    await saveEdit(id, mergedPayload);
  };

  const isDisabled =
    (editingId && !editValue?.[nameField]?.trim()) ||
    (!editingId && !formData[nameField]?.trim()) ||
    (showProductType && !editingId && !selectedProductTypeId) ||
    (showCatalog && !editingId && !selectedCatalogId);

  return (
    <div>
      {showCatalog && (
        <div className="mb-3">
          <CustomDropdown
            label="Catalog"
            name="catalogId"
            options={catalogOptions}
            loading={catalogOptionsLoading}
            value={
              editingId
                ? editValue?.catalogId?._id || editValue?.catalogId
                : selectedCatalogId
            }
            onChange={(e) => {
              if (editingId) {
                setEditValue((prev) => ({ ...prev, catalogId: e.value }));
              }
              setSelectedCatalogId(e.value);
            }}
            placeholder="Select Catalog"
          />
        </div>
      )}
      {showProductType && (
        <div className="mb-3">
          <CustomDropdown
            label="Product Type"
            name="productTypeId"
            options={productTypeOptions}
            loading={productTypesLoading}
            value={
              editingId
                ? editValue?.productTypeId?._id || editValue?.productTypeId
                : selectedProductTypeId
            }
            onChange={(e) => {
              if (editingId) {
                setEditValue((prev) => ({ ...prev, productTypeId: e.value }));
              }
              setSelectedProductTypeId(e.value);
            }}
            placeholder="Select Product Type"
          />
        </div>
      )}

      <div className="w-full sm:flex-1">
        <div className="flex items-end gap-3">
          <CustomInput
            label={label}
            name={nameField}
            value={editingId ? editValue?.[nameField] : formData[nameField]}
            onChange={handleInputChange}
            ignoreError
          />
          <CustomButton
            variant="primary"
            label={editingId ? "Update" : "Add"}
            onClick={editingId ? () => handleSave(editingId) : handleAdd}
            className="w-[23%]!"
            disabled={isDisabled}
            loading={loading}
          />
        </div>
        <small
          className={`text-primary block text-sm mt-1 min-h-5 ${formData?.formErrors?.[nameField] ? "visible" : "invisible"}`}
        >
          {formData?.formErrors?.[nameField] || "\u00A0"}
        </small>
      </div>

      {children}

      {(!showCatalog || selectedCatalogId || editingId) && (
        <AutoSkeleton
          loading={catalogsLoading || catalogsFetching}
          config={{ animation: "shimmer" }}
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {catalogsLoading || catalogsFetching ? (
              <AutoSkeleton.Repeat count={3}>
                <div className="flex items-center gap-2 sm:gap-3 border px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm">
                  <span>Catalog Name</span>
                  <i className="pi pi-pencil text-black cursor-pointer text-sm sm:text-base" />
                  <i className="pi pi-trash text-red-600 cursor-pointer text-sm sm:text-base" />
                </div>
              </AutoSkeleton.Repeat>
            ) : catalogs?.length ? (
              catalogs?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-2 sm:gap-3 border px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm"
                >
                  <span>{item?.[nameField]}</span>
                  <i
                    className="pi pi-pencil text-black cursor-pointer text-sm sm:text-base"
                    onClick={() => startEditing(item)}
                  />
                  <i
                    className="pi pi-trash text-red-600 cursor-pointer text-sm sm:text-base"
                    onClick={() => deleteCatalog(item._id)}
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">
                {emptyMessage}
              </p>
            )}
          </div>
        </AutoSkeleton>
      )}
    </div>
  );
}
