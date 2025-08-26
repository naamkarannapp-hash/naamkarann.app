
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/components/providers';
import Script from 'next/script';
import { ptSans } from './fonts';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
  title: 'Naamkarann',
  description: 'Find the perfect name for your little one.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
         <Script id="vh-fix">
          {`
            function setVh() {
              document.documentElement.style.setProperty('--vh', \`\${window.innerHeight * 0.01}px\`);
            }
            window.addEventListener('resize', setVh);
            window.addEventListener('load', setVh);
            setVh();
          `}
        </Script>
         <Script 
            id="adsbygoogle-init"
            strategy="lazyOnload"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2944289032966757"
            crossOrigin="anonymous"
          />
      </head>
      <body className={cn("font-body antialiased", ptSans.variable)} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
