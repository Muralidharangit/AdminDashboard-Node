import React from 'react'
import { Card, TblWrap } from './Common.jsx'
import { Icons } from './Icons.jsx'

const ROLES = [
  { role: 'Super Admin', users: 2, desc: 'Full root access to all system modules.', perms: { Read: true, Write: true, Delete: true, Publish: true } },
  { role: 'Editor', users: 5, desc: 'Create and modify content and products.', perms: { Read: true, Write: true, Delete: false, Publish: false } },
  { role: 'Viewer', users: 12, desc: 'Read-only access to dashboard metrics.', perms: { Read: true, Write: false, Delete: false, Publish: false } },
]

export default function RolesPage() {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((r, i) => (
          <Card key={i} className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                  {Icons.key}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{r.role}</h3>
                  <p className="text-[10px] text-neutral-500">{r.users} active users</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{r.desc}</p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
              {Object.entries(r.perms).map(([k, v]) => (
                <span
                  key={k}
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${
                    v ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-neutral-50 border-neutral-200 text-neutral-300 line-through'
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
            <button
              className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer pt-1 transition-colors"
              onClick={() => alert(`Manage ${r.role} permissions (Backend Integration Required)`)}
            >
              {Icons.edit} Manage
            </button>
          </Card>
        ))}
      </div>
      <TblWrap
        heads={['Module', 'Read', 'Write', 'Delete', 'Publish']}
        rows={[
          ['Product Catalog', true, true, true, true],
          ['Gallery & Storage', true, true, true, false],
          ['DB Engine', true, false, false, false],
        ].map(([mod, ...perms]) => (
          <tr key={mod} className="hover:bg-neutral-50/50 transition-colors">
            <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{mod}</td>
            {perms.map((v, idx) => (
              <td key={idx} className={`px-4 py-3 text-center font-bold text-sm ${v ? 'text-emerald-600' : 'text-neutral-300'}`}>
                {v ? '✓' : '—'}
              </td>
            ))}
          </tr>
        ))}
      />
    </div>
  )
}
