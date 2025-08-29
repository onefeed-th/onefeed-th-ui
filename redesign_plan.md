# OneFeed TH - Complete UI/UX Redesign Plan

## Design Philosophy
Create a modern, clean, and highly performant news aggregator with exceptional user experience, focusing on readability, discoverability, and engagement. The design prioritizes content consumption with minimal friction while maintaining visual hierarchy and accessibility.

## 1. Design System & Theme

### 1.1 Color Palette
```css
:root {
  /* Primary Colors */
  --primary: hsl(222.2 47.4% 11.2%);          /* Dark navy for headers */
  --primary-foreground: hsl(210 40% 98%);     /* Light text on primary */
  
  /* Background Layers */
  --background: hsl(0 0% 100%);               /* Pure white */
  --background-secondary: hsl(210 40% 96.1%); /* Light gray */
  --background-elevated: hsl(0 0% 100%);      /* Card backgrounds */
  
  /* Accent Colors */
  --accent-blue: hsl(217.2 91.2% 59.8%);      /* Interactive elements */
  --accent-green: hsl(142.1 76.2% 36.3%);     /* Success states */
  --accent-red: hsl(0 84.2% 60.2%);           /* Breaking news */
  --accent-orange: hsl(24.6 95% 53.1%);       /* Trending */
  
  /* Text Colors */
  --foreground: hsl(222.2 84% 4.9%);          /* Primary text */
  --muted-foreground: hsl(215.4 16.3% 46.9%); /* Secondary text */
  
  /* Border & Dividers */
  --border: hsl(214.3 31.8% 91.4%);
  --ring: hsl(222.2 84% 4.9%);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: hsl(222.2 84% 4.9%);
    --background-secondary: hsl(217.2 32.6% 17.5%);
    --foreground: hsl(210 40% 98%);
    /* ... additional dark mode colors */
  }
}
```

### 1.2 Typography System
```typescript
const typography = {
  fonts: {
    sans: 'Inter, Noto Sans Thai, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  lineHeight: {
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  }
}
```

### 1.3 Spacing & Layout Grid
```typescript
const spacing = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  gap: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  }
}
```

## 2. Page Layouts & Components

### 2.1 Homepage Layout

```tsx
// app/page.tsx - Homepage Structure
<div className="min-h-screen bg-background">
  {/* Top Navigation Bar - Sticky */}
  <NavigationHeader />
  
  {/* Hero Section with Featured News */}
  <HeroSection />
  
  {/* Quick Filter Bar */}
  <QuickFilterBar />
  
  {/* Main Content Grid */}
  <main className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar - Categories & Sources */}
      <aside className="lg:col-span-3">
        <CategoryFilter />
        <SourceFilter />
        <TrendingTopics />
      </aside>
      
      {/* Main News Feed */}
      <section className="lg:col-span-6">
        <NewsFeed />
      </section>
      
      {/* Right Sidebar - Trending & Popular */}
      <aside className="lg:col-span-3">
        <MostRead />
        <RecentlyViewed />
        <Newsletter />
      </aside>
    </div>
  </main>
  
  {/* Floating Action Button (Mobile) */}
  <ScrollToTop />
</div>
```

### 2.2 Navigation Header Component

```tsx
// components/NavigationHeader.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Bell, Search, Menu, Bookmark, Settings } from "lucide-react"

export function NavigationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNavigation />
            </SheetContent>
          </Sheet>
          
          <a href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">OF</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              OneFeed
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            <a href="/trending" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Trending
            </a>
            <a href="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Categories
            </a>
            <a href="/sources" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Sources
            </a>
          </nav>
        </div>
        
        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              className="pl-9 pr-4"
            />
          </div>
          
          {/* Action Buttons */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Bookmarks</span>
          </Button>
          
          <ModeToggle />
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
```

### 2.3 Hero Section with Featured News

```tsx
// components/HeroSection.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Eye } from "lucide-react"
import Image from "next/image"

export function HeroSection({ featuredNews }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden h-full group cursor-pointer">
            <div className="relative aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src={featuredNews[0].image}
                alt={featuredNews[0].title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="destructive">Breaking News</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {featuredNews[0].source}
                  </Badge>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
                  {featuredNews[0].title}
                </h1>
                
                <p className="text-lg text-white/90 line-clamp-2 mb-4 hidden lg:block">
                  {featuredNews[0].description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(featuredNews[0].publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {featuredNews[0].views} views
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Secondary Featured Articles */}
        <div className="lg:col-span-4 space-y-4">
          {featuredNews.slice(1, 3).map((article, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer">
              <div className="flex gap-4">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <Badge variant="outline" className="mb-2">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{formatTime(article.publishedAt)}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 2.4 Enhanced News Card Component

```tsx
// components/NewsCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bookmark, 
  Share2, 
  MoreVertical, 
  Clock, 
  Eye,
  ExternalLink,
  Flag
} from "lucide-react"
import Image from "next/image"

