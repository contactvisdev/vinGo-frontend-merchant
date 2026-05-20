import BaseCard from "@/components/ui/Card/Card";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomButton from "@/components/ui/Button/Button";
import CustomInput from "@/components/forms/CustomInput";
import { ProductTypeCard, ProductTypeEmptyState } from "../components/productType";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useProductType } from "../hooks";

const PRODUCT_TYPE_PLACEHOLDER = {
  _id: "__skeleton__",
  name: "Product Type",
  categoryId: { name: "Category" },
  isActive: true,
};

export default function ProductType() {
  const {
    list,
    loading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    typeName,
    typeNameError,
    isDeleteOpen,
    editId,
    handleClose,
    handleSubmit,
    startEdit,
    handleDeleteClick,
    deleteProductType,
    setDeleteOpen,
    openAdd,
    handleTypeNameChange,
    handleToggleActive,
  } = useProductType();

  return (
    <>
      <BaseCard
        title="Product Types"
        btnLabel="Add product type"
        onClick={openAdd}
        extraClassName="p-6 border-none"
      >
        <div className="mt-4">
          {!loading && list.length === 0 ? (
            <ProductTypeEmptyState onAdd={openAdd} />
          ) : (
            <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                  <AutoSkeleton.Repeat count={8}>
                    <ProductTypeCard
                      row={PRODUCT_TYPE_PLACEHOLDER}
                      gradientIndex={0}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onToggleActive={() => {}}
                    />
                  </AutoSkeleton.Repeat>
                ) : (
                  list.map((row, index) => (
                    <ProductTypeCard
                      key={row._id}
                      row={row}
                      gradientIndex={index}
                      onEdit={startEdit}
                      onDelete={handleDeleteClick}
                      onToggleActive={handleToggleActive}
                    />
                  ))
                )}
              </div>
            </AutoSkeleton>
          )}
        </div>
      </BaseCard>

      <DeleteConfirmationDialog
        visible={isDeleteOpen}
        setVisible={setDeleteOpen}
        onConfirm={() => deleteProductType(editId)}
      />

      <BaseModal
        visible={open}
        onHide={handleClose}
        title={isEdit ? "Edit Product Type" : "Add Product Type"}
        width="28rem"
        footer={
          <div className="flex justify-end gap-3">
            <CustomButton
              variant="gray"
              label="Cancel"
              onClick={handleClose}
              disabled={loading || isCreating || isUpdating}
              className="px-4 py-2!"
            />
            <CustomButton
              label={isEdit ? "Update" : "Add"}
              onClick={handleSubmit}
              loading={isCreating || isUpdating}
              className="px-4 py-2!"
            />
          </div>
        }
      >
        <div className="my-4">
          <CustomInput
            name="productTypeName"
            value={typeName}
            label="Product Type Name"
            onChange={({ value }) => handleTypeNameChange(value)}
            placeholder="Product type name"
            errorMessage={typeNameError}
            ignoreLabel
            required={false}
            maxLength={30}
          />
        </div>
      </BaseModal>
    </>
  );
}
