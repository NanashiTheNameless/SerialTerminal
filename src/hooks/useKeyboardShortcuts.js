import { useEffect } from 'react'

/**
 * Custom hook for handling global keyboard shortcuts
 * @param {Array} shortcuts - Array of shortcut configurations
 * @param {boolean} enabled - Whether shortcuts are enabled
 *
 * Shortcut format:
 * {
 *   key: string,
 *   ctrl: boolean,
 *   shift: boolean,
 *   alt: boolean,
 *   callback: function
 * }
 */
export function useKeyboardShortcuts (shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled || !shortcuts || shortcuts.length === 0) {
      return
    }

    const handleKeyDown = (event) => {
      shortcuts.forEach((shortcut) => {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const matchesCtrl = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
        const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey
        const matchesAlt = shortcut.alt ? event.altKey : !event.altKey

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault()
          shortcut.callback(event)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled])
}
