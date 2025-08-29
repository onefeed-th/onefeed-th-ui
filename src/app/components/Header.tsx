"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bookmark, Menu, RefreshCw, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Trigger news refresh event
    window.dispatchEvent(new CustomEvent('refresh-news'))
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>OneFeed Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Navigation</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      All News
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Bookmarks
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OF</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              OneFeed
            </span>
          </Link>
        </div>
        
        {/* Actions - No search, focus on reading tools */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh news</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">View bookmarks</span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}