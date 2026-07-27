import React from 'react'
import { Icons } from './Icons.jsx'

export const BADGE_CLS = {
  Success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Warning: 'bg-amber-50 border-amber-200 text-amber-700',
  'In Stock': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'Low Stock': 'bg-amber-50 border-amber-200 text-amber-700',
  'Out of Stock': 'bg-red-50 border-red-200 text-red-700',
  Unread: 'bg-red-50 border-red-200 text-red-700',
  'In Progress': 'bg-blue-50 border-blue-200 text-blue-700',
  Resolved: 'bg-emerald-50 border-emerald-200 text-emerald-700',
}

export function Badge({ label }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-semibold ${BADGE_CLS[label] || 'bg-neutral-100 border-neutral-200 text-neutral-600'}`}>
      {label}
    </span>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-neutral-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Stat({ label, value, sub, icon }) {
  return (
    <Card className="p-5 flex items-start justify-between gap-3 hover:border-neutral-400 transition-all">
      <div className="space-y-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="text-sm font-bold text-neutral-900 leading-snug">{value}</p>
        <p className="text-[11px] text-neutral-500">{sub}</p>
      </div>
      <div className="h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
        {icon}
      </div>
    </Card>
  )
}

export function TblWrap({ heads, rows }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" style={{ minWidth: 480 }}>
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {heads.map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">{rows}</tbody>
        </table>
      </div>
    </Card>
  )
}

export function TopBar({ label, btnLabel, onClick }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-neutral-500">{label}</p>
      {btnLabel && (
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition"
        >
          {Icons.plus}
          {btnLabel}
        </button>
      )}
    </div>
  )
}
