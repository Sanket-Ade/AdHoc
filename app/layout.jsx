import { Suspense } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';
export const metadata = {
    title: 'Adhoc | Advertising Production Houses Marketplace',
    description: 'Connect with verified advertising production houses for video production, digital advertising, and outdoor advertising.',
    keywords: [
        'advertising production house',
        'commercial film production',
        'digital advertising',
        'outdoor advertising',
        'billboard advertising',
    ],
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-yellow-200 selection:text-yellow-950">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 sm:h-20 bg-white border-b border-zinc-200"/>}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <FloatingAIAssistant />
          </Suspense>
        </AuthProvider>
      </body>
    </html>);
}
