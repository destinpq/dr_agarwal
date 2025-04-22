import './globals.css'
import type { Metadata } from 'next'
import AntdProvider from './providers'
import { Inter } from 'next/font/google'

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Psychology Workshop Registration',
  description: 'Register for our exclusive psychology workshop. Learn from experts, gain practical skills, and connect with like-minded individuals.',
  keywords: 'psychology workshop, mental health, registration, psychology training, online workshop',
  openGraph: {
    title: 'Psychology Workshop Registration',
    description: 'Join our exclusive workshop and enhance your understanding of psychological principles',
    url: 'https://psychology-workshop.example.com',
    siteName: 'Psychology Workshop',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1573166364524-d9dbfd8bbf83',
        width: 1200,
        height: 630,
        alt: 'Psychology Workshop',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  )
} 