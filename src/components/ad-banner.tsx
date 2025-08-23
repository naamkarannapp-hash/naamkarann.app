
"use client";

import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

const AdBanner = () => {
  const isMobile = useIsMobile();
  const adSlot = "7577038771";
  const publisherId = "ca-pub-2944289032966757";
  const adPushed = useRef(false);

  useEffect(() => {
    // We only want to push the ad once, and only on the client side.
    if (typeof window !== "undefined" && !adPushed.current) {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adPushed.current = true; // Mark ad as pushed
        } catch (err) {
            console.error(err);
        }
    }
  }, []);

  if (!publisherId) {
      return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Ad service not configured.</p>
        </div>
      );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center py-4 bg-background">
      <div className="flex-grow w-full flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={publisherId}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
      </div>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground font-semibold flex-shrink-0">
        Crafting names that you love
      </p>
    </div>
  );
};

export default AdBanner;
