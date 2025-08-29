"use client"

import { useRef, useCallback, Suspense } from "react"
import { Header } from "./Header"
import { TagBar } from "./TagBar"
import { NewsFeed } from "./NewsFeed"
import { NewsCardSkeleton } from "./NewsCard"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useTheme } from "next-themes"
import { ErrorBoundary } from "@/components/error-boundary"
import { NewsErrorFallback } from "@/components/news-error-boundary"
import type { NewsItem } from "./NewsCard"

interface HomePageProps {
  initialNews: NewsItem[]
}

export function HomePage({ initialNews }: HomePageProps) {
  const { setTheme, theme } = useTheme()
  const mainRef = useRef<HTMLElement>(null)

  const handleRefresh = async () => {
    // Trigger news refresh
    window.dispatchEvent(new CustomEvent('refresh-news'))
  }

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToNextArticle = useCallback(() => {
    const articles = document.querySelectorAll('[data-article-card]')
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i] as HTMLElement
      const rect = article.getBoundingClientRect()
      
      if (rect.top > 100) { // 100px buffer from top
        article.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }, [])

  const scrollToPreviousArticle = useCallback(() => {
    const articles = document.querySelectorAll('[data-article-card]')
    
    for (let i = articles.length - 1; i >= 0; i--) {
      const article = articles[i] as HTMLElement
      const rect = article.getBoundingClientRect()
      
      if (rect.top < -100) { // 100px buffer from top
        article.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  useKeyboardShortcuts({
    onRefresh: handleRefresh,
    onScrollToTop: scrollToTop,
    onNextArticle: scrollToNextArticle,
    onPreviousArticle: scrollToPreviousArticle,
    onToggleTheme: toggleTheme,
  })

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background">
        {/* Minimal Header - No search, focus on reading tools */}
        <Header />
        
        {/* Enhanced Tag Bar - Primary content discovery */}
        <TagBar />
        
        {/* Main Content Area */}
        <main ref={mainRef} className="container mx-auto px-4 py-6 max-w-7xl">
          <ErrorBoundary fallback={NewsErrorFallback}>
            <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <NewsCardSkeleton key={i} />)}</div>}>
              <NewsFeed initialNews={initialNews} />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </PullToRefresh>
  )
}