import { useState, useCallback } from 'react'

/**
 * Custom hook for managing individual settings in localStorage
 * Each setting is stored as a separate key-value pair
 * @param {string} prefix - Prefix for localStorage keys (e.g., 'setting:')
 * @param {Object} defaults - Default values for all settings
 * @param {Function} onError - Optional error callback
 * @returns {[Object, Function]} - Settings object and setter function
 */
export function useLocalStorage (prefix, defaults, onError = null) {
  // Load all settings from localStorage on mount
  const [settings, setSettingsState] = useState(() => {
    const loadedSettings = {}

    Object.keys(defaults).forEach(key => {
      try {
        const storageKey = `${prefix}${key}`
        const item = window.localStorage.getItem(storageKey)

        if (item !== null) {
          loadedSettings[key] = JSON.parse(item)
        } else {
          loadedSettings[key] = defaults[key]
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${prefix}${key}":`, error)
        if (onError) onError(error)
        loadedSettings[key] = defaults[key]
      }
    })

    return loadedSettings
  })

  const setSettings = useCallback(
    (newSettings) => {
      try {
        // Allow value to be a function like useState
        const settingsToStore = newSettings instanceof Function ? newSettings(settings) : newSettings

        // Save each setting to its own localStorage key
        Object.keys(settingsToStore).forEach(key => {
          try {
            const storageKey = `${prefix}${key}`
            window.localStorage.setItem(storageKey, JSON.stringify(settingsToStore[key]))
          } catch (error) {
            console.error(`Error setting localStorage key "${prefix}${key}":`, error)
            if (onError) onError(error)
          }
        })

        setSettingsState(settingsToStore)
      } catch (error) {
        console.error('Error saving settings:', error)
        if (onError) onError(error)
      }
    },
    [prefix, settings, onError]
  )

  return [settings, setSettings]
}
