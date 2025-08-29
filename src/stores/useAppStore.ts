import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookmarkState {
  bookmarks: string[]
  addBookmark: (id: string) => void
  removeBookmark: (id: string) => void
  toggleBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean
  clearBookmarks: () => void
}

interface UIState {
  isRefreshing: boolean
  setIsRefreshing: (refreshing: boolean) => void
  lastRefreshTime: number
  setLastRefreshTime: (time: number) => void
}

interface AppState extends BookmarkState, UIState {}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Bookmark state
      bookmarks: [],
      
      addBookmark: (id) => {
        const { bookmarks } = get()
        if (!bookmarks.includes(id)) {
          set({ bookmarks: [...bookmarks, id] })
        }
      },
      
      removeBookmark: (id) => {
        const { bookmarks } = get()
        set({ bookmarks: bookmarks.filter(bookmarkId => bookmarkId !== id) })
      },
      
      toggleBookmark: (id) => {
        const { isBookmarked } = get()
        if (isBookmarked(id)) {
          get().removeBookmark(id)
        } else {
          get().addBookmark(id)
        }
      },
      
      isBookmarked: (id) => {
        const { bookmarks } = get()
        return bookmarks.includes(id)
      },
      
      clearBookmarks: () => {
        set({ bookmarks: [] })
      },

      // UI state (not persisted)
      isRefreshing: false,
      setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
      
      lastRefreshTime: 0,
      setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        bookmarks: state.bookmarks,
        lastRefreshTime: state.lastRefreshTime 
      }),
    }
  )
)