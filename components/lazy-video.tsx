"use client"

import { useEffect, useRef } from "react"

interface LazyVideoProps {
  src: string
  className?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  playsInline?: boolean
  "aria-label"?: string
}

export default function LazyVideo({
  src,
  className = "",
  poster,
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  playsInline = true,
  "aria-label": ariaLabel,
  ...props
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting && !loadedRef.current) {
          loadedRef.current = true
          el.src = src
          el.load()

          if (autoplay) {
            const playVideo = async () => {
              try {
                await el.play()
              } catch (error) {
                console.log("Autoplay blocked:", error)
              }
            }

            if (el.readyState >= 3) {
              playVideo()
            } else {
              el.addEventListener("canplay", playVideo, { once: true })
            }
          }
        } else if (!entry.isIntersecting && loadedRef.current && autoplay) {
          try {
            el.pause()
          } catch {}
        } else if (entry.isIntersecting && loadedRef.current && autoplay) {
          try {
            await el.play()
          } catch {}
        }
      })
    }

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "200px",
      threshold: 0.01,
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [src, autoplay])

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      preload="none"
      poster={poster}
      aria-label={ariaLabel}
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  )
}
