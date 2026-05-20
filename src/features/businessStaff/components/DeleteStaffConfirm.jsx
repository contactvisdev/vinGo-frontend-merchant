import { AlertTriangle } from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";

export default function DeleteStaffConfirm({
  staffName = "this staff member",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-1">
          Delete staff member
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          Are you sure you want to delete <strong>{staffName}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <CustomButton
            label="Cancel"
            variant="gray"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          />
          <CustomButton
            label={loading ? "Deleting…" : "Delete"}
            variant="primary"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          />
        </div>
      </div>
    </div>
  );
}
