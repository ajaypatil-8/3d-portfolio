import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: '3D Portfolio | Creative Developer',
  description: 'Immersive 3D portfolio showcasing creative web experiences',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrollProvider>
          {children}
          <SpeedInsights />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
