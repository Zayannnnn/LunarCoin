import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'LunarCoin Explorer | Lunar Chain Explorer',
  description: 'Explore blocks, transactions, and network statistics on Lunar Chain. The official blockchain explorer for Lunar Coin.',
  keywords: ['blockchain', 'explorer', 'lunar coin', 'lunar chain', 'crypto', 'transactions', 'blocks'],
  authors: [{ name: 'LunarCoin Team' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'LunarCoin Explorer | Lunar Chain Explorer',
    description: 'Explore blocks, transactions, and network statistics on Lunar Chain. The official blockchain explorer for Lunar Coin.',
    url: 'https://explorer.lunarcoin.com',
    siteName: 'LunarCoin Explorer',
    images: [
      {
        url: 'https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png',
        width: 800,
        height: 800,
        alt: 'LunarCoin Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LunarCoin Explorer | Lunar Chain Explorer',
    description: 'Explore blocks, transactions, and network statistics on Lunar Chain. The official blockchain explorer for Lunar Coin.',
    images: ['https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
