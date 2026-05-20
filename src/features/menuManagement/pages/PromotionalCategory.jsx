import BaseCard from "@/components/ui/Card/Card";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomButton from "@/components/ui/Button/Button";
import {
  PromoCard,
  PromoCategoryEmptyState,
  PromotionalCatalogFormFields,
} from "../components/promotionalCategory";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { usePromotionalCategory } from "../hooks";

const PROMO_PLACEHOLDER = {
  _id: "__skeleton__",
  title: "Promotional Title",
  description: "A description of the promotional category placeholder text",
  DiscountPercentage: 0,
  promo_image: "placeholder",
  status: "active",
  expiresOn: null,
};

export default function PromotionalCategory() {
  const {
    list,
    isLoading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    isUploading,
    formData,
    statusOverrides,
    isDeleteOpen,
    updateField,
    handleImageUpload,
    handleSubmit,
    resetModal,
    handleDelete,
    handleStatusToggle,
    startEdit,
    handleDeleteClick,
    setDeleteOpen,
    openAdd,
  } = usePromotionalCategory();

  return (
    <>
      <BaseCard
        title="Promotional Categories"
        btnLabel="Add promotional category"
        onClick={openAdd}
        extraClassName="p-6 border-none h-full"
      >
        {!isLoading && list.length === 0 ? (
          <PromoCategoryEmptyState onAdd={openAdd} />
        ) : (
          <AutoSkeleton loading={isLoading} config={{ animation: "shimmer" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading ? (
                <AutoSkeleton.Repeat count={8}>
                  <PromoCard
                    row={PROMO_PLACEHOLDER}
                    statusOverrides={{}}
                    onStatusToggle={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </AutoSkeleton.Repeat>
              ) : (
                list.map((row) => (
                  <PromoCard
                    key={row._id}
                    row={row}
                    statusOverrides={statusOverrides}
                    onStatusToggle={handleStatusToggle}
                    onEdit={startEdit}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>
          </AutoSkeleton>
        )}
      </BaseCard>

      <DeleteConfirmationDialog
        visible={isDeleteOpen}
        setVisible={setDeleteOpen}
        onConfirm={handleDelete}
      />

      <BaseModal
        visible={open}
        onHide={resetModal}
        title={
          isEdit ? "Edit Promotional Category" : "Add Promotional Category"
        }
        width="min(90vw, 50rem)"
        footer={
          <div className="flex justify-end gap-3">
            <CustomButton
              label={"Cancel"}
              variant="gray"
              onClick={resetModal}
              // disabled={isCreating || isUpdating || isUploading}
              className="px-4 py-2!"
            />
            <CustomButton
              label={isEdit ? "Update" : "Add"}
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || isUploading}
              loading={isCreating || isUpdating}
              className="px-4 py-2!"
            />
          </div>
        }
      >
        <div className="mt-4" style={{ overflowY: "scroll", height: "75vh" }}>
          <PromotionalCatalogFormFields
            formData={formData}
            onChange={({ name, value }) => updateField(name, value)}
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
            formErrors={formData.formErrors}
            showAllErrors
          />
        </div>
      </BaseModal>
    </>
  );
}
