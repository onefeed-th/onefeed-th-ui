"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, ExternalLink, Clock } from "lucide-react"
import Image from "next/image"
import { format, isToday, isYesterday, differenceInHours, differenceInMinutes } from "date-fns"
import { th } from "date-fns/locale"
import { useAppStore } from "@/stores/useAppStore"

// Updated NewsItem interface to match current API
export interface NewsItem {
  id?: string
  title: string
  link: string
  source: string
  publishedAt: string
  image?: string
  description?: string
  tags?: string[]
}

interface NewsCardProps {
  article: NewsItem
  priority?: boolean
}

export function NewsCard({ article, priority = false }: NewsCardProps) {
  const { isBookmarked, toggleBookmark } = useAppStore()
  const [imageError, setImageError] = useState(false)
  
  const articleId = article.id || article.link
  const bookmarked = isBookmarked(articleId)
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark(articleId)
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid and not the invalid default date "0001-01-01T00:00:00Z"
      if (isNaN(date.getTime()) || dateString.startsWith('0001-01-01') || date.getFullYear() < 2000) {
        return "เมื่อไหร่ก็ไม่รู้"
      }

      const now = new Date()
      const minutes = Math.abs(differenceInMinutes(now, date))
      const hours = Math.abs(differenceInHours(now, date))
      const isPast = date < now

      // Less than 1 minute
      if (minutes < 1) {
        return isPast ? "เมื่อสักครู่" : "อีกสักครู่"
      }
      
      // Less than 60 minutes
      if (minutes < 60) {
        return isPast ? `${minutes} นาทีที่แล้ว` : `อีก ${minutes} นาที`
      }
      
      // Less than 24 hours
      if (hours < 24 && (isToday(date) || (isPast === false && hours < 24))) {
        return isPast ? `${hours} ชั่วโมงที่แล้ว` : `อีก ${hours} ชั่วโมง`
      }
      
      // Yesterday
      if (isYesterday(date)) {
        return `เมื่อวาน ${format(date, 'HH:mm')}`
      }
      
      // Within current year
      if (date.getFullYear() === now.getFullYear()) {
        return format(date, 'dd MMM HH:mm', { locale: th })
      }
      
      // Different year
      return format(date, 'dd/MM/yyyy')
    } catch {
      return "เวลาไม่ชัดเจน"
    }
  }

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      data-article-card
    >
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block flex-1 flex flex-col"
      >
        {/* Optimized image with Next.js Image */}
        {article.image && !imageError && (
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
            
            {/* Gradient Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        {/* No image fallback */}
        {(!article.image || imageError) && (
          <div className="aspect-[16/10] bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📰</div>
              <div className="text-sm">ไม่มีรูปภาพ</div>
            </div>
          </div>
        )}
        
        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Source & Time */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              {article.source}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(article.publishedAt)}
            </span>
          </div>
          
          {/* Title - Clean typography */}
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          {/* Description */}
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
              {article.description}
            </p>
          )}
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </a>
      
      {/* Actions outside link area */}
      <div className="flex items-center justify-between px-5 pb-4 border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="h-8 hover:bg-accent"
        >
          <Bookmark 
            className={`h-4 w-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} 
          />
          <span className="text-xs">
            {bookmarked ? 'บันทึกแล้ว' : 'บันทึก'}
          </span>
        </Button>
        
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          อ่านเพิ่มเติม
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  )
}

// Loading Skeleton Component
export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="aspect-[16/10] w-full" />
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-16 w-full mb-3" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <div className="px-5 pb-4 border-t pt-3">
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  )
}