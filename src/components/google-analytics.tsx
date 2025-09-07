
"use client"

import Script from 'next/script'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import * as gtag from '@/lib/gtag'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()

  React.useEffect(() => {
    if (!gaId || pathname === null) {
      return
    }
    const url = new URL(pathname, window.location.origin)
    gtag.pageview(url)

  }, [pathname, gaId])


  if (!gaId) {
    return null
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
