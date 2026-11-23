import React, { useMemo, useState } from 'react';
import {
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  Printer,
  Download,
  Lock,
  Plus,
  Minus,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

export function OrdersPage({ orders, onMarkPaid, onNotify }) {
  const [statusTab, setStatusTab] = useState('all');
  const [query, setQuery] = useState('');
  const [activeOrderId, setActiveOrderId] = useState(null);

  const visibleOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchQuery =
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.table.toLowerCase().includes(query.toLowerCase());
      if (!matchQuery) return false;
      if (statusTab === 'all') return true;
      if (statusTab === 'pending_payment') return !o.paid;
      if (statusTab === 'served') return o.serveStatus === 'served';
      return o.kitchenStatus === statusTab;
    });
  }, [orders, statusTab, query]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">
            Track order progress, payment status, and open any row for full details.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or table..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          ['all', 'All Orders'],
          ['new', 'New'],
          ['preparing', 'Preparing'],
          ['ready', 'Ready'],
          ['served', 'Served'],
          ['pending_payment', 'Pending Payment'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              statusTab === key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Table / Type</th>
              <th className="px-4 py-3">Kitchen</th>
              <th className="px-4 py-3">Serving</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              visibleOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setActiveOrderId(ord.id)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">{ord.id}</td>
                  <td className="px-4 py-3">
                    {ord.table}{' '}
                    <span className="text-xs text-slate-500">({ord.source})</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge kind={ord.kitchenStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      kind={ord.serveStatus === 'served' ? 'served' : 'preparing'}
                      customLabel={ord.serveStatus === 'served' ? 'Served' : 'In Progress'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge kind={ord.paid ? 'paid' : 'unpaid'} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{ord.elapsedMins}m ago</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    PKR {ord.total.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-Over Details Drawer */}
      {activeOrder && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {activeOrder.id} • {activeOrder.table}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeOrder.source} • Waiter: {activeOrder.waiter} •{' '}
                    {activeOrder.synced ? 'Synced' : 'Pending Sync'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveOrderId(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <StatusBadge kind={activeOrder.kitchenStatus} />
                <StatusBadge kind={activeOrder.paid ? 'paid' : 'unpaid'} />
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h3 className="text-xs font-semibold uppercase text-slate-500">Items</h3>
                {activeOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between text-sm py-1.5 border-b border-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.qty}x {item.name}
                      </p>
                      {item.note && (
                        <p className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold">
                      PKR {(item.qty * item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-base font-bold pt-2">
                <span>Total Bill</span>
                <span>PKR {activeOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              {!activeOrder.paid && (
                <button
                  onClick={() => onMarkPaid(activeOrder.id)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 inline-flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Paid
                </button>
              )}
              <button
                onClick={() => onNotify(`Receipt sent to printer for ${activeOrder.id}.`)}
                className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 inline-flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SAMPLE_RECIPES = [
  {
    dish: 'Classic Smash Burger',
    sellingPrice: 950,
    ingredients: '1x Brioche Bun (PKR 85), 140g Beef Patty (PKR 240), 1x Cheese Slice (PKR 60)',
    recipeCost: 385,
  },
  {
    dish: 'Grilled Peri-Peri Bowl',
    sellingPrice: 1120,
    ingredients: '180g Chicken Fillet (PKR 165), Rice & Veg Base (PKR 110), Peri Sauce (PKR 55)',
    recipeCost: 330,
  },
  {
    dish: 'Cold Brew Latte',
    sellingPrice: 490,
    ingredients: '25g Coffee Beans (PKR 85), 220ml Milk (PKR 55)',
    recipeCost: 140,
  },
];

export function InventoryRecipesPage({ inventory, onAdjustStock }) {
  const [subTab, setSubTab] = useState('stock');
  const [search, setSearch] = useState('');
  const [onlyLow, setOnlyLow] = useState(false);

  const filteredStock = inventory.filter((row) => {
    const matchesText = row.item.toLowerCase().includes(search.toLowerCase());
    const matchesLow = !onlyLow || row.onHand <= row.minStock;
    return matchesText && matchesLow;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inventory &amp; Recipes</h1>
          <p className="text-sm text-slate-500">
            Monitor stock levels, low-stock alerts, and dish recipe food cost.
          </p>
        </div>
        <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setSubTab('stock')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
              subTab === 'stock' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Stock Items
          </button>
          <button
            onClick={() => setSubTab('recipes')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
              subTab === 'recipes' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Recipe Costing
          </button>
        </div>
      </div>

      {subTab === 'stock' ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredient..."
              className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
            />
            <button
              onClick={() => setOnlyLow((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 ${
                onlyLow
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock Only
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">On Hand</th>
                  <th className="px-4 py-3">Min Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map((row) => {
                  const isLow = row.onHand <= row.minStock;
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.item}</td>
                      <td className="px-4 py-3 font-semibold">
                        {row.onHand} {row.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.minStock} {row.unit}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind={isLow ? 'low' : 'ok'} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onAdjustStock(row.id, -1)}
                            className="p-1.5 rounded border border-slate-300 hover:bg-slate-50"
                            title="Decrease by 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAdjustStock(row.id, 5)}
                            className="px-2.5 py-1 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> 5 {row.unit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Menu Dish</th>
                <th className="px-4 py-3">Ingredients &amp; Cost</th>
                <th className="px-4 py-3">Food Cost</th>
                <th className="px-4 py-3">Sell Price</th>
                <th className="px-4 py-3 text-right">Food Cost %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_RECIPES.map((r) => {
                const foodCostPct = ((r.recipeCost / r.sellingPrice) * 100).toFixed(1);
                return (
                  <tr key={r.dish}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{r.dish}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.ingredients}</td>
                    <td className="px-4 py-3 font-medium">PKR {r.recipeCost}</td>
                    <td className="px-4 py-3 font-semibold">PKR {r.sellingPrice}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {foodCostPct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function StaffAttendancePage({ staff, onToggleAttendance }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Staff &amp; Attendance</h1>
          <p className="text-sm text-slate-500">
            Manage shifts, check-in/check-out status, and role permissions.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          Salary details restricted to Owner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member) => {
          const checkedIn = member.status === 'Checked In';
          return (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-sm text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role: <strong className="text-slate-700">{member.role}</strong> • {member.shift}
                </p>
              </div>
              <button
                onClick={() => onToggleAttendance(member.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border ${
                  checkedIn
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {checkedIn ? 'Checked In (Tap Out)' : 'Checked Out (Tap In)'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FinanceClosingPage({
  openingCash,
  onChangeOpeningCash,
  todaysSales,
  pendingPaymentsTotal,
  dayClosed,
  onConfirmCloseDay,
}) {
  const [expenses, setExpenses] = useState(1200);
  const [countedCash, setCountedCash] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const collectedSales = todaysSales - pendingPaymentsTotal;
  const expectedCash = Number(openingCash) + collectedSales - Number(expenses);
  const diff = countedCash === '' ? null : Number(countedCash) - expectedCash;

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Finance &amp; Day Closing</h1>
        <p className="text-sm text-slate-500">
          Reconcile cash drawer, daily expenses, and close shift records safely.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-semibold text-base">Cash Reconciliation</h2>
          <StatusBadge
            kind={dayClosed ? 'paid' : 'preparing'}
            customLabel={dayClosed ? 'Day Closed' : 'Open Shift'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Opening Cash (PKR)
            </label>
            <input
              type="number"
              disabled={dayClosed}
              value={openingCash}
              onChange={(e) => onChangeOpeningCash(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Petty Cash Expenses (PKR)
            </label>
            <input
              type="number"
              disabled={dayClosed}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3.5 space-y-2 text-sm border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-600">Collected Orders Today</span>
            <span className="font-semibold">PKR {collectedSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Unpaid / Pending Bills</span>
            <span className="font-semibold text-amber-800">
              PKR {pendingPaymentsTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200">
            <span>Expected Cash in Drawer</span>
            <span>PKR {expectedCash.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Actual Counted Cash (PKR)
          </label>
          <input
            type="number"
            disabled={dayClosed}
            value={countedCash}
            onChange={(e) => setCountedCash(e.target.value)}
            placeholder="Enter physical cash counted at register..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        {diff !== null && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm">
            <span className="font-medium">Cash Difference (Short / Over)</span>
            <span
              className={`font-bold ${
                diff === 0
                  ? 'text-emerald-700'
                  : diff > 0
                  ? 'text-blue-700'
                  : 'text-rose-700'
              }`}
            >
              {diff === 0 ? 'Balanced (PKR 0)' : `${diff > 0 ? '+' : ''}PKR ${diff.toLocaleString()}`}
            </span>
          </div>
        )}

        <button
          disabled={dayClosed}
          onClick={() => setConfirmOpen(true)}
          className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-40"
        >
          {dayClosed ? 'Day Closing Completed' : 'Close Day & Lock Register'}
        </button>
      </div>

      {confirmOpen && !dayClosed && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-base">Confirm Day Closing?</h3>
            <p className="text-sm text-slate-600">
              Expected cash is <strong>PKR {expectedCash.toLocaleString()}</strong>. Once closed,
              today&apos;s register summary will be locked for review.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirmCloseDay();
                  setConfirmOpen(false);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Yes, Close Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReportsPage({ orders, todaysSales }) {
  const [range, setRange] = useState('today');

  const multiplier = range === 'today' ? 1 : range === 'week' ? 6.4 : 26.8;
  const projectedSales = Math.round(todaysSales * multiplier);
  const projectedOrders = Math.round(orders.length * multiplier);

  const exportCsv = () => {
    const rows = [
      ['Order ID', 'Source', 'Table', 'Status', 'Paid', 'Total'],
      ...orders.map((o) => [
        o.id,
        o.source,
        o.table,
        o.kitchenStatus,
        o.paid ? 'Paid' : 'Unpaid',
        o.total,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurant-orders-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">
            Sales summary, period comparison, print, and CSV export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days (Demo)</option>
            <option value="month">This Month (Demo)</option>
          </select>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Gross Sales</p>
          <p className="text-2xl font-bold mt-1">PKR {projectedSales.toLocaleString()}</p>
          <p className="text-xs text-emerald-700 mt-1">+11.4% vs previous period</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Orders Completed</p>
          <p className="text-2xl font-bold mt-1">{projectedOrders}</p>
          <p className="text-xs text-slate-500 mt-1">Dine-In, Takeaway &amp; Web</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Average Order Value</p>
          <p className="text-2xl font-bold mt-1">
            PKR {orders.length ? Math.round(todaysSales / orders.length).toLocaleString() : 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">Live session average</p>
        </div>
      </div>
    </div>
  );
}