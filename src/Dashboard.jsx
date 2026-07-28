import React, { useState } from 'react'
import { Icons } from './components/Icons.jsx'
import DashboardHome from './components/DashboardHome.jsx'
import GalleryPage from './components/GalleryPage.jsx'
import ProductPage from './components/ProductPage.jsx'
import BlogPage from './components/BlogPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import RolesPage from './components/RolesPage.jsx'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',          icon: Icons.dashboard },
  { id: 'gallery',   label: 'Gallery',            icon: Icons.gallery   },
  { id: 'product',   label: 'Product',            icon: Icons.product   },
  { id: 'blog',      label: 'Blog Posts',         icon: Icons.blog      },
  { id: 'contact',   label: 'Contact Inquiries',  icon: Icons.contact   },
  { id: 'roles',     label: 'Roles & Permission', icon: Icons.roles     },
]

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard')
  const [open, setOpen] = useState(false)
  const init = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const SideLinks = () => (
    <nav className="space-y-0.5">
      {NAV.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => {
            setTab(id)
            setOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            tab === id ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>
  )

  const SideUser = () => (
    <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-8 w-8 rounded-full bg-neutral-950 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {init(user?.name)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-900 truncate">{user?.name || 'Admin'}</p>
          <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
          {(user?.role || user?.category) && (
            <div className="flex flex-col gap-0.5 mt-1">
              {user?.role && (
                <span className="text-[8px] px-1 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-700 rounded font-semibold uppercase w-max">
                  {user.role}
                </span>
              )}
              {user?.category && (
                <span className="text-[8px] px-1 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-500 rounded font-medium w-max truncate max-w-[120px]">
                  {user.category}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onLogout}
        title="Logout"
        className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer transition shrink-0"
      >
        {Icons.logout}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-neutral-50 font-sans antialiased text-sm text-neutral-800">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 bg-white border-r border-neutral-200 flex-col justify-between">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm text-neutral-900">AdminPanel</span>
          </div>
          <SideLinks />
        </div>
        <SideUser />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-[240px] bg-white border-r border-neutral-200 flex flex-col justify-between shadow-xl">
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-900">AdminPanel</span>
                <button onClick={() => setOpen(false)} className="p-1 text-neutral-500 cursor-pointer text-lg">
                  ✕
                </button>
              </div>
              <SideLinks />
            </div>
            <SideUser />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-neutral-200 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
            >
              {Icons.menu}
            </button>
            <h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              {NAV.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live
          </span>
        </header>

        {/* Inner Content Component Render */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-5">
          {tab === 'dashboard' && <DashboardHome />}
          {tab === 'gallery' && <GalleryPage />}
          {tab === 'product' && <ProductPage />}
          {tab === 'blog' && <BlogPage />}
          {tab === 'contact' && <ContactPage />}
          {tab === 'roles' && <RolesPage />}
        </main>
      </div>
    </div>
  )
}
