import React, { useState, useEffect } from 'react'
import { Card } from './Common.jsx'
import { Icons } from './Icons.jsx'

export default function BlogPage() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (!res.ok) throw new Error('Failed to fetch blogs')
      const data = await res.json()
      if (data.success) {
        setBlogs(data.data)
      }
    } catch (err) {
      console.error('Error fetching blogs:', err)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a blog title')
      return
    }
    if (!desc.trim()) {
      alert('Please enter the blog description paragraph')
      return
    }
    if (!imagePreview) {
      alert('Please upload a cover image')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: desc,
          coverImage: imagePreview,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to publish blog post')
      }

      setSuccessMsg('✓ Blog post successfully published!')
      fetchBlogs()

      // Reset form after a brief delay
      setTimeout(() => {
        setTitle('')
        setDesc('')
        setImagePreview(null)
        setSuccessMsg('')
        setLoading(false)
      }, 1500)
    } catch (err) {
      alert(err.message)
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
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full py-4 space-y-6 animate-fadeIn">
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Create Blog Post</h2>
          <p className="text-xs text-neutral-400 mt-1">Fill out the fields below and select a cover image to create an article post.</p>
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
          {/* Blog Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Article Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Navigating modern state management patterns"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Cover Image</label>
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
                  <p className="text-xs text-neutral-500 font-semibold">Click to select cover image</p>
                  <p className="text-[10px] text-neutral-400">PNG, JPG, SVG, or GIF (Max 2MB)</p>
                </div>
              ) : (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <img src={imagePreview} alt="Cover Preview" className="h-36 w-auto object-cover rounded-lg border border-neutral-200 shadow-sm" />
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
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

          {/* Blog Description Paragraph */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Article Description Paragraph</label>
            <textarea
              required
              rows={5}
              placeholder="Write a clear, descriptive overview paragraph summarizing this blog article..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium resize-none"
            />
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
                Icons.blog
              )}
              {loading ? 'Publishing...' : 'Publish Blog Post'}
            </button>
          </div>
        </form>
      </Card>

      {/* Published Blogs Section */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Published Articles ({blogs.length})</h2>
          <p className="text-xs text-neutral-400 mt-1">Manage and read published articles and news items.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 space-y-2">
            <div className="text-2xl">📝</div>
            <p className="text-xs font-semibold">No published articles yet</p>
            <p className="text-[10px]">Create your first post using the editor above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div key={b._id} className="group border border-neutral-200 rounded-xl overflow-hidden bg-white hover:border-neutral-400 hover:shadow-sm transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 relative">
                  <img 
                    src={b.coverImage} 
                    alt={b.title}
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=Load+Error'
                    }}
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-neutral-900 line-clamp-2" title={b.title}>
                      {b.title}
                    </h3>
                    <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-3">
                      {b.description}
                    </p>
                  </div>
                  <div className="text-[9px] text-neutral-400 pt-2 border-t border-neutral-50">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
