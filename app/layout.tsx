import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ThemeProvider from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-body',
  preload:  true,
  weight:   ['300', '400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-heading',
  preload:  true,
  weight:   ['400', '500', '600', '700'],
})


export const metadata: Metadata = {
  metadataBase: new URL('https://ajaypatil.dev'),

  title: {
    default:  'Ajay Patil | Java Backend & Full Stack Developer',
    template: '%s | Ajay Patil',
  },

  description:
    'BCA student from Palus, Maharashtra specializing in Java, Spring Boot, ' +
    'React & Next.js. Building production-ready full-stack applications. ' +
    'Open to internships and full-time roles.',

  keywords: [
    'Ajay Patil', 'Java Developer', 'Spring Boot', 'Full Stack Developer',
    'React', 'Next.js', 'Docker', 'Microservices', 'Kafka', 'PostgreSQL',
    'BCA', 'Shivaji University', 'Sangli', 'Maharashtra', 'Portfolio',
    'Backend Developer', 'Freelance',
  ],

  authors: [{ name: 'Ajay Patil', url: 'https://github.com/ajaypatil-8' }],
  creator: 'Ajay Patil',

  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         'https://ajaypatil.dev',
    title:       'Ajay Patil | Java Backend & Full Stack Developer',
    description: 'BCA student specializing in Java, Spring Boot, React & Next.js.',
    siteName:    'Ajay Patil Portfolio',
    images: [{
      url:    '/images/Profile.jpg',
      width:  1200,
      height: 630,
      alt:    'Ajay Patil — Full Stack Developer',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Ajay Patil | Java Backend & Full Stack Developer',
    description: 'BCA student specializing in Java, Spring Boot, React & Next.js.',
    images:      ['/images/Profile.jpg'],
  },

  icons: {
    icon:     '/favicon.png',
    shortcut: '/favicon.png',
    apple:    '/favicon.png',
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
}


export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,          
  userScalable: true,
  viewportFit:  'cover',  
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
  ],
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
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