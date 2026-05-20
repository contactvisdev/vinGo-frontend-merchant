import { useMemo } from "react";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useWalletData, useTransactions } from "../hooks";

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
  if (type === "debit" || type === "out" || type === "withdraw" || type === "withdrawal")
    return "debit";
  const amount = Number(tx?.amount ?? 0);
  return amount >= 0 ? "credit" : "debit";
};

export default function WalletPage() {
  const { wallet, loading: walletLoading } = useWalletData();
  const { transactions, loading: txLoading } = useTransactions();

  const currency = wallet?.currency || "USD";
  const balance = wallet?.balance ?? 0;

  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }, []);

  const totalThisWeek = useMemo(() => {
    return transactions
      .filter((t) => getTxType(t) === "credit")
      .filter((t) => {
        const created = new Date(t.createdAt || t.date || 0).getTime();
        return created >= weekAgo;
      })
      .reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
  }, [transactions, weekAgo]);

  const pendingPayouts = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          (t?.status || "").toLowerCase() === "pending" &&
          getTxType(t) === "debit",
      )
      .reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
  }, [transactions]);

  const lastPayment = useMemo(() => {
    const lastDebit = [...transactions]
      .filter((t) => getTxType(t) === "debit")
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0).getTime() -
          new Date(a.createdAt || a.date || 0).getTime(),
      )[0];
    return lastDebit ? formatDate(lastDebit.createdAt || lastDebit.date) : "—";
  }, [transactions]);

  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div>
      <BaseCard extraClassName="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">My Balance</p>
            <AutoSkeleton loading={walletLoading} config={{ animation: "shimmer" }}>
              <h2 className="text-3xl font-semibold mt-1">
                {formatCurrency(balance, currency)}
              </h2>
            </AutoSkeleton>
          </div>

          <div className="flex items-center gap-4">
            <CustomButton
              variant="primary"
              label="Withdraw"
              fullWidth={false}
              className="px-6!"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-md text-sm">
            Payouts are processed weekly every Monday for all completed orders.
          </div>
        </div>
      </BaseCard>

      <BaseCard extraClassName="mt-4" title="Recent Activity">
        <AutoSkeleton loading={txLoading} config={{ animation: "shimmer" }}>
          <div className="divide-y">
            {recent.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No transactions yet
              </div>
            ) : (
              recent.map((tx) => {
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

        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-600">
            <div>Total Earned This Week</div>
            <div className="text-xl font-semibold mt-1">
              {formatCurrency(totalThisWeek, currency)}
            </div>
          </div>

          <div className="flex-1 text-sm text-center text-gray-600">
            <div>Pending Payouts</div>
            <div className="text-xl font-semibold text-primary-600 mt-1">
              {formatCurrency(pendingPayouts, currency)}
            </div>
          </div>

          <div className="flex-1 text-sm text-right text-gray-600">
            <div>Last Payment</div>
            <div className="text-xl font-semibold mt-1">{lastPayment}</div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
}
