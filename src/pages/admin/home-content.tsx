import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { styled } from 'stitches.config'
import { supabase } from '@/lib/supabase'

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
})

const Header = styled('header', {
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
  padding: '16px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Logo = styled('h1', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
})

const Nav = styled('nav', {
  display: 'flex',
  gap: 24,
})

const NavLink = styled(Link, {
  color: '#ffffff',
  textDecoration: 'none',
  opacity: 0.8,
})

const Main = styled('main', {
  padding: 24,
  maxWidth: 1200,
  margin: '0 auto',
})

const Title = styled('h2', {
  fontSize: 24,
  fontWeight: 700,
  margin: 0,
  marginBottom: 24,
  color: '#1a1a2e',
})

const ContentGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 350px',
  gap: 24,
  alignItems: 'start',
})

const Section = styled('section', {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: 24,
})

const SectionTitle = styled('h3', {
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
  marginBottom: 16,
  color: '#1a1a2e',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const FormGroup = styled('div', {
  marginBottom: 20,
})

const Label = styled('label', {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 8,
  color: '#333333',
})

const Input = styled('input', {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  fontSize: 14,
  
  '&:focus': {
    outline: 'none',
    borderColor: '#1a1a2e',
  }
})

const Row = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
})

const SaveButton = styled('button', {
  padding: '12px 24px',
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  }
})

const PreviewBox = styled('div', {
  position: 'relative',
  height: 200,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  marginBottom: 16,
})

const PreviewOverlay = styled('div', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 16,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  color: '#ffffff',
})

const SuccessMessage = styled('div', {
  padding: '12px 16px',
  backgroundColor: '#e8f5e9',
  color: '#2e7d32',
  borderRadius: 8,
  marginBottom: 16,
})

const UploadZone = styled('div', {
  border: '2px dashed #e0e0e0',
  borderRadius: 12,
  padding: 32,
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#fafafa',
  marginBottom: 16,
  
  '&:hover': {
    borderColor: '#1a1a2e',
    backgroundColor: '#f5f5f5',
  }
})

const UploadIcon = styled('div', {
  fontSize: 48,
  marginBottom: 16,
})

const HiddenInput = styled('input', {
  display: 'none',
})

const ImagePreviewContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: 200,
  borderRadius: 12,
  overflow: 'hidden',
  marginBottom: 16,
})

const RemoveImageButton = styled('button', {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.9)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  color: '#ff4444',
  
  '&:hover': {
    backgroundColor: '#ffffff',
  }
})

const PreviewPanel = styled('div', {
  position: 'sticky',
  top: 24,
})

const PreviewCard = styled('div', {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
})

const PreviewLabel = styled('div', {
  fontSize: 12,
  color: '#888888',
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
  marginBottom: 16,
  fontWeight: 600,
})

const HeroBannerPreview = styled('div', {
  position: 'relative',
  height: 200,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#f0f0f0',
})

const HeroPreviewImage = styled('div', {
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

const HeroPreviewOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: 16,
  color: '#ffffff',
})

const HeroSubtitle = styled('div', {
  fontSize: 10,
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
  opacity: 0.9,
  marginBottom: 4,
})

const HeroTitle = styled('div', {
  fontSize: 18,
  fontWeight: 700,
})

interface HomeContentPageProps {
  heroContent: {
    id?: string
    title: string
    subtitle: string
    image_url: string
    link_url: string
  }
}

