"use client"

import { useEffect, useState, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

export function usePullToRefresh({ 
  onRefresh, 
  threshold = 80, 
  disabled = false 
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || window.scrollY > 0) return
    setStartY(e.touches[0].clientY)
    setIsPulling(true)
  }, [disabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || disabled || window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, (currentY - startY) * 0.5) // Damping factor
    
    if (distance > 0) {
      e.preventDefault() // Prevent default scroll behavior
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }, [isPulling, startY, threshold, disabled])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return

    setIsPulling(false)

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [isPulling, pullDistance, threshold, onRefresh, disabled])

  useEffect(() => {
    if (disabled) return

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled])

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    canRefresh: pullDistance >= threshold,
  }
}