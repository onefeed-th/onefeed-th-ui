"use client"

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'
import { RefreshCw, ArrowDown } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  disabled?: boolean
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const { isRefreshing, pullDistance, isPulling, canRefresh } = usePullToRefresh({
    onRefresh,
    threshold: 80,
    disabled,
  })

  const indicatorOpacity = Math.min(pullDistance / 60, 1)
  const indicatorScale = Math.min(pullDistance / 80, 1)

  return (
    <div className="relative">
      {/* Pull to refresh indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
          opacity: isPulling || isRefreshing ? indicatorOpacity : 0,
          transition: isPulling ? 'none' : 'all 0.3s ease-out',
        }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 bg-background border rounded-full shadow-lg"
          style={{
            transform: `scale(${indicatorScale})`,
          }}
        >
          {isRefreshing ? (
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          ) : canRefresh ? (
            <ArrowDown className="w-6 h-6 text-primary" />
          ) : (
            <ArrowDown 
              className="w-6 h-6 text-muted-foreground transition-transform duration-150"
              style={{ transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)` }}
            />
          )}
        </div>
      </div>

      {/* Content with pull distance offset */}
      <div
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance, 120)}px)` : 'none',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}