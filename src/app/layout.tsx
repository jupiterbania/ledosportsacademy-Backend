
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from "@/components/theme-provider"
import { Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { Background } from '@/components/background';

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: 'LEDO SPORTS ACADEMY',
  description: 'Welcome to LEDO SPORTS ACADEMY',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: 'https://iili.io/KFLBPv1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${spaceGrotesk.variable} font-body bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
              themes={['light', 'dark', 'system', 'football']}
          >       
                  <Background />
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
