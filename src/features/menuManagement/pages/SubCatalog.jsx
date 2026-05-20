import BaseCard from "@/components/ui/Card/Card";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomButton from "@/components/ui/Button/Button";
import CustomInput from "@/components/forms/CustomInput";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CatalogCard, CatalogEmptyState } from "../components/menuCatalog";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useSubCatalog } from "../hooks";

const SUB_CATALOG_PLACEHOLDER = {
  _id: "__skeleton__",
  catalogName: "Sub Catalog Name",
};

export default function SubCatalog() {
  const {
    list,
    loading,
    open,
    isEdit,
    isCreating,
    isUpdating,
    name,
    nameError,
    catalogId,
    catalogError,
    catalogOptions,
    filterCatalogOptions,
    catalogsLoading,
    selectedCatalogId,
    selectedCatalogName,
    isDeleteOpen,
    editId,
    handleClose,
    handleSubmit,
    startEdit,
    handleDeleteClick,
    deleteSubCatalog,
    setDeleteOpen,
    openAdd,
    handleNameChange,
    handleCatalogChange,
    handleFilterCatalogChange,
  } = useSubCatalog();

  return (
    <>
      <BaseCard
        title="Sub Catalog"
        btnLabel="Add sub catalog"
        onClick={openAdd}
        extraClassName="p-6 border-none h-full"
      >
        <div className="mt-4 flex flex-col gap-4">
          <div className="w-full sm:max-w-sm">
            <CustomDropdown
              label="Catalog"
              options={filterCatalogOptions}
              value={selectedCatalogId}
              onChange={(e) => handleFilterCatalogChange(e.value)}
              placeholder="Select Catalog"
              loading={catalogsLoading}
              appendTo={document.body}
            />
          </div>

          {!loading && list.length === 0 ? (
            <CatalogEmptyState
              onAdd={openAdd}
              title={
                selectedCatalogName
                  ? `No sub catalog in ${selectedCatalogName}`
                  : "No sub catalogs yet"
              }
              description="Organize your menu with sub catalogs. Add your first sub catalog to get started."
              btnLabel="Add sub catalog"
            />
          ) : (
            <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                  <AutoSkeleton.Repeat count={8}>
                    <CatalogCard
                      row={SUB_CATALOG_PLACEHOLDER}
                      gradientIndex={0}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </AutoSkeleton.Repeat>
                ) : (
                  list.map((row, index) => (
                    <CatalogCard
                      key={row._id}
                      row={row}
                      gradientIndex={index}
                      onEdit={startEdit}
                      onDelete={handleDeleteClick}
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
        onConfirm={() => deleteSubCatalog(editId)}
      />

      <BaseModal
        visible={open}
        onHide={handleClose}
        title={isEdit ? "Edit Sub Catalog" : "Add Sub Catalog"}
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
        <div className="my-4 flex flex-col gap-4">
          <CustomDropdown
            label="Catalog"
            options={catalogOptions}
            value={catalogId}
            onChange={(e) => handleCatalogChange(e.value)}
            placeholder="Select Catalog"
            loading={catalogsLoading}
            errorMessage={catalogError}
            required
            appendTo={document.body}
          />
          <CustomInput
            name="name"
            value={name}
            label="Sub Catalog Name"
            onChange={({ value }) => handleNameChange(value)}
            placeholder="Sub catalog name"
            errorMessage={nameError}
            // ignoreLabel
            // required={false}
            maxLength={50}
          />
        </div>
      </BaseModal>
    </>
  );
}
