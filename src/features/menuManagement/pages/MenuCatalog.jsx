import { useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import BaseCard from "@/components/ui/Card/Card";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomButton from "@/components/ui/Button/Button";
import CustomInput from "@/components/forms/CustomInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import {
  CatalogCard,
  SortableCatalogCard,
  CatalogEmptyState,
} from "../components/menuCatalog";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useMenuCatalog } from "../hooks";

const CATALOG_PLACEHOLDER = {
  _id: "__skeleton__",
  catalogName: "Category Name",
};

export default function MenuCatalog() {
  const {
    list,
    loading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    categoryName,
    categoryNameError,
    isDeleteOpen,
    editId,
    showProductTypeDropdown,
    selectedProductTypeId,
    selectedProductTypeName,
    modalProductTypeId,
    productTypeOptions,
    productTypesLoading,
    productTypeError,
    handleProductTypeChange,
    handleModalProductTypeChange,
    handleClose,
    handleCreateCategory,
    startEdit,
    handleDeleteClick,
    deleteCatalog,
    setDeleteOpen,
    openAdd,
    handleCategoryNameChange,
    handleReorder,
  } = useMenuCatalog();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = list.findIndex((item) => item._id === active.id);
      const newIndex = list.findIndex((item) => item._id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(list, oldIndex, newIndex);
      handleReorder(reordered);
    },
    [list, handleReorder],
  );

  const itemIds = useMemo(() => list.map((item) => item._id), [list]);

  return (
    <>
      <BaseCard
        title="Menu Catalog"
        btnLabel="Add category"
        onClick={openAdd}
        extraClassName="p-6 border-none h-full"
      >
        <div className="mt-4">
          {showProductTypeDropdown && (
            <div className="w-full sm:max-w-sm mb-4">
              <CustomDropdown
                label="Product Type"
                options={productTypeOptions}
                value={selectedProductTypeId}
                onChange={(e) => handleProductTypeChange(e.value)}
                placeholder="Select Product Type"
                loading={productTypesLoading}
                appendTo={document.body}
              />
            </div>
          )}
          {!loading && list.length === 0 ? (
            <CatalogEmptyState
              onAdd={openAdd}
              title={
                selectedProductTypeName
                  ? `No categories in ${selectedProductTypeName}`
                  : "No categories yet"
              }
            />
          ) : (
            <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                  <AutoSkeleton.Repeat count={8}>
                    <CatalogCard
                      row={CATALOG_PLACEHOLDER}
                      gradientIndex={0}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </AutoSkeleton.Repeat>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={itemIds}
                      strategy={rectSortingStrategy}
                    >
                      {list.map((row, index) => (
                        <SortableCatalogCard
                          key={row._id}
                          row={row}
                          gradientIndex={index}
                          onEdit={startEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </AutoSkeleton>
          )}
        </div>
      </BaseCard>

      <DeleteConfirmationDialog
        visible={isDeleteOpen}
        setVisible={setDeleteOpen}
        onConfirm={() => deleteCatalog(editId)}
      />

      <BaseModal
        visible={open}
        onHide={handleClose}
        title={isEdit ? "Edit Category" : "Add Category"}
        width="28rem"
        footer={
          <div className="flex justify-end gap-3">
            <CustomButton
              variant="gray"
              label={"Cancel"}
              onClick={handleClose}
              disabled={isCreating || isUpdating}
              className="px-4 py-2!"
            />
            <CustomButton
              label={isEdit ? "Update" : "Add"}
              onClick={handleCreateCategory}
              loading={isCreating || isUpdating}
              className="px-4 py-2!"
            />
          </div>
        }
      >
        <div className="my-4 flex flex-col gap-4">
          {showProductTypeDropdown && (
            <CustomDropdown
              label="Product Type"
              options={productTypeOptions}
              value={modalProductTypeId}
              onChange={(e) => handleModalProductTypeChange(e.value)}
              placeholder="Select Product Type"
              loading={productTypesLoading}
              errorMessage={productTypeError}
              required
              appendTo={document.body}
            />
          )}
          <CustomInput
            name="catalogName"
            value={categoryName}
            label="Catalog Name"
            onChange={({ value }) => handleCategoryNameChange(value)}
            placeholder="Catalog name"
            errorMessage={categoryNameError}
            required
            // ignoreLabel
            // required={false}
            maxLength={30}
          />
        </div>
      </BaseModal>
    </>
  );
}
