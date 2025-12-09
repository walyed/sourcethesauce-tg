import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  image_url: string | null
  is_active: boolean
  sort_order: number
  category_id: string
}

interface EditSubcategoryPageProps {
  subcategory: Subcategory
  categories: Category[]
}

export default function EditSubcategoryPage({ subcategory, categories }: EditSubcategoryPageProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: subcategory.name,
    slug: subcategory.slug,
    category_id: subcategory.category_id,
    image_url: subcategory.image_url || '',
    is_active: subcategory.is_active,
    sort_order: subcategory.sort_order,
  })

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
      const fileName = `subcategories/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

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
    setIsLoading(true)
    setError('')

    try {
      if (!formData.name.trim()) throw new Error('Subcategory name is required')
      if (!formData.slug.trim()) throw new Error('Slug is required')
      if (!formData.category_id) throw new Error('Please select a parent category')

      const { error: updateError } = await supabase
        .from('subcategories')
        .update({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          category_id: formData.category_id,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        })
        .eq('id', subcategory.id)

      if (updateError) throw updateError

      router.push('/admin/subcategories')
    } catch (err: any) {
      setError(err.message || 'Failed to update subcategory')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this subcategory? Products in this subcategory will be unassigned.')) return
    
    setIsLoading(true)
    try {
      // Unassign products
      await supabase.from('products').update({ subcategory_id: null }).eq('subcategory_id', subcategory.id)
      
      // Delete subcategory
      const { error } = await supabase.from('subcategories').delete().eq('id', subcategory.id)
      
      if (error) throw error
      
      router.push('/admin/subcategories')
    } catch (err: any) {
      setError(err.message || 'Failed to delete subcategory')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Edit Subcategory | Admin</title>
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#1a1a2e',
          color: '#fff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/admin/subcategories" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
              ← Back
            </Link>
            <h1 style={{ margin: 0, fontSize: 20 }}>Edit Subcategory</h1>
          </div>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#c62828',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              cursor: isLoading ? 'wait' : 'pointer'
            }}
          >
            Delete Subcategory
          </button>
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
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Subcategory Information</h2>
                
                {/* Parent Category */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Parent Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box',
                      backgroundColor: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter subcategory name"
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
                    placeholder="subcategory-slug"
                  />
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#999' }}>
                    URL-friendly identifier
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    min={0}
                    style={{
                      width: 120,
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  />
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#999' }}>
                    Lower numbers appear first
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontWeight: 500 }}>Active</span>
                  </label>
                  <p style={{ margin: '4px 0 0 26px', fontSize: 13, color: '#999' }}>
                    Inactive subcategories won't be shown to customers
                  </p>
                </div>
              </div>

              {/* Image Section */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Subcategory Image</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {formData.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={formData.image_url}
                        alt="Subcategory"
                        style={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          padding: '8px 16px',
                          backgroundColor: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      style={{
                        width: '100%',
                        padding: 40,
                        border: '2px dashed #ddd',
                        borderRadius: 8,
                        backgroundColor: '#fafafa',
                        cursor: isUploading ? 'wait' : 'pointer',
                        fontSize: 14,
                        color: '#666'
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </button>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
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

              {/* Submit */}
              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#1a1a2e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer'
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/admin/subcategories"
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#fff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  Cancel
                </Link>
              </div>
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
                <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#666' }}>Preview</h3>
                
                <div style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5'
                }}>
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      height: 160,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      No image
                    </div>
                  )}
                  
                  <div style={{ padding: 16 }}>
                    <p style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 16
                    }}>
                      {formData.name || 'Subcategory Name'}
                    </p>
                    <p style={{
                      margin: '4px 0 0',
                      fontSize: 13,
                      color: '#999',
                    }}>
                      /{formData.slug || 'subcategory-slug'}
                    </p>
                    {formData.category_id && (
                      <p style={{
                        margin: '8px 0 0',
                        fontSize: 12,
                        color: '#2e7d32',
                        backgroundColor: '#e8f5e9',
                        padding: '4px 10px',
                        borderRadius: 100,
                        display: 'inline-block'
                      }}>
                        {categories.find(c => c.id === formData.category_id)?.name || 'Category'}
                      </p>
                    )}
                  </div>
                </div>

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

export const getServerSideProps: GetServerSideProps<EditSubcategoryPageProps> = async ({ params }) => {
  const id = params?.id as string

  const [{ data: subcategory }, { data: categories }] = await Promise.all([
    supabase.from('subcategories').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('sort_order'),
  ])

  if (!subcategory) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      subcategory,
      categories: categories || [],
    }
  }
}
