
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/components/providers';
import Script from 'next/script';


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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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
         <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2944289032966757"
     crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
