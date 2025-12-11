import { Toaster } from '@/shared/components/ui/toaster';
import { AuthProvider } from '@/shared/providers/auth.provider';
import { ConfigProvider } from '@/shared/providers/config.provider';
import { QueryProvider } from '@/shared/providers/query.provider';
import { ThemeProvider } from '@/shared/providers/theme.provider';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ESG Content Automation Portal',
  description: 'Dashboard for managing automated content pipelines',
  keywords: ['automation', 'content', 'dashboard', 'ESG'],
  authors: [{ name: 'ESG Team' }],
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <ConfigProvider>
          <ThemeProvider defaultTheme='system' storageKey='automation-portal-theme'>
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
