"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-gray-500 hover:text-gold-fusion transition-colors duration-300 p-1"
      aria-label="Changer le thème"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Sun size={20} strokeWidth={1.5} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon size={20} strokeWidth={1.5} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  )
}

