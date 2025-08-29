"use client"

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  onError?: () => void
  fallback?: React.ReactNode
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  priority = false, 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onError,
  fallback
}: OptimizedImageProps) {
  const [useNativeImg, setUseNativeImg] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleError = useCallback(() => {
    console.warn(`Image optimization failed, falling back to native img: ${src}`)
    
    if (!useNativeImg) {
      // Try native img first
      setUseNativeImg(true)
      setLoading(true)
      return
    }
    
    // If native img also fails, show fallback
    setError(true)
    setLoading(false)
    onError?.()
  }, [onError, src, useNativeImg])

  const handleLoad = useCallback(() => {
    setLoading(false)
    setError(false)
  }, [])

  // Clean and validate src URL
  const cleanSrc = src?.trim()
  const isValidSrc = cleanSrc && 
    cleanSrc.length > 0 &&
    (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) &&
    !cleanSrc.includes('undefined') &&
    !cleanSrc.includes('null') &&
    !cleanSrc.endsWith('null') &&
    !cleanSrc.endsWith('undefined')

  // If we have an error or no valid src, show fallback
  if (error || !isValidSrc) {
    return fallback || (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">📰</div>
          <div className="text-sm">ไม่มีรูปภาพ</div>
        </div>
      </div>
    )
  }

  // Use native img if Next.js Image fails
  if (useNativeImg) {
    return (
      <>
        {loading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={cleanSrc}
          alt={alt}
          className={`${className} w-full h-full object-cover`}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          decoding="async"
        />
      </>
    )
  }

  // Try Next.js Image first (but with unoptimized=true from config)
  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        src={cleanSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        quality={85}
        // Force unoptimized for RSS feeds to avoid 400 errors
        unoptimized={true}
      />
    </>
  )
}