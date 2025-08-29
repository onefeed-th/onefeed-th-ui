"use client"

import { useState, useEffect } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { NewsCard, NewsCardSkeleton, type NewsItem } from "./NewsCard"
import { Button } from "@/components/ui/button"
import { ArrowUp, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewsResponse {
  data?: NewsItem[]
  hasMore?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onefeed-th-api.artzakub.com/api/v1'

export function NewsFeed({ initialNews = [] }: { initialNews?: NewsItem[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const queryClient = useQueryClient()
  const { ref, inView } = useInView()

  // Listen for tag changes and refresh events
  useEffect(() => {
    const handleTagChange = (event: CustomEvent) => {
      const newTags = event.detail
      setSelectedTags(newTags)
    }
    
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    }

    window.addEventListener('tags-changed', handleTagChange as EventListener)
    window.addEventListener('refresh-news', handleRefresh)
    
    return () => {
      window.removeEventListener('tags-changed', handleTagChange as EventListener)
      window.removeEventListener('refresh-news', handleRefresh)
    }
  }, [queryClient])

  // Load saved tags on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedTags")
    if (saved) {
      try {
        setSelectedTags(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse saved tags:", error)
      }
    }
  }, [])

  const fetchNews = async ({ pageParam = 1 }): Promise<NewsResponse> => {
    try {
      // If no tags selected, use main sources as default
      const sources = selectedTags.length > 0 
        ? selectedTags 
        : ["MacThai", "DroidSans", "เกมถูกบอกด้วย"]

      const response = await fetch(`${API_URL}/news`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: sources,
          page: pageParam,
          limit: 20,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      let articles = data.data || []
      
      // Sort by selected tags - prioritize articles from selected sources
      if (selectedTags.length > 0) {
        articles = articles.sort((a: NewsItem, b: NewsItem) => {
          const aIsSelected = selectedTags.includes(a.source)
          const bIsSelected = selectedTags.includes(b.source)
          
          // Prioritize selected sources
          if (aIsSelected && !bIsSelected) return -1
          if (!aIsSelected && bIsSelected) return 1
          
          // If both are selected or both are not selected, sort by publishedAt (newest first)
          // Handle null publishedAt values
          const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return bTime - aTime
        })
      }
      
      return {
        data: articles,
        hasMore: (articles.length || 0) === 20
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      throw error
    }
  }

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['news', selectedTags],
    queryFn: fetchNews,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    initialData: initialNews.length > 0 && selectedTags.length === 0 ? {
      pages: [{ data: initialNews, hasMore: true }],
      pageParams: [1]
    } : undefined,
  })

  // Auto fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get all articles from all pages
  const allArticles = data?.pages.flatMap(page => page.data || []) || []

  if (isLoading && !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <NewsCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            เกิดข้อผิดพลาดในการโหลดข่าว กรุณาลองใหม่อีกครั้ง
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          ลองใหม่
        </Button>
      </div>
    )
  }

  if (allArticles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-semibold mb-2">ไม่พบข่าว</h3>
        <p className="text-muted-foreground mb-4">
          {selectedTags.length > 0 
            ? "ลองเลือกหัวข้ออื่น หรือรอข่าวใหม่"
            : "ไม่มีข่าวในขณะนี้ กรุณาลองใหม่ในภายหลัง"
          }
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allArticles.map((article, index) => (
          <NewsCard 
            key={`${article.link}-${index}`} 
            article={article}
            priority={index < 6}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <Button disabled variant="ghost">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            กำลังโหลดข่าวเพิ่มเติม...
          </Button>
        )}
        
        {!hasNextPage && allArticles.length > 0 && (
          <p className="text-muted-foreground text-center">
            คุณได้อ่านข่าวครบทั้งหมดแล้ว • โหลดข่าวทั้งหมด {allArticles.length} ข่าว
          </p>
        )}
      </div>

      {/* Scroll to Top Button */}
      {allArticles.length > 10 && (
        <Button
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-40"
          size="icon"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}