import { useCallback } from "react";

export function useDynamicList(listKey, prefix, nameLabel, formData, setFormData) {
  const handleAdd = useCallback(() => {
    const items = formData[listKey];

    if (items.length === 0) {
      setFormData((prev) => ({
        ...prev,
        [listKey]: [{ name: "", price: "", isDefault: false }],
      }));
      return;
    }

    const last = items[items.length - 1];
    const formErrors = { ...formData.formErrors };
    let hasError = false;

    if (!last.name?.trim()) {
      formErrors[`${prefix}_${items.length - 1}_name`] = `${nameLabel} is required`;
      hasError = true;
    }
    if (!last.price?.trim()) {
      formErrors[`${prefix}_${items.length - 1}_price`] = "Price is required";
      hasError = true;
    }

    if (hasError) {
      setFormData((prev) => ({ ...prev, formErrors }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { name: "", price: "", isDefault: false }],
      formErrors,
    }));
  }, [formData, setFormData, listKey, prefix, nameLabel]);

  const handleRemove = useCallback(
    (index) => {
      const updatedItems = formData[listKey].filter((_, i) => i !== index);
      const updatedErrors = { ...formData.formErrors };

      delete updatedErrors[`${prefix}_${index}_name`];
      delete updatedErrors[`${prefix}_${index}_price`];

      Object.keys(updatedErrors).forEach((key) => {
        if (!key.startsWith(`${prefix}_`)) return;
        const [_, rowIdx, field] = key.split("_");
        const rowIndexNum = Number(rowIdx);
        if (rowIndexNum > index) {
          const newKey = `${prefix}_${rowIndexNum - 1}_${field}`;
          updatedErrors[newKey] = updatedErrors[key];
          delete updatedErrors[key];
        }
      });

      setFormData((prev) => ({
        ...prev,
        [listKey]: updatedItems,
        formErrors: updatedErrors,
      }));
    },
    [formData, setFormData, listKey, prefix]
  );

  const handleChange = useCallback(
    (index, field, value) => {
      if (field === "isDefault") {
        const updated = formData[listKey].map((item, i) => ({
          ...item,
          isDefault: i === index ? !!value : false,
        }));
        setFormData((prev) => ({ ...prev, [listKey]: updated }));
        return;
      }

      const updated = formData[listKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );

      const formErrors = { ...formData.formErrors };
      const errorKey = `${prefix}_${index}_${field}`;

      if (!value?.trim()) {
        formErrors[errorKey] =
          `${field === "name" ? nameLabel : "Price"} is required`;
      } else if (field === "name" && value.trim().length > 35) {
        formErrors[errorKey] = `${nameLabel} must be 35 characters or less`;
      } else if (field === "price" && !/^\d+(\.\d{1,2})?$/.test(value)) {
        formErrors[errorKey] = "Price must be a valid number";
      } else if (field === "price" && Number(value) <= 0) {
        formErrors[errorKey] = "Price must be greater than 0";
      } else {
        delete formErrors[errorKey];
      }

      setFormData((prev) => ({ ...prev, [listKey]: updated, formErrors }));
    },
    [formData, setFormData, listKey, prefix, nameLabel]
  );

  return { handleAdd, handleRemove, handleChange };
}
