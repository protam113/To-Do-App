import '../assets/styles/global.css';
import {
  metadata as siteMetadata,
  viewport as siteViewport,
} from '../constants/appInfos';
import { Toaster } from 'sonner';
import Script from 'next/script';
import ReactQueryProvider from '../providers/ReactQuery.provider';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="mdl-js">
      <body style={{ backgroundColor: '#D4D4D4' }}>
        <ReactQueryProvider>
          <AuthInitializer />
          {children}
          <Toaster position="top-right" richColors />
        </ReactQueryProvider>
      </body>

      <Script id="add-mdl-class" strategy="afterInteractive">
        {`document.documentElement.classList.add('mdl-js');`}
      </Script>
    </html>
  );
}
