import React from 'react'
import { Stat, TblWrap, Badge } from './Common.jsx'
import { Icons } from './Icons.jsx'

const LOGS = [
  { id: 'LOG-3091', action: 'Create Admin User', module: 'Auth Module', status: 'Success', time: '10m ago' },
  { id: 'LOG-3090', action: 'DB handshake verified', module: 'Database Core', status: 'Success', time: '15m ago' },
  { id: 'LOG-3089', action: 'JWT Session generated', module: 'Token Issuer', status: 'Success', time: '20m ago' },
  { id: 'LOG-3088', action: 'Failed login attempt', module: 'Auth Module', status: 'Warning', time: '1h ago' },
]

export default function DashboardHome() {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Database" value="MongoDB Connected" sub="Atlas Cluster Online" icon={Icons.db} />
        <Stat label="Server" value="100% Operational" sub="Express port 5000" icon={Icons.server} />
        <Stat label="Security" value="JWT Enabled" sub="Token valid · 24h" icon={Icons.shield} />
      </div>
      <TblWrap
        heads={['Log ID', 'Operation', 'Module', 'Time', 'Status']}
        rows={LOGS.map(l => (
          <tr key={l.id} className="hover:bg-neutral-50/50 transition-colors">
            <td className="px-4 py-3 font-mono text-[10px] text-neutral-500 whitespace-nowrap">{l.id}</td>
            <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{l.action}</td>
            <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{l.module}</td>
            <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{l.time}</td>
            <td className="px-4 py-3">
              <Badge label={l.status} />
            </td>
          </tr>
        ))}
      />
    </div>
  )
}
