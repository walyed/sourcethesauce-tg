import React from 'react'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'
import { useTelegramAuth } from '@/context/telegram-auth'

const Screen = styled('div', {
  margin: '12px 12px 0',
  paddingBottom: 16,
})

const HeaderCard = styled('div', {
  borderRadius: 20,
  padding: '18px 16px 20px',
  background:
    'linear-gradient(145deg, rgba(56,189,248,1) 0%, rgba(129,140,248,1) 45%, rgba(236,72,153,1) 100%)',
  boxShadow: '0 18px 40px rgba(15,23,42,0.55)',
  color: '#f9fafb',
  position: 'relative',
  overflow: 'hidden',
})

const HeaderGlow = styled('div', {
  position: 'absolute',
  inset: -40,
  background:
    'radial-gradient(circle at top left, rgba(248,250,252,0.32), transparent 60%)',
  opacity: 0.9,
  pointerEvents: 'none',
})

const HeaderInner = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  zIndex: 1,
})

const Avatar = styled('img', {
  width: 72,
  height: 72,
  borderRadius: 999,
  objectFit: 'cover',
  border: '2px solid rgba(248,250,252,0.9)',
  boxShadow: '0 10px 25px rgba(15,23,42,0.55)',
  flexShrink: 0,
})

const AvatarPlaceholder = styled('div', {
  width: 72,
  height: 72,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: 0.5,
  color: '#0f172a',
  background:
    'radial-gradient(circle at 0% 0%, #f9fafb, rgba(15,23,42,0.1))',
  boxShadow: '0 10px 25px rgba(15,23,42,0.5)',
  flexShrink: 0,
})

const HeaderText = styled('div', {
  flex: 1,
  minWidth: 0,
})

const Label = styled('div', {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  opacity: 0.8,
  marginBottom: 4,
})

const DisplayName = styled('div', {
  fontSize: 20,
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const UsernameRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  opacity: 0.95,
})

const Username = styled('span', {
  opacity: 0.9,
})

const PremiumBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  background:
    'linear-gradient(135deg, rgba(250,204,21,1), rgba(245,158,11,1))',
  color: '#111827',
  boxShadow: '0 0 0 1px rgba(250,204,21,0.5)',
})

const HeaderMetaRow = styled('div', {
  marginTop: 10,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
})

const Chip = styled('span', {
  fontSize: 10,
  fontWeight: 600,
  padding: '4px 8px',
  borderRadius: 999,
  border: '1px solid rgba(248,250,252,0.7)',
  backgroundColor: 'rgba(15,23,42,0.18)',
  backdropFilter: 'blur(6px)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
})

const Card = styled('div', {
  marginTop: 14,
  borderRadius: 16,
  padding: '12px 14px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  boxShadow: '0 10px 26px rgba(15,23,42,0.08)',
  border: '1px solid rgba(148,163,184,0.25)',
})

const SectionTitle = styled('div', {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: 'var(--tg-theme-hint-color, #9ca3af)',
  marginBottom: 8,
})

const InfoRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',

  '& + &': {
    borderTop: '1px solid rgba(226,232,240,0.9)',
  },
})

const InfoLabel = styled('span', {
  fontSize: 13,
  color: 'var(--tg-theme-hint-color, #6b7280)',
})

const InfoValue = styled('span', {
  fontSize: 13,
  fontWeight: 500,
  maxWidth: '60%',
  textAlign: 'right',
  color: 'var(--tg-theme-text-color, #0f172a)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const InfoMuted = styled('span', {
  fontSize: 13,
  color: 'var(--tg-theme-hint-color, #9ca3af)',
})

const ActionsGrid = styled('div', {
  marginTop: 14,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
})

const ActionTile = styled('button', {
  border: 'none',
  borderRadius: 16,
  padding: '12px 12px',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f3f4f6)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'transform 0.08s ease, box-shadow 0.12s ease, background-color 0.15s ease',

  '&:active': {
    transform: 'scale(0.97)',
    boxShadow: '0 6px 18px rgba(15,23,42,0.16)',
    backgroundColor: 'rgba(148,163,184,0.16)',
  },
})

const ActionLabel = styled('div', {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #0f172a)',
})

const ActionSub = styled('div', {
  fontSize: 11,
  color: 'var(--tg-theme-hint-color, #6b7280)',
})

const ActionIcon = styled('div', {
  width: 22,
  height: 22,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  backgroundColor: '#0f172a0f',
  color: 'var(--tg-theme-text-color, #0f172a)',
})

const LoadingState = styled('div', {
  margin: '16px',
  padding: '24px 16px',
  borderRadius: 16,
  textAlign: 'center',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  color: 'var(--tg-theme-hint-color, #6b7280)',
  boxShadow: '0 8px 26px rgba(15,23,42,0.08)',
  fontSize: 14,
})

