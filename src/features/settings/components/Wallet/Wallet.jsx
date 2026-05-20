import { useMemo, useState } from 'react';
import BaseCard from '@/components/ui/Card/Card';
import CustomButton from '@/components/ui/Button/Button';

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('All');

  // Sample data — replace with real API data when available
  const transactions = useMemo(
    () => [
      { id: 1, type: 'credit', title: 'Order #5481', date: 'Nov 15, 2025 at 2:30 PM', amount: 89.5 },
      { id: 2, type: 'credit', title: 'Order #5482', date: 'Nov 14, 2025 at 1:20 PM', amount: 120.0 },
      { id: 3, type: 'debit', title: 'Withdraw', date: 'Nov 12, 2025 at 3:40 PM', amount: 500 },
      { id: 4, type: 'credit', title: 'Order #5483', date: 'Nov 11, 2025 at 11:00 AM', amount: 45.25 },
      { id: 5, type: 'debit', title: 'Withdraw', date: 'Oct 30, 2025 at 9:12 AM', amount: 200 },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (activeTab === 'All') return transactions;
    if (activeTab === 'Credits') return transactions.filter((t) => t.type === 'credit');
    return transactions.filter((t) => t.type === 'debit');
  }, [activeTab, transactions]);

  const totalThisWeek = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'credit')
      .reduce((s, t) => s + t.amount, 0)
      .toFixed(2);
  }, [transactions]);

  const pendingPayouts = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'debit')
      .reduce((s, t) => s + t.amount, 0)
      .toFixed(2);
  }, [transactions]);

  const lastPayment = useMemo(() => 'Oct 9, 2025', []);

  return (
    <div className='p-5'>
      <BaseCard extraClassName="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">My Balance</p>
            <h2 className="text-3xl font-semibold mt-1">$1,030.00</h2>
          </div>

          <div className="flex items-center gap-4">
            <CustomButton variant="primary" label="Withdraw" fullWidth={false} className="px-6!" />
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-md text-sm">
            Payouts are processed weekly every Monday for all completed orders.
          </div>
        </div>
      </BaseCard>

      <BaseCard extraClassName="mt-4" title="Transaction History">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {['All', 'Credits', 'Debits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-3 text-sm font-medium ${activeTab === tab ? 'text-primary-600 border-b-2 border-primary' : 'text-gray-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400">Showing {filtered.length} items</div>
          </div>

          <div className="mt-4 divide-y">
            {filtered.map((tx) => (
              <div key={tx.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                  >
                    {tx.type === 'credit' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>

                  <div>
                    <div className="font-medium">{tx.title}</div>
                    <div className="text-xs text-gray-400">{tx.date}</div>
                  </div>
                </div>

                <div className={`font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? `$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-sm text-gray-600">
              <div>Total Earned This Week</div>
              <div className="text-xl font-semibold mt-1">${totalThisWeek}</div>
            </div>

            <div className="flex-1 text-sm text-center text-gray-600">
              <div>Pending Payouts</div>
              <div className="text-xl font-semibold text-primary-600 mt-1">${pendingPayouts}</div>
            </div>

            <div className="flex-1 text-sm text-right text-gray-600">
              <div>Last Payment</div>
              <div className="text-xl font-semibold mt-1">{lastPayment}</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
}

