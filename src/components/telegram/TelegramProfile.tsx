import React from 'react'
import { useTelegramAuth } from '@/context/telegram-auth'
import { styled } from 'stitches.config'

const ProfileContainer = styled('div', {
  padding: '16px',
  backgroundColor: '$white',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
})

const ProfileHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
})

const Avatar = styled('img', {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid $primary',
})

const AvatarPlaceholder = styled('div', {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '$primary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$white',
  fontSize: '24px',
  fontWeight: 'bold',
})

const UserInfo = styled('div', {
  flex: 1,
})

const UserName = styled('h2', {
  fontSize: '18px',
  fontWeight: '600',
  margin: 0,
  marginBottom: '4px',
})

const UserUsername = styled('p', {
  fontSize: '14px',
  color: '$gray500',
  margin: 0,
})

const PremiumBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: '#FFD700',
  color: '#000',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  marginLeft: '8px',
})

const InfoSection = styled('div', {
  borderTop: '1px solid $gray100',
  paddingTop: '16px',
})

const InfoRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  
  '& + &': {
    borderTop: '1px solid $gray50',
  }
})

const InfoLabel = styled('span', {
  fontSize: '14px',
  color: '$gray500',
})

const InfoValue = styled('span', {
  fontSize: '14px',
  fontWeight: '500',
})

const LoadingState = styled('div', {
  padding: '32px',
  textAlign: 'center',
  color: '$gray500',
})

const ErrorState = styled('div', {
  padding: '16px',
  backgroundColor: '#FEE2E2',
  borderRadius: '8px',
  color: '#DC2626',
  textAlign: 'center',
})

export function TelegramProfile() {
  const { user, telegramUser, isLoading, isAuthenticated, error, isTelegram } = useTelegramAuth()

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingState>Loading profile...</LoadingState>
      </ProfileContainer>
    )
  }

  if (error) {
    return (
      <ProfileContainer>
        <ErrorState>{error}</ErrorState>
      </ProfileContainer>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <ProfileContainer>
        <LoadingState>
          {isTelegram ? 'Authenticating...' : 'Please open this app in Telegram'}
        </LoadingState>
      </ProfileContainer>
    )
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?'

  return (
    <ProfileContainer>
      <ProfileHeader>
        {user.avatar_url ? (
          <Avatar src={user.avatar_url} alt={user.full_name || 'User'} />
        ) : (
          <AvatarPlaceholder>{initials}</AvatarPlaceholder>
        )}
        <UserInfo>
          <UserName>
            {user.full_name}
            {user.telegram_is_premium && (
              <PremiumBadge>⭐ Premium</PremiumBadge>
            )}
          </UserName>
          {user.telegram_username && (
            <UserUsername>@{user.telegram_username}</UserUsername>
          )}
        </UserInfo>
      </ProfileHeader>

      <InfoSection>
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
        {user.telegram_language_code && (
          <InfoRow>
            <InfoLabel>Language</InfoLabel>
            <InfoValue>{user.telegram_language_code.toUpperCase()}</InfoValue>
          </InfoRow>
        )}
        <InfoRow>
          <InfoLabel>Member Since</InfoLabel>
          <InfoValue>
            {new Date(user.created_at).toLocaleDateString()}
          </InfoValue>
        </InfoRow>
      </InfoSection>
    </ProfileContainer>
  )
}

export default TelegramProfile
