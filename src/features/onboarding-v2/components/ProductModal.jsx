import { Dialog } from "primereact/dialog";
import CustomInput from "@/components/forms/CustomInput";
import { CustomToggle } from "@/components/forms/CustomToggle";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomTextArea } from "@/components/forms/CustomTextArea";
import CustomButton from "@/components/ui/Button/Button";
import CustomImageUploaderBox from "@/components/forms/CustomImageUploaderBox";
import CustomCalendar from "@/components/forms/CustomCalendar";
import FullScreenLoader from "./FullScreenLoader";
import { useProductModal } from "../hooks";
import { PRODUCT_FIELD_CONFIG } from "../utils/categoryFieldConfig";

export default function ProductModal({
  visible,
  onHide,
  catalogList,
  categorySlug,
  itemId = null,
  itemData = null,
}) {
  const config = PRODUCT_FIELD_CONFIG[categorySlug] || PRODUCT_FIELD_CONFIG.grocery;
  const {
    data, loading, isEditMode, selectedCatalog, catalogError, catalogOptions,
    handleChange, handleSelectedCatalog, uploadDocument, uploadAddOnImage,
    addAddOn, removeAddOn, updateAddOn, handleSubmit,
  } = useProductModal({ categorySlug, catalogList, itemId, itemData, onHide });

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`${isEditMode ? "Edit" : "Add"} ${config.title}`}
      className="custom-dialog-box overflow-y-auto modal-height"
      pt={{ content: { className: "modal-height!" } }}
      blockScroll
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <CustomDropdown
              label="Category"
              options={catalogOptions}
              value={selectedCatalog}
              onChange={handleSelectedCatalog}
              placeholder="Select Category"
            />
            {catalogError && (
              <p className="text-primary text-sm mt-1">{catalogError}</p>
            )}
          </div>
          <CustomInput label="Product Name" name="name" data={data} onChange={handleChange} required />
          {categorySlug === "grocery" && (
            <CustomInput label="Brand" name="brand" data={data} onChange={handleChange} />
          )}
          <CustomInput label="Price" name="basePrice" type="number" data={data} onChange={handleChange} required />
        </div>

        {categorySlug === "grocery" && (
          <div className="flex gap-2">
            <div className="w-full">
              <CustomInput label="Quantity" name="quantity" data={data} onChange={handleChange} placeholder="e.g., 1L, 500g, 2kg" />
            </div>
            <div>
              <CustomInput label="Pieces (pcs)" name="pcs" type="number" data={data} onChange={handleChange} placeholder="Number of pieces" />
            </div>
          </div>
        )}

        {categorySlug === "pharmacy" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput label="Stock Quantity" name="stockQuantity" type="number" data={data} onChange={handleChange} placeholder="Number of units in stock" />
            <CustomCalendar label="Expiry Date" name="expiryDate" data={data} onChange={handleChange} minDate={new Date()} placeholder="Select expiry date" />
          </div>
        )}

        <CustomTextArea label="Description" name="description" data={data} onChange={handleChange} />

        {categorySlug === "grocery" && (
          <div className="flex items-center gap-4">
            <div className="w-[45%]">
              <CustomInput label="Expiry Date" name="expiryDate" type="date" data={data} onChange={handleChange} />
            </div>
            <div className="sm:col-span-2 mt-5">
              <CustomToggle label="Available" name="availability" data={data} onChange={handleChange} />
            </div>
          </div>
        )}

        {categorySlug === "pharmacy" && (
          <CustomToggle label="Available" name="availability" data={data} onChange={handleChange} />
        )}

        <div className="w-[45%]">
          <CustomImageUploaderBox name="item_img" label="Product Image" data={data} onChange={handleChange} uploadApi={uploadDocument} />
        </div>

        {/* Add-Ons */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add-Ons</h3>
            <CustomButton variant="line" label="Add Add-On" onClick={addAddOn} fullWidth={false} className="text-sm" />
          </div>
          {data.addOns.length > 0 && (
            <div className="space-y-4">
              {data.addOns.map((addOn, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                      label="Add-On Name"
                      name={`addOnName_${index}`}
                      value={addOn.addOnName}
                      onChange={(e) => updateAddOn(index, "addOnName", e.value ?? e.target?.value)}
                      placeholder="e.g., Extra item"
                    />
                    <CustomInput
                      label="Add-On Price"
                      name={`addOnPrice_${index}`}
                      type="number"
                      value={addOn.addOnPrice}
                      onChange={(e) => updateAddOn(index, "addOnPrice", e.value ?? e.target?.value)}
                      placeholder="Price"
                    />
                  </div>
                  <CustomImageUploaderBox
                    name="addOnImg"
                    label="Add-On Image"
                    data={{ addOnImg: addOn.addOnImg }}
                    onChange={({ value }) => updateAddOn(index, "addOnImg", value)}
                    uploadApi={uploadAddOnImage(index)}
                  />
                  <div className="flex justify-end mt-2">
                    <CustomButton
                      variant="line"
                      label="Remove"
                      onClick={() => removeAddOn(index)}
                      fullWidth={false}
                      className="text-red-600 hover:text-red-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-4">
          <CustomButton variant="line" label="Cancel" onClick={onHide} fullWidth={false} />
          <CustomButton
            variant="primary"
            label={isEditMode ? "Update Product" : "Add Product"}
            onClick={handleSubmit}
            loading={loading}
            fullWidth={false}
          />
        </div>
      </div>

      <FullScreenLoader loading={loading} />
    </Dialog>
  );
}
