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

  // Show first 6 sorted tags in the bar, rest in the sheet
  const popularTags = sortedTags.slice(0, 6)
  const moreTags = sortedTags.slice(6)

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Horizontal scrolling tags */}
          <ScrollArea className="flex-1">
            <div className="flex items-center gap-2 pb-1">
              {/* All News Button */}
              <Button
                variant={selectedTags.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={handleClearTags}
                className="shrink-0"
              >
                ข่าวหลัก
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Popular Tags */}
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer shrink-0 px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleToggleTag(tag)}
                >
                  {tag}
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
                        แท็กเพิ่มเติม ({moreTags.length})
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>เลือกหัวข้อที่สนใจ</SheetTitle>
                      </SheetHeader>
                      <AllTagsPanel 
                        tags={moreTags}
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
          
          {/* Selected Tags Count & Clear */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground">
                เลือก {selectedTags.length} หัวข้อ
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearTags}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                ล้างทั้งหมด
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
    <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 gap-2">
        {sortedTags.map((tag) => (
          <div
            key={tag}
            onClick={() => onToggle(tag)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm
              ${selectedTags.includes(tag) 
                ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                : 'hover:bg-accent hover:border-accent-foreground'
              }
            `}
          >
            <div className="font-medium text-sm">{tag}</div>
          </div>
        ))}
      </div>
      
      {tags.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <div className="text-4xl mb-2">🏷️</div>
          <p>ไม่พบแท็กเพิ่มเติม</p>
        </div>
      )}
    </div>
  )
}