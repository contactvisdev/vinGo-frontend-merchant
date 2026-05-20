import { useCallback, useState } from "react";
import BaseCard from "@/components/ui/Card/Card";
import BaseModal from "@/components/ui/Modal/Modal";
import {
  BankDetailsForm,
  DeleteBankConfirm,
  BankCard,
  BankDetailsEmptyState,
} from "../components";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useBankList, useBankForm, useBankDelete } from "../hooks";
import { maskAccountNumber } from "@/helpers/formatters";

const BANK_PLACEHOLDER = {
  _id: "__skeleton__",
  bankName: "Bank Name Here",
  accountNumber: "000000000000",
  accountHolderName: "Account Holder Name",
  country: "United States",
};

export default function BankDetailsList() {
  const { bankList, loading, merchantId } = useBankList();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    form,
    errors,
    loading: formLoading,
    isEdit,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  } = useBankForm(editingId, () => {
    setFormOpen(false);
    setEditingId(null);
  });

  const { selected, setSelected, deleteLoading, handleConfirm } =
    useBankDelete();

  const handleAdd = useCallback(() => {
    resetForm();
    setEditingId(null);
    setFormOpen(true);
  }, [resetForm]);

  const handleEdit = useCallback(
    (item) => {
      setFormData(item);
      setEditingId(item._id);
      setFormOpen(true);
    },
    [setFormData]
  );

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  const handleDeleteClick = useCallback(
    (item) => {
      setSelected(item);
    },
    [setSelected]
  );

  const list = Array.isArray(bankList) ? bankList : [];

  if (!merchantId) {
    return (
      <div className="w-full bg-white rounded-md p-5">
        <p className="text-gray-500">Loading merchant…</p>
      </div>
    );
  }

  const deleteBankLabel = selected
    ? `${selected.bankName} (${maskAccountNumber(selected.accountNumber)})`
    : "";

  return (
    <>
    <div className="w-full h-full flex flex-col">
      <BaseCard
        title="Bank Accounts"
        btnLabel="Add Bank Account"
        onClick={handleAdd}
        extraClassName="p-6 border-none flex-1"
      >
        <div className="mt-4">
          {!loading && list.length === 0 ? (
            <BankDetailsEmptyState onAdd={handleAdd} />
          ) : (
            <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <AutoSkeleton.Repeat count={6}>
                    <BankCard item={BANK_PLACEHOLDER} onEdit={() => {}} onDelete={() => {}} />
                  </AutoSkeleton.Repeat>
                ) : (
                  list.map((item) => (
                    <BankCard
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </div>
            </AutoSkeleton>
          )}
        </div>
      </BaseCard>

      <BaseModal
        visible={formOpen}
        onHide={handleCloseForm}
        title={isEdit ? "Edit Bank Account" : "Add Bank Account"}
        width="32rem"
      >
        <BankDetailsForm
          form={form}
          errors={errors}
          loading={formLoading}
          isEdit={isEdit}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </BaseModal>

      {selected && (
        <DeleteBankConfirm
          bankLabel={deleteBankLabel}
          onConfirm={handleConfirm}
          onCancel={() => setSelected(null)}
          loading={deleteLoading}
        />
      )}
      </div>
    </>
  );
}