interface NewsCardProps {
  article: NewsItem
  layout?: 'grid' | 'list' | 'compact'
  showImage?: boolean
  priority?: boolean
}

export function NewsCard({ 
  article, 
  layout = 'grid', 
  showImage = true,
  priority = false 
}: NewsCardProps) {
  if (layout === 'list') {
    return <NewsCardList article={article} />
  }
  
  if (layout === 'compact') {
    return <NewsCardCompact article={article} />
  }
  
  // Default grid layout
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {showImage && article.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge Overlay */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/90 backdrop-blur-sm">
              {article.category}
            </Badge>
          </div>
          
          {/* Reading Time Overlay */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {article.readingTime} min
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        {/* Source & Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-2">
            {article.sourceLogo && (
              <Image
                src={article.sourceLogo}
                alt={article.source}
                width={20}
                height={20}
                className="rounded"
              />
            )}
            <span className="font-medium">{article.source}</span>
          </div>
          <time dateTime={article.publishedAt}>
            {formatTime(article.publishedAt)}
          </time>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description}
        </p>
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          {/* Engagement Metrics */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formatNumber(article.views)}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save for later
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Loading Skeleton
export function NewsCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[16/9] w-full" />
      <CardHeader>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
```

### 2.5 Advanced Filter System

```tsx
// components/AdvancedFilter.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, X, Filter, RotateCcw } from "lucide-react"
import { format } from "date-fns"

export function AdvancedFilter() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={() => resetFilters()}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={["categories", "sources"]} className="w-full">
        {/* Categories Filter */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => toggleCategory(category.id)}
                  />
                  <span className="text-sm flex-1">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Sources Filter */}
        <AccordionItem value="sources">
          <AccordionTrigger>News Sources</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Input
                type="search"
                placeholder="Search sources..."
                className="mb-3"
              />
              <div className="max-h-48 overflow-y-auto space-y-2">
                {sources.map((source) => (
                  <label
                    key={source.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedSources.includes(source.id)}
                      onChange={(e) => toggleSource(source.id)}
                    />
                    <Image
                      src={source.logo}
                      alt={source.name}
                      width={16}
                      height={16}
                      className="rounded"
                    />
                    <span className="text-sm flex-1">{source.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Date Range Filter */}
        <AccordionItem value="date">
          <AccordionTrigger>Date Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {/* Quick Date Options */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setToday()}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setThisWeek()}>
                  This Week
                </Button>
                <Button variant="outline" size="sm" onClick={() => setThisMonth()}>
                  This Month
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCustom()}>
                  Custom
                </Button>
              </div>
              
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Advanced Options */}
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select defaultValue="relevance">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Article Length */}
              <div className="space-y-2">
                <Label>Reading Time (minutes)</Label>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 30]}
                    max={30}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Any</span>
                    <span>30+ min</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="images-only">With Images Only</Label>
                  <Switch id="images-only" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="verified-only">Verified Sources Only</Label>
                  <Switch id="verified-only" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="exclude-duplicates">Exclude Duplicates</Label>
                  <Switch id="exclude-duplicates" defaultChecked />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedSources.length > 0) && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Active Filters</Label>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedSources.map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
                <button
                  onClick={() => removeSource(source)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Apply Button */}
      <Button className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}
```

## 3. Mobile-First Responsive Design

### 3.1 Mobile Navigation Pattern
```tsx
// components/MobileNavigation.tsx
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, TrendingUp, Grid3x3, Bookmark, User } from "lucide-react"

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="grid grid-cols-5 h-16">
        <NavItem href="/" icon={<Home />} label="Home" active />
        <NavItem href="/trending" icon={<TrendingUp />} label="Trending" />
        <NavItem href="/categories" icon={<Grid3x3 />} label="Categories" />
        <NavItem href="/saved" icon={<Bookmark />} label="Saved" />
        <NavItem href="/profile" icon={<User />} label="Profile" />
      </div>
    </nav>
  )
}
```

### 3.2 Infinite Scroll Implementation
```tsx
// components/InfiniteNewsFeed.tsx
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { NewsCard, NewsCardSkeleton } from "./NewsCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function InfiniteNewsFeed({ filters }) {
  const { ref, inView } = useInView()
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["news", filters],
    queryFn: ({ pageParam = 1 }) => fetchNews({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])
  
  if (status === "loading") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  if (status === "error") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Failed to load news. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Load More Trigger */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more...
          </Button>
        ) : hasNextPage ? (
          <Button onClick={() => fetchNextPage()}>
            Load More
          </Button>
        ) : (
          <p className="text-muted-foreground">No more articles</p>
        )}
      </div>
    </>
  )
}
```

## 4. Performance Optimizations

### 4.1 Virtual Scrolling for Large Lists
```tsx
// components/VirtualNewsList.tsx
import { useVirtualizer } from "@tanstack/react-virtual"

