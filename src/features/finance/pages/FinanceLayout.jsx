import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import BankDetailsList from "@/features/bankdetails/pages/BankDetailsList";
import TransactionsPage from "./TransactionsPage";
import WalletPage from "./WalletPage";

const TABS = [
  { label: "Bank Details", path: "/finance/bank-details" },
  { label: "Transaction History", path: "/finance/transactions" },
  { label: "Wallet", path: "/finance/wallet" },
];

export default function FinanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const match = TABS.find((t) => location.pathname.startsWith(t.path));
    return match?.path || null;
  }, [location.pathname]);

  const handleTabClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  if (!activeTab) {
    return <Navigate to="/finance/bank-details" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "/finance/transactions":
        return <TransactionsPage />;
      case "/finance/wallet":
        return <WalletPage />;
      case "/finance/bank-details":
      default:
        return <BankDetailsList />;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-md shadow-sm border border-gray-100 px-4 sm:px-6 pt-3">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => handleTabClick(tab.path)}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-primary-600 border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
