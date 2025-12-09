import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  category_id: string
}

export default function AdminNewProduct() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [images, setImages] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    compare_at_price: '',
    sku: '',
    category_id: '',
    subcategory_id: '',
    is_active: true,
    is_featured: false,
    is_new: true,
  })

  // Fetch categories and subcategories on mount
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cats }, { data: subcats }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('sort_order'),
        supabase.from('subcategories').select('id, name, category_id').eq('is_active', true).order('sort_order'),
      ])
      if (cats) setCategories(cats)
      if (subcats) setSubcategories(subcats)
    }
    fetchData()
  }, [])

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    sub => sub.category_id === formData.category_id
  )

  // Reset subcategory when category changes
  const handleCategoryChange = (categoryId: string) => {
    setFormData({ 
      ...formData, 
      category_id: categoryId,
      subcategory_id: '' // Reset subcategory
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError('')

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only image files')
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Each image must be less than 5MB')
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
            throw new Error('Storage bucket "images" not configured. Please create it in Supabase Storage.')
          }
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)

        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages([...images, ...uploadedUrls])
    } catch (err: any) {
      setError(err.message || 'Failed to upload images')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.category_id) throw new Error('Please select a category')
      if (!formData.subcategory_id) throw new Error('Please select a subcategory')

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          sku: formData.sku,
          category_id: formData.category_id,
          subcategory_id: formData.subcategory_id,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
        })
        .select()
        .single()

      if (productError) throw productError

      // Add images if any
      if (images.length > 0) {
        const imageRecords = images.map((url, index) => ({
          product_id: product.id,
          url: url,
          position: index,
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords)

        if (imagesError) {
          console.error('Failed to save images:', imagesError)
        }
      }

      // Redirect to edit page to add variants
      router.push(`/admin/products/${product.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === formData.category_id)

  return (
    <>
      <Head>
        <title>New Product | Admin</title>
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
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
            ← Back
          </Link>
          <h1 style={{ margin: 0, fontSize: 20 }}>New Product</h1>
        </header>

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Basic Information</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Product Name *
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
                    placeholder="Enter product name"
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      fontSize: 14,
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter product description"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="e.g. PROD-001"
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Subcategory *
                    </label>
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                      required
                      disabled={!formData.category_id}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        backgroundColor: formData.category_id ? '#fff' : '#f5f5f5',
                        cursor: formData.category_id ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <option value="">
                        {formData.category_id ? 'Select a subcategory' : 'Select a category first'}
                      </option>
                      {filteredSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                    {formData.category_id && filteredSubcategories.length === 0 && (
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#f57c00' }}>
                        No subcategories for this category. <Link href="/admin/subcategories/new" style={{ color: '#1976d2' }}>Create one</Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Product Images</h2>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: 12,
                    padding: 32,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    marginBottom: images.length > 0 ? 16 : 0,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = '#007aff')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ddd')}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                    {isUploading ? 'Uploading...' : 'Click to upload images'}
                  </p>
                  <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>
                    PNG, JPG, GIF up to 5MB each. First image will be primary.
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />

                {images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 12
                  }}>
                    {images.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          style={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: index === 0 ? '3px solid #007aff' : '1px solid #ddd',
                          }}
                        />
                        {index === 0 && (
                          <span style={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            backgroundColor: '#007aff',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                          }}>
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: '#ff3b30',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Pricing</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Selling Price (£) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Compare at Price (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.compare_at_price}
                      onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                    <small style={{ color: '#666', marginTop: 4, display: 'block' }}>
                      Original price for sale display
                    </small>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Cost Price (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                    <small style={{ color: '#666', marginTop: 4, display: 'block' }}>
                      For profit tracking (not shown to customers)
                    </small>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24
              }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Settings</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>Product is active and visible to customers</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>Feature this product on homepage</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      style={{ width: 20, height: 20 }}
                    />
                    <span>Show "New" badge on product</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isUploading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#1a1a2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Creating...' : 'Create Product'}
              </button>

              <p style={{ marginTop: 16, color: '#666', fontSize: 14, textAlign: 'center' }}>
                After creating, you&apos;ll be able to add variants (colors, sizes) on the edit page.
              </p>
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
                  This is how the product will appear to customers
                </p>
                
                {/* Product Card Preview */}
                <div style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  <div style={{
                    width: '100%',
                    height: 220,
                    backgroundColor: '#e0e0e0',
                    backgroundImage: images[0] ? `url(${images[0]})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {!images[0] && (
                      <span style={{ color: '#999', fontSize: 14 }}>No image</span>
                    )}
                    {/* Badges */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      display: 'flex',
                      gap: 6,
                      flexDirection: 'column',
                    }}>
                      {formData.is_new && (
                        <span style={{
                          backgroundColor: '#007aff',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          NEW
                        </span>
                      )}
                      {formData.compare_at_price && parseFloat(formData.compare_at_price) > parseFloat(formData.price || '0') && (
                        <span style={{
                          backgroundColor: '#ff3b30',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          SALE
                        </span>
                      )}
                    </div>
                    {/* Wishlist button */}
                    <button style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                      ♡
                    </button>
                  </div>
                  <div style={{ padding: 16 }}>
                    {selectedCategory && (
                      <p style={{
                        margin: '0 0 4px',
                        fontSize: 12,
                        color: '#666',
                        textTransform: 'uppercase',
                      }}>
                        {selectedCategory.name}
                      </p>
                    )}
                    <h3 style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: formData.name ? '#1a1a2e' : '#ccc',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {formData.name || 'Product Name'}
                    </h3>
                    <div style={{
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <span style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#1a1a2e',
                      }}>
                        £{formData.price || '0.00'}
                      </span>
                      {formData.compare_at_price && parseFloat(formData.compare_at_price) > parseFloat(formData.price || '0') && (
                        <span style={{
                          fontSize: 14,
                          color: '#999',
                          textDecoration: 'line-through',
                        }}>
                          £{formData.compare_at_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
                  {formData.is_featured && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: '#fff3e0',
                      color: '#ef6c00',
                    }}>
                      Featured
                    </span>
                  )}
                  {formData.is_new && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                    }}>
                      New
                    </span>
                  )}
                </div>

                {/* Profit Calculator */}
                {formData.price && formData.cost_price && (
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                      Profit per sale: <strong style={{ color: '#2e7d32' }}>
                        £{(parseFloat(formData.price) - parseFloat(formData.cost_price)).toFixed(2)}
                      </strong>
                      {' '}({((parseFloat(formData.price) - parseFloat(formData.cost_price)) / parseFloat(formData.price) * 100).toFixed(0)}% margin)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
