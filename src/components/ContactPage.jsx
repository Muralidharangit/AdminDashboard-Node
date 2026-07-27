import React, { useState, useEffect } from 'react'
import { Card, TblWrap, Badge } from './Common.jsx'
import { Icons } from './Icons.jsx'

export default function ContactPage() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const getContacts = async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      if (data.success) {
        setContacts(data.data)
      }
    } catch (err) {
      console.log('Error fetching contacts:', err)
    }
  }

  useEffect(() => {
    getContacts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccessMsg('Contact submitted successfully!')
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        getContacts()

        setTimeout(() => {
          setSuccessMsg('')
        }, 2500)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        getContacts()
      }
    } catch (err) {
      console.log('Error updating contact status:', err)
    }
  }

  const handleOpenTicket = (c) => {
    alert(`Sender: ${c.name}\nEmail: ${c.email}\nSubject: ${c.subject}\nMessage: ${c.message || 'No message content'}`)
    if (c.status === 'Unread') {
      handleStatusChange(c._id, 'In Progress')
    }
  }

  return (
    <div className="w-full py-4 space-y-6 animate-fadeIn">
      {/* Contact Form Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Submit Support Query</h2>
          <p className="text-xs text-neutral-400 mt-1">Submit a new support inquiry or general contact request.</p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Sender Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. sarah@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Corporate Plan Consultation"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Message Inquiry</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your inquiry or support ticket detail here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-sm"
            >
              {Icons.plus} Submit support ticket
            </button>
          </div>
        </form>
      </Card>

      {/* Inbound Queries Table Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Inbound Support Queries ({contacts.length})</h2>
          <p className="text-xs text-neutral-400 mt-1">Review active support tickets, change their operational status, or reply.</p>
        </div>

        <TblWrap
          heads={['Sender', 'Email', 'Subject', 'Date', 'Status', 'Actions']}
          rows={contacts.map((c) => (
            <tr key={c._id} className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-100 last:border-b-0">
              <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{c.name}</td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{c.email}</td>
              <td className="px-4 py-3 text-neutral-700 whitespace-nowrap max-w-[200px] truncate" title={c.subject}>
                {c.subject}
              </td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                }) : 'N/A'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge label={c.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 hover:text-black cursor-pointer transition-colors"
                    onClick={() => handleOpenTicket(c)}
                  >
                    {Icons.open || '👁️'} Open
                  </button>
                  {c.status !== 'Resolved' && (
                    <button
                      className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer transition-colors"
                      onClick={() => handleStatusChange(c._id, 'Resolved')}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        />
      </Card>
    </div>
  )
}
