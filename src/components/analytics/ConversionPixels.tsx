"use client";

import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

/**
 * Conversion tracking pixels — Meta, Google Ads, Reddit.
 * Only loads when the corresponding env var is set.
 */
export function ConversionPixels() {
  return (
    <>
      {/* ── Meta Pixel ── */}
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ── Google Ads gtag ── */}
      {GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}</Script>
        </>
      )}

      {/* ── Reddit Pixel ── */}
      {REDDIT_PIXEL_ID && (
        <Script id="reddit-pixel" strategy="afterInteractive">{`
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?
          p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};
          p.callQueue=[];var t=d.createElement("script");t.src=
          "https://www.redditstatic.com/ads/pixel.js";t.async=!0;
          var s=d.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(t,s)}}(window,document);
          rdt('init','${REDDIT_PIXEL_ID}');
          rdt('track', 'PageVisit');
        `}</Script>
      )}
    </>
  );
}
