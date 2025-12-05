import { useState, useCallback } from 'react'

/**
 * Custom hook for managing state synchronized with localStorage
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @param {Function} onError - Optional error callback
 * @returns {[*, Function]} - State value and setter function
 */
export function useLocalStorage (key, defaultValue, onError = null) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      if (onError) onError(error)
      return defaultValue
    }
  })

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        // Allow value to be a function like useState
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue
        setValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
        if (onError) onError(error)
      }
    },
    [key, value, onError]
  )

  return [value, setStoredValue]
}
