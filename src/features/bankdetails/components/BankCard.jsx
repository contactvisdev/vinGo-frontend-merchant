import { memo, useMemo } from "react";
import { Trash, Landmark, CreditCard, Building2, User, Globe } from "lucide-react";
import { maskAccountNumber } from "@/helpers/formatters";
import PencilIcon from "@/assets/icons/pencil.svg";
import { COUNTRY_NAME_TO_CODE } from "@/helpers/constants/countries";
import { getFieldsForCountry } from "../helpers/bankValidation";
import { BANK_FIELD_DISPLAY_LABELS } from "../constants";
import SkeletonImage from "@/components/ui/SkeletonImage";

const BankCard = memo(function BankCard({ item, onEdit, onDelete }) {
  const countryCode = COUNTRY_NAME_TO_CODE[item.country] || "";
  const bankFields = useMemo(() => getFieldsForCountry(countryCode), [countryCode]);

  const accountDisplay = item.iban
    ? maskAccountNumber(item.iban)
    : maskAccountNumber(item.accountNumber);
  const accountLabel = item.iban ? "IBAN" : "Account";

  const codeField = bankFields.find(
    (f) => f.name !== "accountNumber" && f.name !== "iban" && item[f.name]
  );

  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
      <div className="flex flex-1 flex-col p-5 min-h-0">
        <div className="flex items-start gap-4 flex-1 min-h-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white shrink-0 shadow-md">
            <Landmark className="w-7 h-7" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900" title={item.bankName}>
                {item.bankName || "—"}
              </h3>
              {item.isPrimary && (
                <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                  Primary
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{item.accountHolderName || "—"}</span>
            </div>
            {item.country && (
              <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{item.country}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm font-mono">
              <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
              <span title={accountLabel}>{accountDisplay}</span>
            </div>
            {codeField && (
              <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-mono break-words">
                  {BANK_FIELD_DISPLAY_LABELS[codeField.name] || codeField.label}:{" "}
                  {item[codeField.name]}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary transition-colors"
            aria-label="Edit"
          >
            <SkeletonImage src={PencilIcon} className="w-4 h-4" alt="" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Delete"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default BankCard;
