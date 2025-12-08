

import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { globalStyle } from 'stitches.config'

const CartProvider = dynamic(() => import('@/context/cart').then(t => t.CartProvider), {
  ssr: false
})

const TelegramAuthProvider = dynamic(() => import('@/context/telegram-auth').then(t => t.TelegramAuthProvider), {
  ssr: false
})

const TelegramCartProvider = dynamic(() => import('@/context/telegram-cart').then(t => t.CartProvider), {
  ssr: false
})

const TelegramWishlistProvider = dynamic(() => import('@/context/telegram-wishlist').then(t => t.WishlistProvider), {
  ssr: false
})

const Newsletter = dynamic(() => import('@/components/common').then(t => t.Newsletter), {
  ssr: false
})

export default function MyApp ({ Component, pageProps }: AppProps) {
  useEffect(() => {
    globalStyle()
  }, [])

  return (
    <TelegramAuthProvider>
      <TelegramCartProvider>
        <TelegramWishlistProvider>
          <CartProvider>
            <Newsletter />
            <Component {...pageProps} />
          </CartProvider>
        </TelegramWishlistProvider>
      </TelegramCartProvider>
    </TelegramAuthProvider>
  )
}
