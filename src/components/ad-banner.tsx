
"use client";

import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

const AdBanner = () => {
  const isMobile = useIsMobile();
  const adSlot = "7577038771";
  const publisherId = "pub-2944289032966757";

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto text-center py-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: isMobile ? '100vw' : '100%', height: isMobile ? '100vh' : 'auto' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
       <p className="mt-4 text-lg md:text-xl text-muted-foreground font-semibold">
        Crafting names that you love
      </p>
    </div>
  );
};

export default AdBanner;
