import { API_BASE_URL, getFullUrl } from "./apiConfig"

// Helper functions to manually switch API environment (for testing)
export const switchToLocalAPI = () => {
  localStorage.setItem("api-environment", "local")
  window.location.reload()
}

export const switchToDeployedAPI = () => {
  localStorage.setItem("api-environment", "deployed")
  window.location.reload()
}

export const resetAPIEnvironment = () => {
  localStorage.removeItem("api-environment")
  window.location.reload()
}

export const getCurrentAPIUrl = () => API_BASE_URL

// Test API connection on load
const testConnection = async () => {
  try {
    const healthUrl = getFullUrl("/health")
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout for localhost testing
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("❌ API Connection error:", error.message)

    // If localhost fails, suggest switching to deployed
    if (API_BASE_URL.includes("localhost")) {
      // Keep error log but remove suggestion
    }
    return false
  }
}

// Test connection immediately
testConnection()

import { getAdminToken } from "./authUtils.js"

export const getProductById = async (id) => {
  try {
    const url = getFullUrl(`/product/${id}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const product = await response.json()
      return product
    } else {
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
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Headers and status logging removed

    if (response.ok) {
      const products = await response.json()
      return products
    } else {
      const errorText = await response.text()

      if (response.status === 500) {
        console.error("🔥 Server error. Check backend logs.")
      }

      return {}
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("🌐 Network error: Cannot connect to API server")
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const error = await response.json()
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    // Response logging removed

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const errorText = await response.text()

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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (response.ok) {
      const result = await response.json()
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const error = await response.json()
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
      return order
    } else {
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const error = await response.json()
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
      return orders
    } else {
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
