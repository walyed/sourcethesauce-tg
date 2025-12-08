import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Category { id: string; name: string }
interface ProductVariant { id?: string; colour: string; colour_hex: string; size: string; stock_quantity: number }

interface ProductFormProps {
  categories: Category[]
  product: {
    id: string; name: string; sku: string; description: string; price: number
    cost_price: number | null; compare_at_price: number | null; category_id: string
    is_active: boolean; is_new: boolean; is_featured: boolean
    images: string[]; variants: ProductVariant[]
  }
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: product.name || '', sku: product.sku || '', description: product.description || '',
    price: product.price?.toString() || '', cost_price: product.cost_price?.toString() || '',
    compare_at_price: product.compare_at_price?.toString() || '', category_id: product.category_id || '',
    is_active: product.is_active ?? true, is_new: product.is_new ?? false, is_featured: product.is_featured ?? false,
  })

  const [variants, setVariants] = useState<ProductVariant[]>(product.variants?.length ? product.variants : [{ colour: '', colour_hex: '#000000', size: '', stock_quantity: 0 }])
  const [images, setImages] = useState<string[]>(product.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setIsUploading(true); setError('')
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) throw new Error('Please select only image files')
        if (file.size > 5 * 1024 * 1024) throw new Error('Each image must be less than 5MB')
        const fileExt = file.name.split('.').pop()
        const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600', upsert: false })
        if (uploadError) { if (uploadError.message.includes('Bucket not found')) throw new Error('Storage bucket "images" not configured.'); throw uploadError }
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)
        return publicUrl
      })
      const uploadedUrls = await Promise.all(uploadPromises)
      setImages([...images, ...uploadedUrls])
    } catch (err: any) { setError(err.message || 'Failed to upload images') }
    finally { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index))
  const handleVariantChange = (index: number, field: string, value: string | number) => { setVariants(prev => { const updated = [...prev]; updated[index] = { ...updated[index], [field]: value }; return updated }) }
  const addVariant = () => setVariants([...variants, { colour: '', colour_hex: '#000000', size: '', stock_quantity: 0 }])
  const removeVariant = (index: number) => variants.length > 1 && setVariants(variants.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setError('')
    try {
      if (!formData.name.trim()) throw new Error('Product name is required')
      if (!formData.sku.trim()) throw new Error('SKU is required')
      if (!formData.price || parseFloat(formData.price) <= 0) throw new Error('Valid price is required')

      const productData = {
        name: formData.name.trim(), sku: formData.sku.trim(), description: formData.description.trim(),
        price: parseFloat(formData.price), cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        category_id: formData.category_id || null, is_active: formData.is_active, is_new: formData.is_new, is_featured: formData.is_featured,
      }

      const { error: updateError } = await supabase.from('products').update(productData).eq('id', product.id)
      if (updateError) throw updateError

      await supabase.from('product_variants').delete().eq('product_id', product.id)
      await supabase.from('product_images').delete().eq('product_id', product.id)

      const validVariants = variants.filter(v => v.colour || v.size)
      if (validVariants.length > 0) {
        await supabase.from('product_variants').insert(validVariants.map(v => ({ product_id: product.id, colour: v.colour, colour_hex: v.colour_hex, size: v.size })))
      }
      if (images.length > 0) {
        await supabase.from('product_images').insert(images.map((url, i) => ({ product_id: product.id, url: url, position: i })))
      }
      router.push('/admin/products')
    } catch (err: any) { setError(err.message || 'Failed to save product') }
    finally { setIsSubmitting(false) }
  }

  const selectedCategory = categories.find(c => c.id === formData.category_id)

  return (
    <>
      <Head><title>Edit Product | Admin</title></Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <header style={{ backgroundColor: '#1a1a2e', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>← Back</Link>
          <h1 style={{ margin: 0, fontSize: 20 }}>Edit Product</h1>
        </header>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
          {error && <div style={{ padding: 16, backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: 8, color: '#c00', marginBottom: 24 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Basic Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Product Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="Enter product name" /></div>
                  <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>SKU *</label>
                    <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="e.g. PROD-001" /></div>
                </div>
                <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} placeholder="Enter product description" /></div>
                <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Category</label>
                  <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', backgroundColor: '#fff' }}>
                    <option value="">Select a category</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select></div>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Product Images</h2>
                <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed #ddd', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', marginBottom: images.length > 0 ? 16 : 0 }} onMouseOver={(e) => (e.currentTarget.style.borderColor = '#007aff')} onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ddd')}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{isUploading ? 'Uploading...' : 'Click to upload images'}</p>
                  <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>PNG, JPG, GIF up to 5MB each</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                {images.length > 0 && (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                  {images.map((url, index) => (<div key={index} style={{ position: 'relative' }}>
                    <img src={url} alt={`Product ${index + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, border: index === 0 ? '3px solid #007aff' : '1px solid #ddd' }} />
                    {index === 0 && <span style={{ position: 'absolute', top: 4, left: 4, backgroundColor: '#007aff', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>Primary</span>}
                    <button type="button" onClick={() => handleRemoveImage(index)} style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', backgroundColor: '#ff3b30', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>))}
                </div>)}
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Pricing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Selling Price (£) *</label>
                    <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="0.00" /></div>
                  <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Compare at Price (£)</label>
                    <input type="number" step="0.01" min="0" value={formData.compare_at_price} onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="0.00" /></div>
                  <div><label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Cost Price (£)</label>
                    <input type="number" step="0.01" min="0" value={formData.cost_price} onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="0.00" /></div>
                </div>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Variants (Colors & Sizes)</h2>
                {variants.map((variant, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 80px 40px', gap: 12, alignItems: 'end', marginBottom: 12, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                    <div><label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#666' }}>Color</label><input type="text" value={variant.colour} onChange={(e) => handleVariantChange(index, 'colour', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} placeholder="e.g. Black" /></div>
                    <div><label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#666' }}>Hex</label><input type="color" value={variant.colour_hex} onChange={(e) => handleVariantChange(index, 'colour_hex', e.target.value)} style={{ width: '100%', height: 38, padding: 2, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#666' }}>Size</label><input type="text" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} placeholder="e.g. M" /></div>
                    <div><label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#666' }}>Stock</label><input type="number" min="0" value={variant.stock_quantity} onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} /></div>
                    <button type="button" onClick={() => removeVariant(index)} disabled={variants.length === 1} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: variants.length === 1 ? '#f5f5f5' : '#ffebee', color: variants.length === 1 ? '#ccc' : '#c62828', border: 'none', cursor: variants.length === 1 ? 'not-allowed' : 'pointer', fontSize: 16 }}>×</button>
                  </div>
                ))}
                <button type="button" onClick={addVariant} style={{ padding: '10px 16px', backgroundColor: '#f0f0f5', color: '#1a1a2e', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>+ Add Variant</button>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 18 }}>Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} style={{ width: 20, height: 20 }} /><span>Product is active and visible</span></label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} style={{ width: 20, height: 20 }} /><span>Feature on homepage</span></label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input type="checkbox" checked={formData.is_new} onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })} style={{ width: 20, height: 20 }} /><span>Show &quot;New&quot; badge</span></label>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting || isUploading} style={{ width: '100%', padding: '14px 24px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Saving...' : 'Update Product'}</button>
            </form>
            <div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, position: 'sticky', top: 24 }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Card Preview</h2>
                <p style={{ margin: '0 0 16px', color: '#666', fontSize: 14 }}>This is how the product will appear to customers</p>
                <div style={{ backgroundColor: '#f5f5f5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100%', height: 220, backgroundColor: '#e0e0e0', backgroundImage: images[0] ? `url(${images[0]})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!images[0] && <span style={{ color: '#999', fontSize: 14 }}>No image</span>}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexDirection: 'column' }}>
                      {formData.is_new && <span style={{ backgroundColor: '#007aff', color: '#fff', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>NEW</span>}
                      {formData.compare_at_price && parseFloat(formData.compare_at_price) > parseFloat(formData.price || '0') && <span style={{ backgroundColor: '#ff3b30', color: '#fff', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>SALE</span>}
                    </div>
                    <button type="button" style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>♡</button>
                  </div>
                  <div style={{ padding: 16 }}>
                    {selectedCategory && <p style={{ margin: '0 0 4px', fontSize: 12, color: '#666', textTransform: 'uppercase' }}>{selectedCategory.name}</p>}
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: formData.name ? '#1a1a2e' : '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.name || 'Product Name'}</h3>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>£{formData.price || '0.00'}</span>
                      {formData.compare_at_price && parseFloat(formData.compare_at_price) > parseFloat(formData.price || '0') && <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through' }}>£{formData.compare_at_price}</span>}
                    </div>
                  </div>
                </div>
                {variants.some(v => v.colour) && (<div style={{ marginTop: 16 }}><p style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Available colors:</p><div style={{ display: 'flex', gap: 6 }}>{variants.filter(v => v.colour).map((v, i) => (<div key={i} style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: v.colour_hex, border: '2px solid #fff', boxShadow: '0 0 0 1px #ddd' }} title={v.colour} />))}</div></div>)}
                {variants.some(v => v.size) && (<div style={{ marginTop: 12 }}><p style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Available sizes:</p><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{Array.from(new Set(variants.filter(v => v.size).map(v => v.size))).map((size, i) => (<span key={i} style={{ padding: '4px 10px', backgroundColor: '#f5f5f5', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>{size}</span>))}</div></div>)}
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, backgroundColor: formData.is_active ? '#e8f5e9' : '#ffebee', color: formData.is_active ? '#2e7d32' : '#c62828' }}>{formData.is_active ? 'Active' : 'Inactive'}</span>
                  {formData.is_featured && <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, backgroundColor: '#fff3e0', color: '#ef6c00' }}>Featured</span>}
                </div>
                {formData.price && formData.cost_price && (<div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}><p style={{ margin: 0, fontSize: 12, color: '#666' }}>Profit: <strong style={{ color: '#2e7d32' }}>£{(parseFloat(formData.price) - parseFloat(formData.cost_price)).toFixed(2)}</strong> ({((parseFloat(formData.price) - parseFloat(formData.cost_price)) / parseFloat(formData.price) * 100).toFixed(0)}% margin)</p></div>)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProductFormProps> = async ({ params }) => {
  const id = params?.id as string
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')
  const { data: product } = await supabase.from('products').select(`*, images:product_images(id, url, position), variants:product_variants(id, colour, colour_hex, size)`).eq('id', id).single()
  if (!product) return { notFound: true }
  const transformedProduct = { ...product, images: (product.images || []).sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url), variants: (product.variants || []).map((v: any) => ({ id: v.id, colour: v.colour || '', colour_hex: v.colour_hex || '#000000', size: v.size || '', stock_quantity: 0 })) }
  return { props: { categories: categories || [], product: transformedProduct } }
}