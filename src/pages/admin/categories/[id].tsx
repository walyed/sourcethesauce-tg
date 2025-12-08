import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    image_url: string | null
    is_active: boolean
    sort_order: number
  }
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!category

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    image_url: category?.image_url || '',
    is_active: category?.is_active ?? true,
    sort_order: category?.sort_order || 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: !isEditing ? generateSlug(name) : formData.slug
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `categories/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
          setError('Storage bucket "images" not configured. Please create it in Supabase Storage, or enter a URL manually below.')
          return
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (!formData.name.trim()) throw new Error('Category name is required')
      if (!formData.slug.trim()) throw new Error('Slug is required')

      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order || 0,
      }

      if (isEditing && category) {
        const { error: updateError } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id)

        if (updateError) throw updateError
      } else {
        const { error: createError } = await supabase
          .from('categories')
          .insert(categoryData)

        if (createError) throw createError
      }

      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit Category' : 'Add Category'} | Admin Dashboard</title>
      </Head>
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#1a1a2e',
          color: '#fff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <Link href="/admin/categories" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
            ← Back
          </Link>
          <h1 style={{ margin: 0, fontSize: 20 }}>{isEditing ? 'Edit Category' : 'New Category'}</h1>
        </header>

        <main style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
          {error && (
            <div style={{
              padding: 16,
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: 8,
              color: '#c00',
              marginBottom: 24
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Category Information</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter category name"
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="category-slug"
                  />
                  <small style={{ color: '#666', marginTop: 4, display: 'block' }}>
                    URL-friendly identifier (auto-generated from name)
                  </small>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0"
                  />
                  <small style={{ color: '#666', marginTop: 4, display: 'block' }}>
                    Lower numbers appear first
                  </small>
                </div>
              </div>

              {/* Image Upload Section */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Category Image</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Upload Image
                  </label>
                  
                  {!formData.image_url ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #ddd',
                        borderRadius: 12,
                        padding: 40,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = '#007aff')}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ddd')}
                    >
                      <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                      <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                        {isUploading ? 'Uploading...' : 'Click to upload an image'}
                      </p>
                      <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={formData.image_url}
                        alt="Category"
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 12,
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: '#ff3b30',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#666' }}>
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Settings */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Settings</h2>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ width: 20, height: 20 }}
                  />
                  <span>Category is active and visible to customers</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#1a1a2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
              </button>
            </form>

            {/* Preview Card */}
            <div>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                position: 'sticky',
                top: 24
              }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Card Preview</h2>
                <p style={{ margin: '0 0 16px', color: '#666', fontSize: 14 }}>
                  This is how the category will appear to customers
                </p>
                
                {/* Category Card Preview */}
                <div style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  <div style={{
                    width: '100%',
                    height: 180,
                    backgroundColor: '#e0e0e0',
                    backgroundImage: formData.image_url ? `url(${formData.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {!formData.image_url && (
                      <span style={{ color: '#999', fontSize: 14 }}>No image</span>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 600,
                      color: formData.name ? '#1a1a2e' : '#ccc',
                    }}>
                      {formData.name || 'Category Name'}
                    </h3>
                    <p style={{
                      margin: '4px 0 0',
                      fontSize: 13,
                      color: '#999',
                    }}>
                      /{formData.slug || 'category-slug'}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: formData.is_active ? '#e8f5e9' : '#ffebee',
                    color: formData.is_active ? '#2e7d32' : '#c62828',
                  }}>
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                  }}>
                    Sort: {formData.sort_order}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<CategoryFormProps> = async ({ params }) => {
  const id = params?.id as string

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      category,
    }
  }
}
