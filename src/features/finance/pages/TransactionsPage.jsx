import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BaseCard from "@/components/ui/Card/Card";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useTransactions, useWalletData } from "../hooks";

const TABS = ["All", "Credits", "Debits"];
const TAB_DIRECTION = {
  All: undefined,
  Credits: "CREDIT",
  Debits: "DEBIT",
};

const formatCurrency = (value, currency = "USD") => {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `$${safe.toFixed(2)}`;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getTxType = (tx) => {
  const type = (tx?.type || tx?.direction || "").toLowerCase();
  if (type === "credit" || type === "in" || type === "deposit") return "credit";
  if (
    type === "debit" ||
    type === "out" ||
    type === "withdraw" ||
    type === "withdrawal"
  )
    return "debit";
  const amount = Number(tx?.amount ?? 0);
  return amount >= 0 ? "credit" : "debit";
};

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return TABS.includes(tab) ? tab : "All";
  }, [searchParams]);
  const direction = TAB_DIRECTION[activeTab];
  const { transactions, loading } = useTransactions(direction);
  const { wallet } = useWalletData();
  const currency = wallet?.currency || "USD";

  return (
    <BaseCard title="Transaction History" extraClassName="p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                if (tab === "All") {
                  nextParams.delete("tab");
                } else {
                  nextParams.set("tab", tab);
                }
                setSearchParams(nextParams);
              }}
              className={`py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary-600 border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-400">
          Showing {transactions.length} {transactions.length === 1 ? "item" : "items"}
        </div>
      </div>

      <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
        <div className="mt-4 divide-y">
          {transactions.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No transactions found
            </div>
          ) : (
            transactions.map((tx) => {
              const type = getTxType(tx);
              const amount = Math.abs(Number(tx.amount) || 0);
              const title =
                tx.title ||
                tx.description ||
                tx.orderId ||
                (type === "credit" ? "Credit" : "Debit");
              return (
                <div
                  key={tx._id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        type === "credit"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {type === "credit" ? (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M5 12h14"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-xs text-gray-400">
                        {formatDate(tx.createdAt || tx.date)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-medium ${
                      type === "credit" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {type === "credit" ? "+" : "-"}
                    {formatCurrency(amount, currency)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AutoSkeleton>
    </BaseCard>
  );
}
