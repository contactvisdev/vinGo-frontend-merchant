import React from "react";
import { Dialog } from "primereact/dialog";
import { Trash2 } from "lucide-react";

const DeleteConfirmationDialog = React.memo(function DeleteConfirmationDialog({
  visible,
  setVisible,
  onConfirm,
  itemCount,
}) {
  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      showHeader={false}
      modal
      className="w-[550px]"
      pt={{ content: { className: 'p-0!' } }}
    >
      <div className="flex flex-col items-center p-8 bg-white rounded-lg">
        <div className="mb-4">
          <Trash2 size={48} className="text-primary" strokeWidth={2} />
        </div>

        <h2 className="text-[26px] font-medium text-gray-800 mb-3 text-center">
          {itemCount !== undefined && itemCount > 1
            ? `Are you sure you want to delete ${itemCount} selected item(s)?`
            : "Are you sure you want to delete this?"}
        </h2>

        <p className="text-gray-600 text-center mb-6 text-[16px] px-8">
          {itemCount !== undefined && itemCount > 1
            ? "This action cannot be undone."
            : "Deleting will permanently remove this item from your list."}
        </p>

        <div className="flex gap-3 ">
          <button
            onClick={() => {
              onConfirm();
              setVisible(false);
            }}
            className="flex-1 px-12 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600"
          >
            Yes
          </button>

          <button
            onClick={() => setVisible(false)}
            className="flex-1 px-12 py-3 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500"
          >
            No
          </button>
        </div>
      </div>
    </Dialog>
  );
});

DeleteConfirmationDialog.displayName = "DeleteConfirmationDialog";

export default DeleteConfirmationDialog;
