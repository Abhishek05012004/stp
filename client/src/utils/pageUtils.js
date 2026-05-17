// Page utility functions for better UX

export const updatePageTitle = (title) => {
  // Page titles are now managed centrally in components/SEO.jsx based on routes
}

export const updatePageMeta = (title, description) => {
  // Meta tags and titles are now managed centrally in components/SEO.jsx based on routes
}

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  })
}

export const scrollToElement = (elementId, smooth = true) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    })
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      console.error("Fallback copy failed:", fallbackError)
      return false
    }
  }
}

export const formatCurrency = (amount, currency = "INR") => {
  if (currency === "INR") {
    return `₹${amount.toFixed(2)}`
  }
  return `$${amount.toFixed(2)}`
}

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }

  return new Date(date).toLocaleDateString("en-IN", defaultOptions)
}

export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  }

  return new Date(date).toLocaleTimeString("en-IN", defaultOptions)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
