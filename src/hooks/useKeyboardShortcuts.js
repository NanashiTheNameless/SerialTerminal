import { useHotkeys } from 'react-hotkeys-hook'
import { keybind, matchesKeybind } from '../utils/keybinds'

/**
 * Custom hook for handling global keyboard shortcuts
 * @param {Array} shortcuts - Array of shortcut configurations
 * @param {boolean} enabled - Whether shortcuts are enabled
 *
 * Shortcut format:
 * {
 *   key: string,
 *   modifier: 'primary' | 'ctrl' | 'super' | 'alt',
 *   shift: boolean,
 *   callback: function
 * }
 */
export function useKeyboardShortcuts (shortcuts, enabled = true) {
  useHotkeys('*', (event) => {
    shortcuts?.forEach((shortcut) => {
      const binding = shortcut.modifier
        ? keybind(shortcut)
        : { ...shortcut, primary: shortcut.ctrl === true }
      if (matchesKeybind(event, binding)) {
        event.preventDefault()
        shortcut.callback(event)
      }
    })
  }, {
    enabled: enabled && Array.isArray(shortcuts) && shortcuts.length > 0,
    enableOnFormTags: true
  }, [shortcuts, enabled])
}