const ErrorState = styled('div', {
  margin: '16px',
  padding: '14px 16px',
  borderRadius: 14,
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  background:
    'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
  color: '#b91c1c',
})

export function TelegramProfile() {
  const router = useRouter()
  const {
    user,
    telegramUser,
    isLoading,
    isAuthenticated,
    error,
    isTelegram,
  } = useTelegramAuth()

  if (isLoading) {
    return <LoadingState>Loading profile…</LoadingState>
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>
  }

  if (!isAuthenticated || !user) {
    return (
      <LoadingState>
        {isTelegram
          ? 'Authenticating your Telegram account…'
          : 'Open this shop inside Telegram to view your profile.'}
      </LoadingState>
    )
  }

  const displayName =
    user.full_name ||
    [telegramUser?.first_name, telegramUser?.last_name]
      .filter(Boolean)
      .join(' ') ||
    'Guest user'

  const initials =
    displayName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'

  const username = user.telegram_username || telegramUser?.username
  const isPremium = user.telegram_is_premium || telegramUser?.is_premium
  const languageCode =
    user.telegram_language_code || telegramUser?.language_code
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : null
  const telegramId = telegramUser?.id
    ? String(telegramUser.id)
    : user.telegram_id || null

  const go = (path: string) => router.push(path)

  return (
    <Screen>
      <HeaderCard>
        <HeaderGlow />
        <HeaderInner>
          {user.avatar_url ? (
            <Avatar src={user.avatar_url} alt={displayName} />
          ) : (
            <AvatarPlaceholder>{initials}</AvatarPlaceholder>
          )}

          <HeaderText>
            <Label>Account</Label>
            <DisplayName>{displayName}</DisplayName>
            <UsernameRow>
              {username && <Username>@{username}</Username>}
              {isPremium && <PremiumBadge>⭐ Premium</PremiumBadge>}
            </UsernameRow>

            <HeaderMetaRow>
              <Chip>Telegram linked</Chip>
              {languageCode && (
                <Chip>Lang · {languageCode.toUpperCase()}</Chip>
              )}
              {memberSince && <Chip>Since · {memberSince}</Chip>}
            </HeaderMetaRow>
          </HeaderText>
        </HeaderInner>
      </HeaderCard>

      <Card>
        <SectionTitle>Contact</SectionTitle>
        {user.email && (
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoRow>
        )}
        {user.phone && (
          <InfoRow>
            <InfoLabel>Phone</InfoLabel>
            <InfoValue>{user.phone}</InfoValue>
          </InfoRow>
        )}
        {telegramId && (
          <InfoRow>
            <InfoLabel>Telegram ID</InfoLabel>
            <InfoValue>{telegramId}</InfoValue>
          </InfoRow>
        )}
        {!user.email && !user.phone && !telegramId && (
          <InfoRow>
            <InfoLabel>Details</InfoLabel>
            <InfoMuted>Not provided</InfoMuted>
          </InfoRow>
        )}
      </Card>

      <Card>
        <SectionTitle>Store</SectionTitle>
        <ActionsGrid>
          <ActionTile onClick={() => go('/tg/orders')}>
            <ActionIcon>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6v13" />
                <path d="M16 6v13" />
                <path d="M5 6l1-3h12l1 3" />
              </svg>
            </ActionIcon>
            <ActionLabel>My orders</ActionLabel>
            <ActionSub>Track and view previous orders</ActionSub>
          </ActionTile>

          <ActionTile onClick={() => go('/tg/wishlist')}>
            <ActionIcon>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </ActionIcon>
            <ActionLabel>Wishlist</ActionLabel>
            <ActionSub>Saved items for later</ActionSub>
          </ActionTile>

          <ActionTile onClick={() => go('/tg/addresses')}>
            <ActionIcon>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </ActionIcon>
            <ActionLabel>Addresses</ActionLabel>
            <ActionSub>Manage delivery details</ActionSub>
          </ActionTile>

          <ActionTile onClick={() => go('/tg/settings')}>
            <ActionIcon>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82L13.8 22a2 2 0 1 1-3.6 0l.13-.18a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33L2 13.8a2 2 0 1 1 0-3.6l.18.13a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 .6-1A1.65 1.65 0 0 0 4.6 4.6a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33L1.7 4.4a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 5 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82L6.2 2a2 2 0 1 1 3.6 0l-.13.18a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33l.18-.13a2 2 0 1 1 0 3.6l-.18-.13a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-.6 1Z" />
              </svg>
            </ActionIcon>
            <ActionLabel>Settings</ActionLabel>
            <ActionSub>Preferences and privacy</ActionSub>
          </ActionTile>
        </ActionsGrid>
      </Card>
    </Screen>
  )
}

export default TelegramProfile
