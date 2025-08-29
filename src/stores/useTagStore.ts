import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TagState {
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  toggleTag: (tag: string) => void
  clearTags: () => void
}

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      selectedTags: [],
      
      setSelectedTags: (tags) => {
        set({ selectedTags: tags })
      },
      
      addTag: (tag) => {
        const { selectedTags } = get()
        if (!selectedTags.includes(tag)) {
          const newTags = [...selectedTags, tag]
          get().setSelectedTags(newTags)
        }
      },
      
      removeTag: (tag) => {
        const { selectedTags } = get()
        const newTags = selectedTags.filter(t => t !== tag)
        get().setSelectedTags(newTags)
      },
      
      toggleTag: (tag) => {
        const { selectedTags } = get()
        const newTags = selectedTags.includes(tag)
          ? selectedTags.filter(t => t !== tag)
          : [...selectedTags, tag]
        get().setSelectedTags(newTags)
      },
      
      clearTags: () => {
        get().setSelectedTags([])
      },
    }),
    {
      name: 'tag-storage',
      partialize: (state) => ({ selectedTags: state.selectedTags }),
    }
  )
)