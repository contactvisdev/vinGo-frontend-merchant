import { useState, useCallback } from "react";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";

/**
 * Custom hook for form state management with validation
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}) => {
  const [data, setData] = useState({
    ...initialValues,
    formErrors: {},
  });

  /**
   * Handle input change with validation
   * @param {Object} payload - { name, value }
   */
  const handleChange = useCallback(({ name, value }) => {
    setData((prev) => {
      const updated = { ...prev, [name]: value };
      const formErrors = formValidation(name, value, updated);
      return { ...updated, formErrors };
    });
  }, []);

  /**
   * Handle multiple field changes at once
   * @param {Object} updates - Object with field names as keys
   */
  const handleMultipleChanges = useCallback((updates) => {
    setData((prev) => {
      const updated = { ...prev, ...updates };
      // Re-validate all fields
      const formErrors = {};
      Object.keys(updates).forEach((name) => {
        const errors = formValidation(name, updates[name], updated);
        Object.assign(formErrors, errors);
      });
      return { ...updated, formErrors };
    });
  }, []);

  /**
   * Validate and show form errors
   * @returns {boolean} True if form is valid
   */
  const validate = useCallback((ignore = []) => {
    return showFormErrors(data, setData, ignore);
  }, [data]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setData({ ...initialValues, formErrors: {} });
  }, [initialValues]);

  /**
   * Set form data directly
   * @param {Object} newData - New form data
   */
  const setFormData = useCallback((newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  return {
    data,
    setData,
    handleChange,
    handleMultipleChanges,
    validate,
    reset,
    setFormData,
  };
};

