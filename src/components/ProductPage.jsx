import React, { useState } from 'react'
import { TopBar, TblWrap, Badge } from './Common.jsx'
import { Icons } from './Icons.jsx'

const INITIAL_PRODUCTS = [
  { code: 'PRD-102', name: 'Analytics Kit', category: 'Software', price: '$129', stock: 'In Stock', qty: 45 },
  { code: 'PRD-103', name: 'Tailwind UI Bundle', category: 'Design', price: '$249', stock: 'In Stock', qty: 18 },
  { code: 'PRD-104', name: 'Security Shield', category: 'Security', price: '$89', stock: 'Low Stock', qty: 4 },
  { code: 'PRD-105', name: 'Dashboard Wireframe', category: 'Templates', price: '$49', stock: 'Out of Stock', qty: 0 },
]

export default function ProductPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)

  const handleDelete = (code) => {
    setProducts(products.filter(p => p.code !== code))
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <TopBar label="Manage your product catalog." btnLabel="Add Product" onClick={() => alert('Add Product flow (Backend Integration Required)')} />
      <TblWrap
        heads={['Code', 'Name', 'Category', 'Price', 'Status', 'Qty', 'Actions']}
        rows={products.map(p => (
          <tr key={p.code} className="hover:bg-neutral-50/50 transition-colors">
            <td className="px-4 py-3 font-mono text-[10px] text-neutral-500 whitespace-nowrap">{p.code}</td>
            <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{p.name}</td>
            <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{p.category}</td>
            <td className="px-4 py-3 font-semibold whitespace-nowrap">{p.price}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <Badge label={p.stock} />
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{p.qty} pcs</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <button
                  className="p-1 text-neutral-500 hover:text-black cursor-pointer transition"
                  title="Edit"
                  onClick={() => alert(`Edit ${p.name} (Backend Integration Required)`)}
                >
                  {Icons.edit}
                </button>
                <button
                  className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer transition"
                  title="Delete"
                  onClick={() => handleDelete(p.code)}
                >
                  {Icons.trash}
                </button>
              </div>
            </td>
          </tr>
        ))}
      />
    </div>
  )
}
