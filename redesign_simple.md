# OneFeed TH - Simplified Reading-Focused Redesign

## Design Philosophy
Create a distraction-free news reading experience with elegant tag-based filtering. Focus on content consumption with minimal UI elements, emphasizing readability and smooth browsing.

## 1. Core Design Principles

### Minimalist Approach
- **Clean Interface**: Remove unnecessary elements, focus on content
- **Tag-Based Discovery**: Tags as the primary method for content filtering
- **Reading First**: Optimize for comfortable, extended reading sessions
- **Smooth Transitions**: Fluid animations and interactions

## 2. Simplified Page Structure

### 2.1 Main Layout
```tsx
// app/page.tsx - Simplified Homepage
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <Header />
      
      {/* Tag Selection Bar - Always Visible */}
      <TagBar />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <NewsFeed />
      </main>
      
      {/* Scroll to Top (Mobile) */}
      <ScrollToTop />
    </div>
  )
}
```

### 2.2 Minimal Header Component
```tsx
// components/Header.tsx
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Bookmark, Menu, RefreshCw } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchNews()
    setIsRefreshing(false)
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SideMenu />
            </SheetContent>
          </Sheet>
          
          <a href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OF</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              OneFeed
            </span>
          </a>
        </div>
        
        {/* Right Actions - Minimal */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
          
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
```

### 2.3 Enhanced Tag Selection Bar
```tsx
// components/TagBar.tsx
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, X, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Tag {
  id: string
  name: string
  count: number
  color?: string
  icon?: string
}

export function TagBar() {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTags, setShowAllTags] = useState(false)
  
  useEffect(() => {
    // Load saved tags from localStorage
    const saved = localStorage.getItem("selectedTags")
    if (saved) setSelectedTags(JSON.parse(saved))
    
    // Fetch available tags
    fetchTags()
  }, [])
  
  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(updated)
    localStorage.setItem("selectedTags", JSON.stringify(updated))
    
    // Trigger news refresh
    window.dispatchEvent(new CustomEvent('tags-changed', { detail: updated }))
  }
  
  const clearAllTags = () => {
    setSelectedTags([])
    localStorage.removeItem("selectedTags")
    window.dispatchEvent(new CustomEvent('tags-changed', { detail: [] }))
  }
  
  // Popular tags shown in the bar
  const popularTags = tags.slice(0, 8)
  const moreTags = tags.slice(8)
  
  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Quick Tags - Horizontal Scroll */}
          <ScrollArea className="flex-1">
            <div className="flex items-center gap-2 pb-1">
              {/* All News Button */}
              <Button
                variant={selectedTags.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={clearAllTags}
                className="shrink-0"
              >
                All News
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Popular Tags */}
              {popularTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer shrink-0 px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                  {tag.count > 0 && (
                    <span className="ml-1 text-xs opacity-60">
                      {tag.count}
                    </span>
                  )}
                </Badge>
              ))}
              
              {/* More Tags Button */}
              {moreTags.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Filter className="h-4 w-4 mr-2" />
                        More Tags ({moreTags.length})
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>All Tags</SheetTitle>
                        <SheetDescription>
                          Select tags to filter news articles
                        </SheetDescription>
                      </SheetHeader>
                      <AllTagsPanel 
                        tags={tags}
                        selectedTags={selectedTags}
                        onToggle={toggleTag}
                      />
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* Selected Tags Count */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground">
                {selectedTags.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllTags}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// All Tags Panel Component
function AllTagsPanel({ tags, selectedTags, onToggle }) {
  const categories = {
    "News": ["Politics", "Business", "World", "Local"],
    "Lifestyle": ["Health", "Food", "Travel", "Fashion"],
    "Entertainment": ["Movies", "Music", "Celebrity", "TV"],
    "Sports": ["Football", "Basketball", "Tennis", "Boxing"],
    "Technology": ["Gadgets", "Apps", "AI", "Gaming"],
    "Other": ["Weather", "Education", "Science", "Auto"]
  }
  
  return (
    <div className="mt-6 space-y-6">
      {Object.entries(categories).map(([category, categoryTags]) => (
        <div key={category}>
          <h3 className="font-semibold mb-3">{category}</h3>
          <div className="grid grid-cols-2 gap-2">
            {categoryTags.map((tagName) => {
              const tag = tags.find(t => t.name === tagName)
              if (!tag) return null
              
              return (
                <div
                  key={tag.id}
                  onClick={() => onToggle(tag.id)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${selectedTags.includes(tag.id) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:bg-accent hover:border-accent-foreground'
                    }
                  `}
                >
                  <div className="font-medium">{tag.name}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {tag.count} articles
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 2.4 Simplified News Feed
```tsx
// components/NewsFeed.tsx
import { useState, useEffect } from "react"
import { NewsCard } from "./NewsCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function NewsFeed() {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  
  // Listen for tag changes
  useEffect(() => {
    const handleTagChange = (event: CustomEvent) => {
      setArticles([])
      setPage(1)
      setHasMore(true)
      fetchNews(1, event.detail)
    }
    
    window.addEventListener('tags-changed', handleTagChange)
    return () => window.removeEventListener('tags-changed', handleTagChange)
  }, [])
  
  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchNews(page + 1)
    }
  }, [inView])
  
  const fetchNews = async (pageNum: number, tags?: string[]) => {
    setLoading(true)
    
    const selectedTags = tags || JSON.parse(localStorage.getItem("selectedTags") || "[]")
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: selectedTags,
          page: pageNum,
          limit: 20,
        }),
      })
      
      const data = await response.json()
      
      if (pageNum === 1) {
        setArticles(data.data || [])
      } else {
        setArticles(prev => [...prev, ...(data.data || [])])
      }
      
      setPage(pageNum)
      setHasMore(data.data?.length === 20)
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Initial load
  useEffect(() => {
    fetchNews(1)
  }, [])
  
  return (
    <div className="relative">
      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard 
            key={`${article.link}-${index}`} 
            article={article}
            priority={index < 6}
          />
        ))}
        
        {/* Loading Skeletons */}
        {loading && (
          <>
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>
      
      {/* Load More Trigger */}
      <div ref={ref} className="py-8 flex justify-center">
        {loading && hasMore && (
          <Button disabled variant="ghost">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more articles...
          </Button>
        )}
        
        {!hasMore && articles.length > 0 && (
          <p className="text-muted-foreground">
            You've reached the end • {articles.length} articles loaded
          </p>
        )}
      </div>
      
      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try selecting different tags or check back later for new content
          </p>
        </div>
      )}
      
      {/* Scroll to Top Button */}
      {articles.length > 10 && (
        <Button
          className="fixed bottom-6 right-6 rounded-full shadow-lg"
          size="icon"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
```

