import { Landmark } from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";

export default function BankDetailsEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Landmark className="w-10 h-10 text-slate-500" strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium mb-1">No bank accounts yet</p>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
        Add a bank account to receive payouts from your orders.
      </p>
      <CustomButton label="Add Bank Account" onClick={onAdd} />
    </div>
  );
}
