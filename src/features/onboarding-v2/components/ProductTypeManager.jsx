import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import CustomInput from "@/components/forms/CustomInput";
import CustomButton from "@/components/ui/Button/Button";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import {
  useGetProductTypesQuery,
  useCreateProductTypeMutation,
} from "@/store/api/productTypeApi";
import formValidation from "@/helpers/validations";

export default function ProductTypeManager() {
  const { profile } = useSelector((state) => state.businessProfile);
  const { data: productTypes = [], isLoading } = useGetProductTypesQuery();
  const [createMutation, { isLoading: isCreating }] = useCreateProductTypeMutation();

  const [typeName, setTypeName] = useState("");
  const [typeNameError, setTypeNameError] = useState("");

  const handleNameChange = useCallback(({ value }) => {
    setTypeName(value);
    setTypeNameError("");
  }, []);

  const handleAdd = useCallback(async () => {
    const trimmed = typeName.trim();
    const formErrors = formValidation("productTypeName", trimmed, { formErrors: {} });
    if (formErrors?.productTypeName) {
      setTypeNameError(formErrors.productTypeName);
      return;
    }
    try {
      await createMutation({
        merchantId: profile?._id,
        name: trimmed,
        categoryId: profile?.merchant?.categoryId,
      }).unwrap();
      setTypeName("");
    } catch (error) {
      if (import.meta.env.DEV) console.error("ProductType creation failed:", error);
    }
  }, [typeName, profile?.categoryId, createMutation]);

  const list = Array.isArray(productTypes) ? productTypes : [];

  return (
    <div>
      <div className="w-full sm:flex-1">
        <div className="flex items-end gap-3">
          <CustomInput
            label="Product Type Name"
            name="productTypeName"
            value={typeName}
            onChange={handleNameChange}
            placeholder="Enter product type name"
            errorMessage={typeNameError}
            ignoreError
            maxLength={30}
          />
          <CustomButton
            variant="primary"
            label="Add"
            onClick={handleAdd}
            className="w-[23%]!"
            disabled={!typeName.trim()}
            loading={isCreating}
          />
        </div>
        <small
          className={`text-error block text-sm mt-1 min-h-5 ${typeNameError ? "visible" : "invisible"}`}
        >
          {typeNameError || "\u00A0"}
        </small>
      </div>

      {/* <AutoSkeleton loading={isLoading} config={{ animation: "shimmer" }}>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {isLoading ? (
            <AutoSkeleton.Repeat count={3}>
              <div className="flex items-center gap-2 sm:gap-3 border px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm">
                <span>Product Type</span>
              </div>
            </AutoSkeleton.Repeat>
          ) : (
            list.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-2 sm:gap-3 border px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm"
              >
                <span>{item.name}</span>
              </div>
            ))
          )}
        </div>
      </AutoSkeleton> */}
    </div>
  );
}
