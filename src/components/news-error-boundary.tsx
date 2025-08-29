"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface NewsErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export function NewsErrorFallback({ error, resetError }: NewsErrorFallbackProps) {
  const isNetworkError = error?.message.includes('fetch') || 
                        error?.message.includes('network') ||
                        error?.message.includes('Failed to fetch')
  
  const isServerError = error?.message.includes('500') ||
                       error?.message.includes('502') ||
                       error?.message.includes('503')

  const handleRetry = () => {
    resetError?.()
    // Also trigger a news refresh
    window.dispatchEvent(new CustomEvent('refresh-news'))
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              {isNetworkError ? (
                <WifiOff className="w-8 h-8 text-destructive" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-destructive" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {isNetworkError ? 'ปัญหาการเชื่อมต่อ' : 'โหลดข่าวไม่สำเร็จ'}
              </h3>
              
              <p className="text-muted-foreground text-sm">
                {isNetworkError && 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'}
                {isServerError && 'เซิร์ฟเวอร์กำลังมีปัญหา กรุณาลองใหม่ในสักครู่'}
                {!isNetworkError && !isServerError && 'เกิดข้อผิดพลาดในการโหลดข่าว'}
              </p>
            </div>

            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
              </AlertDescription>
            </Alert>

            <div className="space-y-2 pt-2">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                ลองโหลดใหม่
              </Button>
              
              {isNetworkError && (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  รีโหลดหน้าเว็บ
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              หากปัญหายังคงอยู่ กรุณาลองใหม่ในภายหลัง
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component-specific error boundary for news components
export function NewsComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="news-component-boundary">
      {children}
    </div>
  )
}