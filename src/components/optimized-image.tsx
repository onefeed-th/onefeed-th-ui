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
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const handleError = useCallback(() => {
    console.warn(`Image failed to load: ${src}`)
    
    // Retry once with unoptimized fallback
    if (retryCount === 0 && src) {
      setRetryCount(1)
      setLoading(true)
      return
    }
    
    setError(true)
    setLoading(false)
    onError?.()
  }, [onError, src, retryCount])

  const handleLoad = useCallback(() => {
    setLoading(false)
    setError(false)
  }, [])

  // Clean and validate src URL
  const cleanSrc = src?.trim()
  const isValidSrc = cleanSrc && 
    (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) &&
    !cleanSrc.includes('undefined') &&
    !cleanSrc.includes('null')

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

  // Use unoptimized fallback on retry
  if (retryCount > 0) {
    return (
      <>
        {loading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={cleanSrc}
          alt={alt}
          className={`${className} object-cover w-full h-full`}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      </>
    )
  }

  // Try to use Next.js Image first
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
        unoptimized={process.env.NODE_ENV === 'development'}
      />
    </>
  )
}