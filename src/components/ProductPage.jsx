import React, { useState, useEffect } from 'react'
import { Card, TopBar, TblWrap } from './Common.jsx'
import { Icons } from './Icons.jsx'

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileSize, setFileSize] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image file under 2MB for storage performance.')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
        setFileSize(`${sizeInMb} MB`)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditClick = (p) => {
    setEditingId(p._id)
    setTitle(p.title)
    setSelectedFile(null)
    setImagePreview(p.image ? `/uploads/gallery/${p.image}` : null)
    setFileSize('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete product')
      
      setSuccessMsg('✓ Product deleted successfully!')
      fetchProducts()
      setTimeout(() => setSuccessMsg(''), 2000)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setSelectedFile(null)
    setImagePreview(null)
    setFileSize('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a product title')
      return
    }
    if (!editingId && !selectedFile) {
      alert('Please upload a product image')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    try {
      let url = '/api/products'
      let method = 'POST'
      if (editingId) {
        url = `/api/products/${editingId}`
        method = 'PUT'
      }

      const res = await fetch(url, {
        method,
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save product')
      }

      setSuccessMsg(editingId ? '✓ Product updated successfully!' : '✓ Product created successfully!')
      fetchProducts()

      setTimeout(() => {
        handleCancel()
        setSuccessMsg('')
        setLoading(false)
      }, 1500)
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <TopBar
        label="Manage your product catalog."
        btnLabel={showForm ? 'Hide Form' : 'Add Product'}
        onClick={() => {
          if (showForm) {
            handleCancel()
          } else {
            setShowForm(true)
          }
        }}
      />

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {showForm && (
        <Card className="p-6 md:p-8 space-y-6 animate-slideDown">
          <div className="border-b border-neutral-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {editingId ? 'Modify the product details and save changes.' : 'Specify a title and select a product image to add it to the catalog.'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="text-xs text-neutral-500 hover:text-neutral-950 font-bold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Title */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Premium Aviator API Access, Analytics Suite"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
              />
            </div>

            {/* Product Image File Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Product Image</label>
              <div className="relative border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  required={!editingId && !imagePreview}
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {!imagePreview ? (
                  <div className="space-y-2">
                    <div className="mx-auto h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400">
                      {Icons.plus}
                    </div>
                    <p className="text-xs text-neutral-500 font-semibold">Click to select image file</p>
                    <p className="text-[10px] text-neutral-400">PNG, JPG, SVG, or GIF (Max 2MB)</p>
                  </div>
                ) : (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <img src={imagePreview} alt="Upload Preview" className="h-36 w-auto object-cover rounded-lg border border-neutral-200 shadow-sm" />
                    <div className="text-center">
                      <p className="text-[10px] text-neutral-400 font-semibold">{fileSize || (editingId ? 'Current Image' : 'Selected')}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                          setImagePreview(null)
                          setFileSize('')
                        }}
                        className="mt-1 text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Remove and choose another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 border-t border-neutral-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  editingId ? Icons.edit : Icons.plus
                )}
                {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
              </button>
            </div>
          </form>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center space-y-2">
          <div className="text-3xl">📦</div>
          <p className="text-xs font-semibold">No products found in the catalog</p>
          <p className="text-[10px]">Add your first product using the button above.</p>
        </Card>
      ) : (
        <TblWrap
          heads={['Preview', 'Product Title', 'File Name', 'Created At', 'Actions']}
          rows={products.map((p) => {
            const imageSrc = p.image || (p.images && p.images[0])
            const displayUrl = imageSrc ? `/uploads/gallery/${imageSrc}` : 'https://placehold.co/100x70?text=No+Image'
            return (
              <tr key={p._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <img
                    src={displayUrl}
                    alt={p.title}
                    className="h-10 w-14 object-cover rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x70?text=Load+Error'
                    }}
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{p.title}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-neutral-400 whitespace-nowrap truncate max-w-[150px]" title={imageSrc}>
                  {imageSrc || 'N/A'}
                </td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer transition"
                      title="Edit"
                      onClick={() => handleEditClick(p)}
                    >
                      {Icons.edit}
                    </button>
                    <button
                      className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer transition"
                      title="Delete"
                      onClick={() => handleDelete(p._id, p.title)}
                    >
                      {Icons.trash}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        />
      )}
    </div>
  )
}
