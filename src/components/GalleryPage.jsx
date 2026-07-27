import React, { useState, useEffect } from 'react'
import { Card } from './Common.jsx'
import { Icons } from './Icons.jsx'

export default function GalleryPage() {
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileSize, setFileSize] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [galleries, setGalleries] = useState([])

  const fetchGalleries = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (!res.ok) throw new Error('Failed to fetch gallery assets')
      const data = await res.json()
      setGalleries(data)
    } catch (err) {
      console.error('Error fetching gallery assets:', err)
    }
  }

  useEffect(() => {
    fetchGalleries()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!selectedFile) {
      alert('Please upload an image')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('image', selectedFile)

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save gallery asset')
      }

      setSuccessMsg('✓ Gallery asset successfully saved!')
      fetchGalleries()

      // Reset form after a brief delay
      setTimeout(() => {
        setTitle('')
        setSelectedFile(null)
        setImagePreview(null)
        setFileSize('')
        setSuccessMsg('')
        setLoading(false)
      }, 1500)
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

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

  return (
    <div className="w-full py-4 space-y-6 animate-fadeIn">
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Upload Gallery Asset</h2>
          <p className="text-xs text-neutral-400 mt-1">Specify a title and select an image file to publish to the media gallery.</p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Asset Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Asset Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Homepage Hero Graphic, Product Thumbnail"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
            />
          </div>

          {/* Image File Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Select Image Asset</label>
            <div className="relative border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                required={!imagePreview}
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
                    <p className="text-[10px] text-neutral-400 font-semibold">{fileSize || 'Selected'}</p>
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
          <div className="pt-2 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                Icons.upload
              )}
              {loading ? 'Uploading...' : 'Save Gallery Asset'}
            </button>
          </div>
        </form>
      </Card>

      {/* Media Library Grid Section */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Media Library ({galleries.length})</h2>
          <p className="text-xs text-neutral-400 mt-1">Review all active graphics and image assets stored in the database.</p>
        </div>

        {galleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 space-y-2">
            <div className="text-2xl">🖼️</div>
            <p className="text-xs font-semibold">No assets found in the gallery</p>
            <p className="text-[10px]">Upload your first asset using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleries.map((g) => {
              const imageSrc = g.image || (g.images && g.images[0])
              const displayUrl = imageSrc ? `/uploads/gallery/${imageSrc}` : 'https://placehold.co/300x200?text=No+Image'
              return (
                <div key={g._id} className="group relative border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 hover:border-neutral-400 hover:shadow-sm transition-all duration-300">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 relative">
                    <img 
                      src={displayUrl} 
                      alt={g.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x200?text=Load+Error'
                      }}
                    />
                  </div>
                  <div className="p-3 bg-white space-y-1">
                    <p className="text-xs font-bold text-neutral-900 truncate" title={g.title}>{g.title}</p>
                    <p className="text-[9px] text-neutral-400 truncate font-mono">{imageSrc || 'unknown'}</p>
                    <p className="text-[9px] text-neutral-400">
                      {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