export default function HomeContentPage({ heroContent: initialHero }: HomeContentPageProps) {
  const [hero, setHero] = useState(initialHero)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setHero(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      const filePath = `home/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setHero(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const removeImage = () => {
    setHero(prev => ({ ...prev, image_url: '' }))
  }

  const handleSaveHero = async () => {
    setIsSaving(true)
    setShowSuccess(false)
    
    try {
      const heroData = {
        section_type: 'hero',
        title: hero.title,
        subtitle: hero.subtitle,
        image_url: hero.image_url,
        link_url: hero.link_url,
        sort_order: 0,
      }

      if (hero.id) {
        // Update existing
        const { error } = await supabase
          .from('home_content')
          .update(heroData)
          .eq('id', hero.id)
        
        if (error) throw error
      } else {
        // Create new
        const { data, error } = await supabase
          .from('home_content')
          .insert(heroData)
          .select()
          .single()
        
        if (error) throw error
        setHero(prev => ({ ...prev, id: data.id }))
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving hero:', error)
      alert('Failed to save hero content')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Head>
        <title>Home Content | Admin Dashboard</title>
      </Head>
      
      <Container>
        <Header>
          <Logo>Admin Dashboard</Logo>
          <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
          </Nav>
        </Header>

        <Main>
          <Title>Home Content</Title>

          {showSuccess && (
            <SuccessMessage>Changes saved successfully!</SuccessMessage>
          )}

          <ContentGrid>
            <div>
              <Section>
                <SectionTitle>
                  Hero Banner
                  <SaveButton onClick={handleSaveHero} disabled={isSaving || isUploading}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </SaveButton>
                </SectionTitle>

                <Row>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      name="title"
                      value={hero.title}
                      onChange={handleHeroChange}
                      placeholder="NEW COLLECTION"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Subtitle</Label>
                    <Input
                      name="subtitle"
                      value={hero.subtitle}
                      onChange={handleHeroChange}
                      placeholder="Winter 2025"
                    />
                  </FormGroup>
                </Row>

                <FormGroup>
                  <Label>Hero Image</Label>
                  <HiddenInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  
                  {hero.image_url ? (
                    <ImagePreviewContainer>
                      <Image
                        src={hero.image_url}
                        alt="Hero image"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <RemoveImageButton onClick={removeImage} type="button">
                        ✕
                      </RemoveImageButton>
                    </ImagePreviewContainer>
                  ) : (
                    <UploadZone
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      style={{
                        borderColor: isDragOver ? '#1a1a2e' : undefined,
                        backgroundColor: isDragOver ? '#f0f0f0' : undefined,
                      }}
                    >
                      <UploadIcon>{isUploading ? '⏳' : '📷'}</UploadIcon>
                      <div style={{ color: '#666666', marginBottom: 8 }}>
                        {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </div>
                      <div style={{ color: '#999999', fontSize: 12 }}>
                        Recommended: 1200x600 or larger
                      </div>
                    </UploadZone>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Link URL (optional)</Label>
                  <Input
                    name="link_url"
                    value={hero.link_url}
                    onChange={handleHeroChange}
                    placeholder="/tg/category/new-arrivals"
                  />
                </FormGroup>
              </Section>

              <Section>
                <SectionTitle>Quick Tips</SectionTitle>
                <ul style={{ color: '#666666', lineHeight: 1.8 }}>
                  <li>Hero banner appears at the top of the home page</li>
                  <li>Use high-quality images (recommended: 1200x600 or higher)</li>
                  <li>Products marked as &quot;NEW&quot; automatically appear in New Arrivals section</li>
                  <li>Featured products are managed through the database `featured_products` table</li>
                </ul>
              </Section>
            </div>

            <PreviewPanel>
              <PreviewCard>
                <PreviewLabel>📱 Hero Banner Preview</PreviewLabel>
                
                <HeroBannerPreview>
                  {hero.image_url ? (
                    <HeroPreviewImage style={{ backgroundImage: `url(${hero.image_url})` }} />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: '#999999',
                      fontSize: 14
                    }}>
                      Upload an image
                    </div>
                  )}
                  <HeroPreviewOverlay>
                    <HeroSubtitle>{hero.subtitle || 'SUBTITLE'}</HeroSubtitle>
                    <HeroTitle>{hero.title || 'TITLE'}</HeroTitle>
                  </HeroPreviewOverlay>
                </HeroBannerPreview>
                
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#888888', marginBottom: 4 }}>Link to:</div>
                  <div style={{ fontSize: 13, color: '#333333' }}>
                    {hero.link_url || 'No link set'}
                  </div>
                </div>
              </PreviewCard>
            </PreviewPanel>
          </ContentGrid>
        </Main>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HomeContentPageProps> = async () => {
  // Get hero content
  const { data: heroData } = await supabase
    .from('home_content')
    .select('*')
    .eq('section_type', 'hero')
    .order('sort_order')
    .limit(1)

  const hero = heroData?.[0] || {
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
  }

  return {
    props: {
      heroContent: {
        id: hero.id,
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        image_url: hero.image_url || '',
        link_url: hero.link_url || '',
      },
    }
  }
}
