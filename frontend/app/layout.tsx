import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';

const defaultUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://squarelord.com'
    : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'SquareLord - Create, Share, and Track Your Sports Squares',
  description:
    'Create custom sports squares pools, share with participants, and track real-time winners. The easiest way to manage your sports betting squares.',
  keywords:
    'sports squares, betting squares, football squares, super bowl squares, sports pools',
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
    title: 'SquareLord - Sports Squares Platform',
    description:
      'Create custom sports squares pools, share with participants, and track real-time winners.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
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
              </footer>
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
