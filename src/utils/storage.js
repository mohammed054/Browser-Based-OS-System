const STORAGE_PREFIX = 'browser-os-system::'

function getScopedKey(key) {
  return `${STORAGE_PREFIX}${key}`
}

export function readStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const rawValue = window.localStorage.getItem(getScopedKey(key))
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch (error) {
    console.warn(`Failed to read storage key "${key}"`, error)
    return fallbackValue
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.localStorage.setItem(getScopedKey(key), JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Failed to write storage key "${key}"`, error)
    return false
  }
}

export function removeStorage(key) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(getScopedKey(key))
  } catch (error) {
    console.warn(`Failed to remove storage key "${key}"`, error)
  }
}
