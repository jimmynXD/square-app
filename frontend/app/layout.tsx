import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import StructuredData from './components/StructuredData';

const defaultUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://squarelord.com'
    : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title:
    'Super Bowl Squares, NFL Football Pools, NBA Basketball Pools | SquareLord - Sports Squares',
  description:
    'Create and manage Super Bowl squares, NFL football pools, and sports betting squares. Real-time score tracking, automatic winner calculation, and easy sharing with participants.',
  keywords:
    'super bowl squares, football squares, basketball squares, nfl squares, nba squares, sports betting squares, football pools, super bowl pools, sports squares',
  type: 'website',
  url: defaultUrl,
  siteName: 'SquareLord',
  openGraph: {
    title: 'SquareLord - Sports Squares Platform',
    description:
      'Create custom sports squares pools, share with participants, and track real-time winners.',
    type: 'website',
    url: defaultUrl,
    siteName: 'SquareLord',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Bowl Squares & NFL Football Pools | SquareLord',
    description:
      'Create and share sports betting squares for Super Bowl, NFL games, and more. Automatic winner tracking and real-time score updates.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

function MetaTags() {
  return (
    <>
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <head>
          <StructuredData />
        </head>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col">
              <nav className="fixed top-0 inset-x-0 z-40 bg-background flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={'/'} className="flex items-center gap-2">
                      <Image
                        src="/squarelord-logo.png"
                        alt="SquareLord Logo"
                        width={24}
                        height={24}
                        className="dark:invert"
                      />
                      SquareLord
                    </Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>

              <MetaTags />

              {children}

              <footer className="w-full flex flex-col md:flex-row items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <ThemeSwitcher />
                <Link
                  href="/privacy-policy"
                  className="text-primary/70 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-primary/70 hover:text-primary"
                >
                  Terms of Service
                </Link>
                <a
                  href="mailto:info@squarelord.com"
                  className="text-primary/70 hover:text-primary"
                >
                  Send Feedback Questions or Report an Issue
                </a>
              </footer>
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
