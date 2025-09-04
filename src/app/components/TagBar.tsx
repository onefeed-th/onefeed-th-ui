"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { useTagStore } from "@/stores/useTagStore"

// Use the actual API response format
type TagResponse = {
  data: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onefeed-th-api.artzakub.com/api/v1'

export function TagBar() {
  const { selectedTags, toggleTag, clearTags } = useTagStore()
  const [tags, setTags] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Fetch available tags from API
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/tags`)
        if (response.ok) {
          const data: TagResponse = await response.json()
          setTags(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error)
        // Use fallback tags if API fails
        setTags(["MacThai", "DroidSans", "เกมถูกบอกด้วย"])
      }
    }

    fetchTags()
  }, [])

  const handleToggleTag = (tag: string) => {
    toggleTag(tag)
  }

  const handleClearTags = () => {
    clearTags()
  }

  // Sort tags: selected tags first, then unselected tags
  const sortedTags = [...tags].sort((a, b) => {
    const aSelected = selectedTags.includes(a)
    const bSelected = selectedTags.includes(b)

    // Selected tags first
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1

    // If both selected or both unselected, maintain original order
    return 0
  })

  // Show fewer tags on mobile to prevent crowding
  const popularTagsCount = isMobile ? 2 : 6
  const popularTags = sortedTags.slice(0, popularTagsCount)
  const moreTags = sortedTags.slice(popularTagsCount)

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 sm:container sm:mx-auto sm:px-4">
        <div className="flex items-center gap-2 py-2">
          {/* Horizontal scrolling tags */}
          <ScrollArea className="flex-1 w-full">
            <div className="flex items-center gap-1.5 pb-1">
              {/* All News Button */}
              <Button
                variant={selectedTags.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={handleClearTags}
                className="shrink-0 text-[11px] sm:text-sm h-7 sm:h-8 px-2.5 sm:px-3"
              >
                ข่าวหลัก
              </Button>

              <Separator orientation="vertical" className="h-4 sm:h-5" />

              {/* Popular Tags */}
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer shrink-0 px-2 sm:px-3 h-7 sm:h-8 text-[11px] sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  onClick={() => handleToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}

              {/* More Tags Button */}
              {moreTags.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4 sm:h-5" />
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="shrink-0 text-[11px] sm:text-sm h-7 sm:h-8 px-2 sm:px-3">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">แท็กเพิ่มเติม</span>
                        <span className="sm:hidden">+{moreTags.length}</span>
                        <span className="hidden sm:inline ml-1">({moreTags.length})</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>เลือกหัวข้อที่สนใจ</SheetTitle>
                      </SheetHeader>
                      <AllTagsPanel
                        tags={sortedTags}
                        selectedTags={selectedTags}
                        onToggle={handleToggleTag}
                      />
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Selected Tags Count & Clear - Desktop Only */}
          {selectedTags.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <span className="text-xs text-muted-foreground">
                เลือก {selectedTags.length} หัวข้อ
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearTags}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                <span className="ml-1">ล้างทั้งหมด</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// All Tags Panel Component for Sheet
function AllTagsPanel({
  tags,
  selectedTags,
  onToggle
}: {
  tags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
}) {
  // Sort tags: selected tags first, then unselected tags
  const sortedTags = [...tags].sort((a, b) => {
    const aSelected = selectedTags.includes(a)
    const bSelected = selectedTags.includes(b)

    // Selected tags first
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1

    // If both selected or both unselected, maintain original order
    return 0
  })

  return (
    <div className="mt-4 ml-4 space-y-3">
      {/* Selected tags count */}
      {selectedTags.length > 0 && (
        <div className="text-sm text-muted-foreground">
          เลือกแล้ว {selectedTags.filter(tag => tags.includes(tag)).length} หัวข้อ
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 gap-2 pb-4 pr-4">
          {sortedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onToggle(tag)}
                className={`
                  w-full text-left p-4 rounded-lg border transition-all
                  active:scale-[0.98] touch-manipulation
                  ${isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'hover:bg-accent hover:border-accent-foreground active:bg-accent'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base">{tag}</span>
                  {isSelected && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {tags.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <div className="text-4xl mb-2">🏷️</div>
          <p>ไม่พบแท็กเพิ่มเติม</p>
        </div>
      )}
    </div>
  )
}