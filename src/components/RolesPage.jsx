import React, { useState, useEffect } from 'react'
import { Card, TblWrap, TopBar } from './Common.jsx'
import { Icons } from './Icons.jsx'

const ROLES_INFO = [
  { role: 'Super Admin', desc: 'Full root access to all system modules.', perms: { Read: true, Write: true, Delete: true, Publish: true } },
  { role: 'Editor', desc: 'Create and modify content and products.', perms: { Read: true, Write: true, Delete: false, Publish: false } },
  { role: 'Viewer', desc: 'Read-only access to dashboard metrics.', perms: { Read: true, Write: false, Delete: false, Publish: false } },
]

export default function RolesPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Viewer')
  const [category, setCategory] = useState('Product Catalog')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      if (data.success || Array.isArray(data.users)) {
        setUsers(data.users || data)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Please fill out all fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, category }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign role & category')
      }

      setSuccessMsg(`✓ User "${name}" successfully created with role "${role}"!`)
      fetchUsers()

      // Reset form
      setName('')
      setEmail('')
      setPassword('')
      setRole('Viewer')
      setCategory('Product Catalog')
      setShowForm(false)

      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete user')

      setSuccessMsg('✓ User deleted successfully!')
      fetchUsers()
      setTimeout(() => setSuccessMsg(''), 2000)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleUpdateUser = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update user')

      setSuccessMsg('✓ User updated successfully!')
      fetchUsers()
      setTimeout(() => setSuccessMsg(''), 2000)
    } catch (error) {
      alert(error.message)
    }
  }

  // Count active users for each role
  const getRoleUserCount = (roleName) => {
    return users.filter(u => u.role === roleName).length
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header */}
      <TopBar
        label="Configure system access, roles, and resource categories."
        btnLabel={showForm ? 'Hide Form' : 'Assign New Role'}
        onClick={() => setShowForm(!showForm)}
      />

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES_INFO.map((r, i) => (
          <Card key={i} className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                  {Icons.key}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{r.role}</h3>
                  <p className="text-[10px] text-neutral-500">{getRoleUserCount(r.role)} active users</p>
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
          </Card>
        ))}
      </div>

      {/* Assign New User / Role Form */}
      {showForm && (
        <Card className="p-6 md:p-8 space-y-6 animate-slideDown">
          <div className="border-b border-neutral-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Create & Assign User</h2>
              <p className="text-xs text-neutral-400 mt-1">Specify user credentials, role type, and assigned category.</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-neutral-500 hover:text-neutral-950 font-bold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
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
                  placeholder="e.g. jane@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type / Role Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">User Type (Role)</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-semibold"
                >
                  <option value="Super Admin">Super Admin (Full Root Access)</option>
                  <option value="Editor">Editor (Write / Modify Content)</option>
                  <option value="Viewer">Viewer (Read Only Access)</option>
                </select>
              </div>

              {/* Category Assignment */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Assign Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-semibold"
                >
                  <option value="Product Catalog">Product Catalog</option>
                  <option value="Gallery & Storage">Gallery & Storage</option>
                  <option value="DB Engine">DB Engine</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="pt-2 border-t border-neutral-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  Icons.plus
                )}
                {submitting ? 'Saving...' : 'Create & Assign User'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* User Assignment List */}
      <div className="space-y-3">
        <div className="border-b border-neutral-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Active User Permissions</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">List of active users, their roles (type), and assigned resource categories.</p>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-5 w-5 border-2 border-neutral-950/20 border-t-neutral-950 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <Card className="p-8 text-center text-neutral-400 flex flex-col items-center justify-center space-y-2">
            <div className="text-2xl">👥</div>
            <p className="text-xs font-semibold">No assigned users found</p>
            <p className="text-[10px]">Create an administrative user assignment to populate this list.</p>
          </Card>
        ) : (
          <TblWrap
            heads={['Name', 'Email Address', 'Type (Role)', 'Assigned Category', 'Created Date', 'Actions']}
            rows={users.map((u) => (
              <tr key={u._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{u.name}</td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <select
                    value={u.role || 'Viewer'}
                    onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                    className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase outline-none cursor-pointer focus:ring-1 focus:ring-neutral-400 bg-white ${
                      u.role === 'Super Admin' 
                        ? 'border-purple-200 text-purple-700 bg-purple-50' 
                        : u.role === 'Editor' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50' 
                        : 'border-neutral-200 text-neutral-600 bg-neutral-50'
                    }`}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <select
                    value={u.category || 'Product Catalog'}
                    onChange={(e) => handleUpdateUser(u._id, { category: e.target.value })}
                    className="inline-block px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-[10px] text-neutral-600 font-semibold outline-none cursor-pointer focus:ring-1 focus:ring-neutral-400"
                  >
                    <option value="Product Catalog">Product Catalog</option>
                    <option value="Gallery & Storage">Gallery & Storage</option>
                    <option value="DB Engine">DB Engine</option>
                    <option value="General Support">General Support</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap font-mono text-[10px]">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(u._id, u.name)}
                    className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer transition"
                    title="Delete User"
                  >
                    {Icons.trash}
                  </button>
                </td>
              </tr>
            ))}
          />
        )}
      </div>
    </div>
  )
}
