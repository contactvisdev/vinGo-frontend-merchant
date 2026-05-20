import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetBankDetailsByMerchantQuery,
  useCreateBankDetailsMutation,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
} from "@/store/api/bankApi";
import { COUNTRY_NAME_TO_CODE } from "@/helpers/constants/countries";
import {
  getFieldsForCountry,
  validateBankField,
  ALL_BANK_FIELD_NAMES,
} from "../helpers/bankValidation";

const INITIAL_FORM = {
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  iban: "",
  routingNumber: "",
  transitNumber: "",
  institutionNumber: "",
  bsbCode: "",
  country: "",
  isPrimary: false,
};

export function useBankList() {
  const merchantId = useSelector((state) => state.businessProfile?.profile?._id);

  const { data: bankList = [], isLoading } = useGetBankDetailsByMerchantQuery(
    { userId: merchantId, userType: "OWNER" },
    { skip: !merchantId }
  );

  return { bankList, loading: isLoading, merchantId };
}

export function useBankForm(editId, onSuccess) {
  const merchantId = useSelector((state) => state.businessProfile?.profile?._id);
  const [createBank] = useCreateBankDetailsMutation();
  const [updateBank] = useUpdateBankDetailsMutation();
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetForm = useCallback(() => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
  }, []);

  const setFormData = useCallback((data) => {
    if (!data) return;
    setForm({
      bankName: data.bankName || "",
      accountHolderName: data.accountHolderName || "",
      accountNumber: data.accountNumber || "",
      ifscCode: data.ifscCode || "",
      swiftCode: data.swiftCode || "",
      iban: data.iban || "",
      routingNumber: data.routingNumber || "",
      transitNumber: data.transitNumber || "",
      institutionNumber: data.institutionNumber || "",
      bsbCode: data.bsbCode || "",
      country: data.country || "",
      isPrimary: data.isPrimary === true,
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e;

    setForm((prev) => {
      if (name === "country") {
        const cleared = {};
        ALL_BANK_FIELD_NAMES.forEach((f) => {
          cleared[f] = "";
        });
        return { ...prev, ...cleared, country: value };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => {
      const next = { ...prev, [name]: undefined };
      if (name === "bankName" && value.trim().length > 25) {
        next.bankName = "Bank name must be at most 25 characters";
      }
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.bankName?.trim()) e.bankName = "Bank name is required";
    else if (form.bankName.trim().length > 25) e.bankName = "Bank name must be at most 25 characters";
    if (!form.accountHolderName?.trim())
      e.accountHolderName = "Account holder name is required";
    if (!form.country?.trim()) e.country = "Country is required";

    // Validate country-specific bank fields
    const countryCode = COUNTRY_NAME_TO_CODE[form.country] || "";
    const fields = getFieldsForCountry(countryCode);

    fields.forEach(({ name, required }) => {
      const error = validateBankField(name, form[name], countryCode, required);
      if (error) e[name] = error;
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (ev) => {
      ev?.preventDefault();
      if (!validate() || !merchantId) return;

      const countryCode = COUNTRY_NAME_TO_CODE[form.country] || "";
      const fields = getFieldsForCountry(countryCode);
      const visibleFieldNames = new Set(fields.map((f) => f.name));

      const payload = {
        userType: "OWNER",
        userId: merchantId,
        bankName: form.bankName.trim(),
        accountHolderName: form.accountHolderName.trim(),
        country: form.country.trim(),
        isPrimary: form.isPrimary,
      };

      visibleFieldNames.forEach((name) => {
        const val = form[name]?.trim();
        if (val) payload[name] = val;
      });

      setLoading(true);
      try {
        if (editId) {
          await updateBank({ id: editId, data: payload }).unwrap();
        } else {
          await createBank(payload).unwrap();
        }
        resetForm();
        onSuccess?.();
      } catch {
        setErrors((p) => ({ ...p, _: "Something went wrong. Please try again." }));
      } finally {
        setLoading(false);
      }
    },
    [
      form,
      editId,
      merchantId,
      validate,
      createBank,
      updateBank,
      resetForm,
      onSuccess,
    ]
  );

  return {
    form,
    errors,
    loading,
    isEdit: !!editId,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  };
}

export function useBankDelete() {
  const [deleteBank, { isLoading: deleteLoading }] =
    useDeleteBankDetailsMutation();
  const [selected, setSelected] = useState(null);

  const handleConfirm = useCallback(async () => {
    if (!selected?._id) return;
    try {
      await deleteBank(selected._id).unwrap();
      setSelected(null);
    } catch(err) {
      if(import.meta.env.DEV){
        console.log("Something went wrong. Please try again. in bank delete", err);
      }
    }
  }, [selected, deleteBank]);

  return {
    selected,
    setSelected,
    deleteLoading,
    handleConfirm,
  };
}
