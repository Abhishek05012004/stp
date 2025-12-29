// Environment-based API URL configuration
import { API_BASE_URL, getFullUrl } from "./apiConfig"

// Auto-detect environment or allow manual override
// const getApiBaseUrl = () => {
//   // Check if we're running on localhost
//   const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"

//   // Check for manual override in localStorage (for testing)
//   const manualOverride = localStorage.getItem("api-environment")

//   if (manualOverride === "local") {
//     console.log("🔧 Using LOCAL API (manual override):", LOCAL_API_URL)
//     return LOCAL_API_URL
//   } else if (manualOverride === "deployed") {
//     console.log("🔧 Using DEPLOYED API (manual override):", DEPLOYED_API_URL)
//     return DEPLOYED_API_URL
//   }

//   // Auto-detect based on current environment
//   if (isLocalhost) {
//     console.log("🏠 Auto-detected LOCAL environment, using:", LOCAL_API_URL)
//     return LOCAL_API_URL
//   } else {
//     console.log("🌐 Auto-detected DEPLOYED environment, using:", DEPLOYED_API_URL)
//     return DEPLOYED_API_URL
//   }
// }

// const API_BASE_URL = getApiBaseUrl()

// Helper functions to manually switch API environment (for testing)
export const switchToLocalAPI = () => {
  localStorage.setItem("api-environment", "local")
  console.log("🔧 Switched to LOCAL API. Refresh page to apply changes.")
  window.location.reload()
}

export const switchToDeployedAPI = () => {
  localStorage.setItem("api-environment", "deployed")
  console.log("🔧 Switched to DEPLOYED API. Refresh page to apply changes.")
  window.location.reload()
}

export const resetAPIEnvironment = () => {
  localStorage.removeItem("api-environment")
  console.log("🔧 Reset to AUTO-DETECT mode. Refresh page to apply changes.")
  window.location.reload()
}

export const getCurrentAPIUrl = () => API_BASE_URL

// Test API connection on load
const testConnection = async () => {
  try {
    const healthUrl = getFullUrl("/health")
    console.log("🔄 Testing API connection to:", healthUrl)
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout for localhost testing
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ API Connection successful:", result)
      return true
    } else {
      console.log("❌ API Connection failed:", response.status)
      return false
    }
  } catch (error) {
    console.error("❌ API Connection error:", error.message)

    // If localhost fails, suggest switching to deployed
    if (API_BASE_URL.includes("localhost")) {
      console.log("💡 Localhost API not available. You can switch to deployed API by running: switchToDeployedAPI()")
    }
    return false
  }
}

// Test connection immediately
testConnection()

console.log(`
🔧 API Environment Controls:
- Current API: ${API_BASE_URL}
- Switch to local: switchToLocalAPI()
- Switch to deployed: switchToDeployedAPI()  
- Reset to auto-detect: resetAPIEnvironment()
- Check current URL: getCurrentAPIUrl()
`)

import { getAdminToken } from "./authUtils.js"

export const getProductById = async (id) => {
  try {
    const url = getFullUrl(`/product/${id}`)
    console.log(`🔍 Fetching product from: ${url}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const product = await response.json()
      console.log("✅ Product found:", product)
      return product
    } else {
      console.log("❌ Product not found:", response.status)
      return null
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error)
    return null
  }
}

export const getAllProducts = async () => {
  try {
    const url = getFullUrl("/products")
    console.log(`📦 Fetching all products from: ${url}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("📡 API Response status:", response.status)
    console.log("📡 API Response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const products = await response.json()
      console.log("✅ Products fetched successfully:", Object.keys(products).length, "products")
      return products
    } else {
      const errorText = await response.text()
      console.log("❌ Failed to fetch products:", response.status, errorText)

      if (response.status === 500) {
        console.error("🔥 Server error. Check backend logs.")
      }

      return {}
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("🌐 Network error: Cannot connect to API server")
      console.log("💡 Make sure the backend server is running on", API_BASE_URL)
    }
    return {}
  }
}

export const addProduct = async (product) => {
  try {
    const token = getAdminToken()
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = getFullUrl("/products")
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(product),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Product added successfully:", result)
      return result
    } else {
      throw new Error("Failed to add product")
    }
  } catch (error) {
    console.error("❌ Error adding product:", error)
    throw error
  }
}

