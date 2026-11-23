import React from 'react';

const STYLES = {
  available: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Available' },
  occupied: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Occupied' },
  ready: { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Ready to Serve' },
  new: { bg: 'bg-sky-50 text-sky-800 border-sky-200', label: 'New Order' },
  preparing: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Preparing' },
  served: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Served' },
  paid: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Paid' },
  unpaid: { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Unpaid' },
  low: { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Low Stock' },
  ok: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'In Stock' },
};

export default function StatusBadge({ kind, customLabel }) {
  const cfg = STYLES[kind] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: kind };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg}`}>
      {customLabel || cfg.label}
    </span>
  );
}