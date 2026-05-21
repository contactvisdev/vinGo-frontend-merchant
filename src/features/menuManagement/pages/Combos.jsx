import BaseCard from "@/components/ui/Card/Card";
import Pagination from "@/components/ui/Table/Pagination";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import BaseModal from "@/components/ui/Modal/Modal";
import CustomInput from "@/components/forms/CustomInput";
import { CustomMultiSelect } from "@/components/forms/AllInput";
import { CustomSearchInput } from "@/components/forms/CustomSearchInput";
import CustomButton from "@/components/ui/Button/Button";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import { getImageUrl } from "@/helpers/commonFunctions";
import {
  ComboCard,
  CombosEmptyState,
} from "../components/combos";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useCombos } from "../hooks";

const COMBO_PLACEHOLDER = {
  _id: "__skeleton__",
  combo_name: "Combo Name Here",
  comboPrice: 0,
  combo_image: "placeholder",
  itemIds: [1, 2],
  availability: true,
};

export default function Combos() {
  const {
    comboList,
    menuItems,
    isLoading,
    isFetching,
    search,
    searchInputRef,
    isSearchFocused,
    page,
    pagination,
    open,
    isEdit,
    isCreating,
    isUpdating,
    isUploading,
    formData,
    isDeleteOpen,
    setSearch,
    setIsSearchFocused,
    setPage,
    updateField,
    handleImageUpload,
    handleSubmit,
    resetModal,
    startEdit,
    handleDelete,
    handleToggleAvailability,
    handleDeleteClick,
    setDeleteOpen,
    openAdd,
  } = useCombos();

  const totalPages = Number(pagination?.totalPages) || 1;

  return (
    <div className="flex flex-col h-full">
      <BaseCard extraClassName="px-6! py-4! mb-4!">
        <div className="flex justify-between">
          <div className="flex items-center gap-[1%] w-2/3">
            <div className="w-full">
              <CustomSearchInput
                ref={searchInputRef}
                name="search"
                placeholder="Search combos"
                col={12}
                value={search}
                ignoreLabel
                ignoreError
                disabled={(isLoading || isFetching) && !isSearchFocused}
                onChange={(e) => setSearch(e.value || "")}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
          <div>
            <CustomButton
              label="Add combo"
              onClick={openAdd}
              className="shrink-0!"
            />
          </div>
        </div>
      </BaseCard>
      <BaseCard extraClassName="px-6! py-4! mb-4! flex-1">
        {!isLoading && comboList.length === 0 ? (
          <CombosEmptyState onAdd={openAdd} />
        ) : (
          <>
            <AutoSkeleton loading={isLoading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  <AutoSkeleton.Repeat count={8}>
                    <ComboCard
                      row={COMBO_PLACEHOLDER}
                      onToggleAvailability={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </AutoSkeleton.Repeat>
                ) : (
                  comboList.map((row) => (
                    <ComboCard
                      key={row._id}
                      row={row}
                      onToggleAvailability={handleToggleAvailability}
                      onEdit={startEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </div>
            </AutoSkeleton>
            {!isLoading && totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={Number(pagination?.total) || 0}
                  pageSize={12}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
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
        title={isEdit ? "Edit Combo" : "Add Combo"}
        width="40rem"
        footer={
          <div className="flex justify-end gap-3 mt-5! pb-5!">
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
        <div className="space-y-2 my-4">
          <div>
            <CustomInput
              label="Combo Name"
              name="combo_name"
              extraClassName="m-0!"
              value={formData.combo_name}
              onChange={({ value }) => updateField("combo_name", value)}
              placeholder="e.g. Burger + Fries Combo"
              required
              errorMessage={formData.formErrors?.combo_name}
            />
          </div>
          <div>
            <CustomMultiSelect
              label="Items"
              name="itemIds"
              options={menuItems}
              optionLabel="name"
              extraClassName="m-0!"
              optionValue="_id"
              value={formData.itemIds}
              onChange={(e) => updateField("itemIds", e.value || [])}
              placeholder="Select items"
              display="chip"
              required
              data={formData}
              errorMessage={formData.formErrors?.itemIds}
              itemTemplate={(option) => (
                <div className="flex items-center gap-3 py-1">
                  {option?.item_img ? (
                    <img
                      src={getImageUrl(option.item_img)}
                      alt={option?.name}
                      className="w-10 h-10 object-cover rounded shrink-0 bg-gray-100"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded shrink-0 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                  <span className="truncate">{option?.name}</span>
                </div>
              )}
            />
          </div>
          <div>
            <CustomInput
              label="Combo Price"
              name="comboPrice"
              value={formData.comboPrice}
              onChange={({ value }) => updateField("comboPrice", value)}
              currencySymbol="$"
              onlyPositiveNumber
              placeholder="0.00"
              errorMessage={formData.formErrors?.comboPrice}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Combo Image <span className="text-red-500">*</span>
            </label>
            <CustomImageUploaderBox
              name="combo_image"
              data={formData}
              onChange={({ name, value }) => updateField(name, value)}
              uploadApi={handleImageUpload}
              isUploading={isUploading}
              hasError={!!formData.formErrors?.combo_image}
              aspectRatio ={331/161}
              sizeHint="Recommended size: 331 x 161px"
            />
            {formData.formErrors?.combo_image && (
              <small className="text-error text-sm mt-1 block">
                {formData.formErrors.combo_image}
              </small>
            )}
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
