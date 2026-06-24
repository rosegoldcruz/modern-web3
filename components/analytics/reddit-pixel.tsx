"use client"

import Script from "next/script"
import type { ReactElement } from "react"

function getPixelId(): string | undefined {
  const pixelId = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID?.trim()
  return pixelId || undefined
}

export function RedditPixelBase(): ReactElement | null {
  const pixelId = getPixelId()
  if (!pixelId) return null

  return (
    <>
      <Script
        id="reddit-pixel-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(w,d){
              if(!w.rdt){
                var p=w.rdt=function(){
                  p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)
                };
                p.callQueue=[];
                var t=d.createElement("script");
                t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${pixelId}";
                t.async=!0;
                var s=d.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(t,s)
              }
            }(window,document);
          `,
        }}
      />
      <Script
        id="reddit-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== "undefined" && typeof window.rdt === "function") {
              window.rdt('init', '${pixelId}');
            }
          `,
        }}
      />
    </>
  )
}
