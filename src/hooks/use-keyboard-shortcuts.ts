"use client"

import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsOptions {
  onRefresh?: () => void
  onScrollToTop?: () => void
  onNextArticle?: () => void
  onPreviousArticle?: () => void
  onToggleTheme?: () => void
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const {
    onRefresh,
    onScrollToTop,
    onNextArticle,
    onPreviousArticle,
    onToggleTheme
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return
    }

    // Don't trigger when modifier keys are pressed (except for specific combos)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    switch (event.key.toLowerCase()) {
      case 'j':
        event.preventDefault()
        onNextArticle?.()
        break
      
      case 'k':
        event.preventDefault()
        onPreviousArticle?.()
        break
      
      case 'r':
        event.preventDefault()
        onRefresh?.()
        break
      
      case 'g':
        // Handle 'gg' for going to top
        if (event.shiftKey) {
          return
        }
        event.preventDefault()
        onScrollToTop?.()
        break
      
      case 't':
        event.preventDefault()
        onToggleTheme?.()
        break
      
      case '?':
        event.preventDefault()
        // Show help modal (could be implemented later)
        break
    }
  }, [onRefresh, onScrollToTop, onNextArticle, onPreviousArticle, onToggleTheme])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    shortcuts: {
      'j': 'Next article',
      'k': 'Previous article', 
      'r': 'Refresh',
      'g': 'Scroll to top',
      't': 'Toggle theme',
      '?': 'Show shortcuts'
    }
  }
}