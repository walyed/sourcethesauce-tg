// Telegram Mini App Theme Configuration
// These CSS custom properties adapt to the user's Telegram theme

export const telegramTheme = {
  // Colors that adapt to Telegram theme
  colors: {
    bg: 'var(--tg-theme-bg-color, #ffffff)',
    secondaryBg: 'var(--tg-theme-secondary-bg-color, #f4f4f5)',
    text: 'var(--tg-theme-text-color, #000000)',
    hint: 'var(--tg-theme-hint-color, #999999)',
    link: 'var(--tg-theme-link-color, #007aff)',
    button: 'var(--tg-theme-button-color, #007aff)',
    buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
    destructive: 'var(--tg-theme-destructive-text-color, #ff3b30)',
  },
  
  // Custom accent colors
  accent: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  // Border radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '100px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    card: '0 2px 8px rgba(0,0,0,0.08)',
  },
}

// Animation variants for smooth transitions
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  scale: {
    whileTap: { scale: 0.98 },
  },
}