export const updateProductStock = async (productId, stock) => {
  try {
    const token = getAdminToken()
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = getFullUrl(`/product/${productId}/stock`)
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ stock }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Stock updated successfully:", result)
      return result
    } else {
      throw new Error("Failed to update stock")
    }
  } catch (error) {
    console.error("❌ Error updating stock:", error)
    throw error
  }
}

export const validateStockForCart = async (productId, quantity) => {
  try {
    const url = getFullUrl("/product/validate-stock")
    console.log(`🔍 Validating stock for product ${productId}, quantity: ${quantity}`)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Stock validation result:", result)
      return result
    } else {
      const error = await response.json()
      console.log("❌ Stock validation failed:", error)
      return { available: false, error: error.message }
    }
  } catch (error) {
    console.error("❌ Error validating stock:", error)
    return { available: false, error: "Network error" }
  }
}

export const validateBulkStock = async (items) => {
  try {
    const url = getFullUrl("/products/validate-bulk-stock")
    console.log("🔍 Validating bulk stock for items:", items)
    console.log("🌐 API endpoint:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    console.log("📡 Response status:", response.status)
    console.log("📡 Response headers:", response.headers)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Bulk stock validation result:", result)
      return result
    } else {
      const errorText = await response.text()
      console.log("❌ Bulk stock validation failed:", response.status, errorText)

      if (response.status === 404) {
        console.error("❌ API endpoint not found. Check if backend is deployed correctly.")
        return {
          allAvailable: false,
          error: "Stock validation service temporarily unavailable. Please try again.",
          items: items.map((item) => ({
            productId: item.productId,
            available: false,
            error: "Service unavailable",
          })),
        }
      }

      return {
        allAvailable: false,
        error: errorText || "Stock validation failed",
        items: items.map((item) => ({
          productId: item.productId,
          available: false,
          error: "Validation failed",
        })),
      }
    }
  } catch (error) {
    console.error("❌ Error validating bulk stock:", error)
    return {
      allAvailable: false,
      error: "Network error - unable to validate stock. Please check your connection and try again.",
      items: items.map((item) => ({
        productId: item.productId,
        available: false,
        error: "Network error",
      })),
    }
  }
}

export const createOrder = async (orderData) => {
  try {
    const url = getFullUrl("/orders")
    console.log("💳 Creating order at:", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Order created successfully:", result)
      return result
    } else {
      throw new Error("Failed to create order")
    }
  } catch (error) {
    console.error("❌ Error creating order:", error)
    throw error
  }
}

export const createOrderWithStockValidation = async (orderData) => {
  try {
    const url = getFullUrl("/orders/with-stock-validation")
    console.log("💳 Creating order with stock validation at:", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Order created with stock validation:", result)
      return result
    } else {
      const error = await response.json()
      console.log("❌ Order creation failed:", error)
      throw new Error(error.message || "Failed to create order")
    }
  } catch (error) {
    console.error("❌ Error creating order with stock validation:", error)
    throw error
  }
}

export const getOrderById = async (orderId) => {
  try {
    const url = getFullUrl(`/order/${orderId}`)
    const response = await fetch(url)
    if (response.ok) {
      const order = await response.json()
      console.log("✅ Order fetched successfully:", order)
      return order
    } else {
      console.log("❌ Order not found:", response.status)
      return null
    }
  } catch (error) {
    console.error("❌ Error fetching order:", error)
    return null
  }
}

export const cancelOrderAndRestoreStock = async (orderId) => {
  try {
    const url = getFullUrl(`/order/${orderId}/cancel`)
    console.log(`🔄 Cancelling order and restoring stock: ${orderId}`)
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Order cancelled and stock restored:", result)
      return result
    } else {
      const error = await response.json()
      console.log("❌ Order cancellation failed:", error)
      throw new Error(error.message || "Failed to cancel order")
    }
  } catch (error) {
    console.error("❌ Error cancelling order:", error)
    throw error
  }
}

export const getAllOrders = async () => {
  try {
    const url = getFullUrl("/orders")
    console.log(`📋 Fetching all orders from: ${url}`)
    const token = getAdminToken()
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers,
    })

    if (response.ok) {
      const orders = await response.json()
      console.log("✅ Orders fetched successfully:", orders.length, "orders")
      return orders
    } else {
      console.log("❌ Failed to fetch orders:", response.status)
      return []
    }
  } catch (error) {
    console.error("❌ Error fetching orders:", error)
    return []
  }
}

// Debug function to test API connectivity
export const testAPIConnection = async () => {
  return await testConnection()
}