### 2.5 Clean News Card Design
```tsx
// components/NewsCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, ExternalLink, Clock } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface NewsCardProps {
  article: NewsItem
  priority?: boolean
}

export function NewsCard({ article, priority = false }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsBookmarked(!isBookmarked)
    // Save to localStorage or API
  }
  
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image */}
        {article.image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        <CardContent className="p-5">
          {/* Source & Time */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              {article.source}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          {/* Description */}
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {article.description}
            </p>
          )}
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </a>
      
      {/* Actions - Outside link area */}
      <div className="flex items-center justify-between px-5 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="h-8"
        >
          <Bookmark 
            className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} 
          />
          <span className="ml-2 text-xs">
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        </Button>
        
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Read more
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  )
}

// Loading Skeleton
export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
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
      <div className="px-5 pb-4">
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  )
}
```

## 3. Mobile Optimizations

### 3.1 Mobile-First Tag Selection
```tsx
// components/MobileTagSheet.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function MobileTagSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Select Topics</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 overflow-y-auto">
          {/* Tag categories with larger touch targets for mobile */}
          <TagCategories />
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### 3.2 Pull to Refresh
```tsx
// hooks/usePullToRefresh.ts
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  
  useEffect(() => {
    let startY = 0
    let currentY = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!startY) return
      
      currentY = e.touches[0].clientY
      const distance = currentY - startY
      
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, 150))
        setIsPulling(distance > 80)
      }
    }
    
    const handleTouchEnd = async () => {
      if (isPulling && pullDistance > 80) {
        await onRefresh()
      }
      
      setIsPulling(false)
      setPullDistance(0)
      startY = 0
    }
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance])
  
  return { isPulling, pullDistance }
}
```

## 4. Color Scheme & Theme

### 4.1 Simplified Color Palette
```css
:root {
  /* Light Mode */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  --border: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}
```

## 5. Performance Features

### 5.1 Optimized Data Fetching
```tsx
// lib/api.ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

// Prefetch tags on app load
export async function prefetchTags() {
  await queryClient.prefetchQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })
}
```

### 5.2 Image Loading Strategy
```tsx
// components/OptimizedImage.tsx
export function OptimizedImage({ src, alt, priority = false }) {
  const [error, setError] = useState(false)
  
  if (error || !src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setError(true)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  )
}
```

## 6. Implementation Checklist

### Phase 1: Core Reading Experience (Day 1-2)
- [ ] Set up simplified header without search
- [ ] Implement tag bar with horizontal scroll
- [ ] Create clean news card design
- [ ] Add infinite scroll functionality

### Phase 2: Tag System Enhancement (Day 3-4)
- [ ] Build tag selection sheet/modal
- [ ] Implement tag persistence in localStorage
- [ ] Add tag filtering logic
- [ ] Create tag categories organization

### Phase 3: Polish & Optimization (Day 5)
- [ ] Add loading states and skeletons
- [ ] Implement pull to refresh (mobile)
- [ ] Add bookmark functionality
- [ ] Optimize image loading

## Key Features Summary

1. **No Search** - Removed all search functionality as requested
2. **Tag-Focused** - Enhanced tag selection as primary navigation
3. **Clean Reading** - Minimalist design focused on content
4. **Smart Loading** - Infinite scroll with optimized performance
5. **Mobile-First** - Touch-friendly with pull-to-refresh
6. **Fast & Smooth** - Optimized images and caching strategy

This simplified design creates a distraction-free news reading experience where users discover content through tag selection rather than search, providing a more curated and focused browsing experience.