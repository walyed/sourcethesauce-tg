import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useTelegramAuth } from '@/context/telegram-auth'
import { supabase } from '@/lib/supabase'
import { lightImpact, successNotification } from '@/lib/telegram/haptics'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(8px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  paddingBottom: 100,
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
})

const BackButton = styled('button', {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const AddressList = styled('div', {
  padding: 12,
})

const AddressCard = styled('div', {
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  padding: 16,
  marginBottom: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeIn} 0.3s ease`,
})

const AddressHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
})

const AddressLabel = styled('span', {
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #000000)',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

const DefaultBadge = styled('span', {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 10,
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: 8,
})

const AddressText = styled('p', {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--tg-theme-hint-color, #666)',
  margin: 0,
})

const AddressActions = styled('div', {
  display: 'flex',
  gap: 8,
  marginTop: 12,
  paddingTop: 12,
  borderTop: '1px solid var(--tg-theme-hint-color, #e5e5e5)',
})

const ActionButton = styled('button', {
  flex: 1,
  padding: '10px',
  borderRadius: 10,
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.97)',
  },
  
  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
        color: 'var(--tg-theme-text-color, #000)',
      },
      danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
      }
    }
  }
})

const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  textAlign: 'center',
  animation: `${fadeIn} 0.3s ease`,
})

const EmptyIcon = styled('div', {
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
  color: '#6366f1',
})

const EmptyTitle = styled('h2', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: 'var(--tg-theme-text-color, #000000)',
})

const EmptyText = styled('p', {
  fontSize: 14,
  margin: 0,
  marginBottom: 24,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const AddButton = styled('button', {
  position: 'fixed',
  bottom: 90,
  right: 16,
  width: 56,
  height: 56,
  borderRadius: '50%',
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
  transition: 'all 0.2s ease',
  zIndex: 100,
  
  '&:active': {
    transform: 'scale(0.95)',
  },
})

interface Address {
  id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  postal_code: string
  is_default: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const { user } = useTelegramAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // For now, show empty state since addresses table may not exist
    // In a real app, fetch from supabase
    setIsLoading(false)
    
    // Demo addresses for UI preview
    // setAddresses([
    //   {
    //     id: '1',
    //     label: 'Home',
    //     name: 'John Smith',
    //     phone: '+44 7700 900000',
    //     address: '123 Main Street, Apt 4B',
    //     city: 'London',
    //     postal_code: 'SW1A 1AA',
    //     is_default: true,
    //   }
    // ])
  }, [user?.id])

  const handleAddAddress = () => {
    lightImpact()
    // Navigate to add address form or show modal
    router.push('/tg/checkout')
  }

  return (
    <>
      <Head>
        <title>Addresses | Source The Sauce</title>
      </Head>
      
      <TelegramLayout showNav={false}>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </BackButton>
            <Title>Saved Addresses</Title>
          </Header>

          {isLoading ? (
            <EmptyState>
              <EmptyText>Loading...</EmptyText>
            </EmptyState>
          ) : addresses.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </EmptyIcon>
              <EmptyTitle>No saved addresses</EmptyTitle>
              <EmptyText>Add an address for faster checkout</EmptyText>
            </EmptyState>
          ) : (
            <AddressList>
              {addresses.map((address) => (
                <AddressCard key={address.id}>
                  <AddressHeader>
                    <AddressLabel>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      </svg>
                      {address.label}
                    </AddressLabel>
                    {address.is_default && <DefaultBadge>Default</DefaultBadge>}
                  </AddressHeader>
                  <AddressText>
                    {address.name}<br/>
                    {address.phone}<br/>
                    {address.address}<br/>
                    {address.city}, {address.postal_code}
                  </AddressText>
                  <AddressActions>
                    <ActionButton variant="secondary">Edit</ActionButton>
                    {!address.is_default && (
                      <ActionButton variant="primary">Set Default</ActionButton>
                    )}
                  </AddressActions>
                </AddressCard>
              ))}
            </AddressList>
          )}

          <AddButton onClick={handleAddAddress}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </AddButton>
        </Container>
      </TelegramLayout>
    </>
  )
}
