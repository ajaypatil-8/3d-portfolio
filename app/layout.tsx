import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { SpeedInsights } from "@vercel/speed-insights/next"
import ThemeProvider from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Ajay Patil | Java Backend & Full Stack Developer',
  description: 'BCA student specializing in Java, Spring Boot, React, and Next.js. Building production-ready applications with modern tech stack.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before React hydration — sets theme instantly with zero flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                  // dark is default — :root in globals.css handles it, no attribute needed
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SmoothScrollProvider>
            {children}
            <SpeedInsights />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}