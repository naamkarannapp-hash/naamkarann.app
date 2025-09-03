
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/components/providers';
import Script from 'next/script';
import { ptSans } from './fonts';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@/components/google-analytics';


export const metadata: Metadata = {
  title: 'Naamkarann: The Perfect AI Baby Name Generator',
  description: 'Discover thousands of meaningful and unique baby names. Personalize your search by gender, origin, and inspiration to find the perfect name for your little one.',
  keywords: ['baby names', 'name generator', 'indian baby names', 'unique baby names', 'naamkarann', 'baby name suggestions', 'ai name generator', 'hindu baby names'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2944289032966757" />
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
        <GoogleAnalytics gaId="G-1B4ZW0LFW2" />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
