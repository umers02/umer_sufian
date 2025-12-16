"use client"

import { Moon, Sun } from "lucide-react"
import { useFilterStore } from "@/store/filter-store"
import { useEffect } from "react"

export function ThemeToggle() {
  const isDarkMode = useFilterStore((state) => state.isDarkMode)
  const toggleDarkMode = useFilterStore((state) => state.toggleDarkMode)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
    </button>
  )
}
