/**
 * Centralized API configuration utility to prevent double slashes
 * and ensure consistent URL structure across the app.
 */

const getApiBaseUrl = () => {
  // 1. Check for manual override in localStorage (useful for debugging)
  const manualOverride = typeof window !== "undefined" ? localStorage.getItem("api-environment") : null

  if (manualOverride === "local") return "http://localhost:5000/api"
  if (manualOverride === "deployed") return "https://scantappayserver.vercel.app/api"

  // 2. Determine base URL from environment variables or defaults
  let baseUrl = ""

  if (import.meta.env.VITE_NODE_ENV === "production") {
    baseUrl = import.meta.env.VITE_DEPLOYED_API_URL || "https://scantappayserver.vercel.app/api"
  } else {
    baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
  }

  // 3. Sanitize the URL: Remove trailing slash if present
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1)
  }

  // 4. Ensure /api prefix if missing (based on backend requirement)
  // Only add if it doesn't already end with /api
  if (!baseUrl.endsWith("/api")) {
    baseUrl = `${baseUrl}/api`
  }

  return baseUrl
}

export const API_BASE_URL = getApiBaseUrl()

/**
 * Constructs a full API URL for a given path, preventing double slashes.
 * @param {string} path - The endpoint path (e.g., '/auth/login')
 * @returns {string} - The full sanitized URL
 */
export const getFullUrl = (path) => {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${sanitizedPath}`
}

export default API_BASE_URL