export function VirtualNewsList({ articles }) {
  const parentRef = React.useRef()
  
  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 5,
  })
  
  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <NewsCard article={articles[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4.2 Optimistic UI Updates
```tsx
// hooks/useOptimisticBookmark.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"

export function useOptimisticBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/bookmarks/${articleId}`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to bookmark")
      return response.json()
    },
    onMutate: async (articleId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] })
      
      // Snapshot previous value
      const previousBookmarks = queryClient.getQueryData(["bookmarks"])
      
      // Optimistically update
      queryClient.setQueryData(["bookmarks"], (old) => [...old, articleId])
      
      return { previousBookmarks }
    },
    onError: (err, articleId, context) => {
      // Rollback on error
      queryClient.setQueryData(["bookmarks"], context.previousBookmarks)
      toast({
        title: "Error",
        description: "Failed to save bookmark. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Article saved to bookmarks",
      })
    },
  })
}
```

## 5. Accessibility Features

### 5.1 Keyboard Navigation
```tsx
// hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation() {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // J/K navigation
      if (e.key === "j") navigateNext()
      if (e.key === "k") navigatePrevious()
      
      // Quick actions
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault()
        focusSearch()
      }
      if (e.key === "g" && e.shiftKey) scrollToTop()
      if (e.key === "?" && e.shiftKey) openShortcutsDialog()
      
      // Number keys for quick category navigation
      if (e.key >= "1" && e.key <= "9" && !isInputFocused()) {
        navigateToCategory(parseInt(e.key) - 1)
      }
    }
    
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])
}
```

### 5.2 Screen Reader Announcements
```tsx
// components/LiveRegion.tsx
export function LiveRegion() {
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="live-region-polite"
      />
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="live-region-assertive"
      />
    </>
  )
}

// Usage
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const region = document.getElementById(`live-region-${priority}`)
  if (region) {
    region.textContent = message
    setTimeout(() => {
      region.textContent = ""
    }, 1000)
  }
}
```

## 6. Progressive Web App Features

### 6.1 Offline Support
```typescript
// service-worker.ts
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/offline",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ])
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return caches.match("/offline")
      })
    })
  )
})
```

### 6.2 Push Notifications
```tsx
// components/NotificationPrompt.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationPrompt() {
  const [permission, setPermission] = useState(Notification.permission)
  
  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === "granted") {
      // Subscribe to push notifications
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })
      
      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      })
    }
  }
  
  if (permission === "granted" || permission === "denied") {
    return null
  }
  
  return (
    <Alert>
      <Bell className="h-4 w-4" />
      <AlertTitle>Stay Updated!</AlertTitle>
      <AlertDescription>
        Get notified about breaking news and trending stories
      </AlertDescription>
      <div className="mt-4 flex gap-2">
        <Button onClick={requestPermission}>Enable Notifications</Button>
        <Button variant="outline" onClick={() => setPermission("denied")}>
          Not Now
        </Button>
      </div>
    </Alert>
  )
}
```

## 7. Analytics & Monitoring

### 7.1 User Engagement Tracking
```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, properties)
  }
  
  // Custom analytics
  fetch("/api/analytics/event", {
    method: "POST",
    body: JSON.stringify({ event: eventName, properties }),
    headers: { "Content-Type": "application/json" },
  })
}

// Usage
trackEvent("article_click", {
  article_id: article.id,
  source: article.source,
  category: article.category,
  position: index,
})
```

## 8. Implementation Priority

### Phase 1: Core UI (Week 1)
1. Install and configure shadcn/ui v4
2. Implement new navigation header
3. Create responsive grid layouts
4. Build enhanced NewsCard components

### Phase 2: UX Features (Week 2)
1. Implement infinite scroll
2. Add advanced filtering system
3. Create mobile-optimized views
4. Add keyboard navigation

### Phase 3: Performance (Week 3)
1. Implement virtual scrolling
2. Add image optimization
3. Set up React Query caching
4. Implement optimistic updates

### Phase 4: PWA & Advanced (Week 4)
1. Add offline support
2. Implement push notifications
3. Add analytics tracking
4. Deploy and monitor

## Success Metrics

- **Performance**: Lighthouse score > 95
- **Load Time**: FCP < 1.5s, TTI < 3s
- **Engagement**: Avg session > 5 min
- **Accessibility**: WCAG AA compliance
- **Mobile**: 60%+ mobile traffic with < 2% bounce rate

## Conclusion

This redesign plan creates a world-class news aggregator with exceptional UX/UI, leveraging shadcn/ui v4 components for consistency and performance. The design prioritizes content discovery, readability, and user engagement while maintaining high performance standards across all devices.