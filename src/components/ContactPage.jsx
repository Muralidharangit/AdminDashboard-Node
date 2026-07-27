import React, { useState } from 'react'
import { TopBar, TblWrap, Badge } from './Common.jsx'
import { Icons } from './Icons.jsx'

const INITIAL_CONTACTS = [
  { name: 'Sarah Jenkins', email: 'sarah@domain.com', subject: 'Corporate Plan', date: 'Jul 20', status: 'Unread' },
  { name: 'Michael Chen', email: 'mchen@tech.org', subject: 'API Integration Timeout', date: 'Jul 19', status: 'In Progress' },
  { name: 'Elena Rostova', email: 'elena@corp.ru', subject: 'Billing Update', date: 'Jul 17', status: 'Resolved' },
]

export default function ContactPage() {
  const [contacts] = useState(INITIAL_CONTACTS)

  return (
    <div className="space-y-5 animate-fadeIn">
      <TopBar label="View inbound support queries." btnLabel="New Contact" onClick={() => alert('New Contact flow (Backend Integration Required)')} />
      <TblWrap
        heads={['Sender', 'Email', 'Subject', 'Date', 'Status', 'Action']}
        rows={contacts.map((c, i) => (
          <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
            <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{c.name}</td>
            <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{c.email}</td>
            <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">{c.subject}</td>
            <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{c.date}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <Badge label={c.status} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button
                className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer transition-colors"
                onClick={() => alert(`Opening ticket: "${c.subject}"`)}
              >
                {Icons.open} Open
              </button>
            </td>
          </tr>
        ))}
      />
    </div>
  )
}
