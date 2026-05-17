import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Centralized SEO component that dynamically and consistently updates the 
 * document title and meta description based on the active route.
 */
const SEO = () => {
  const location = useLocation()

  useEffect(() => {
    let title = "Scan Tap Pay - Smart Payment Solutions"
    let description = "Scan QR codes or tap NFC tags to instantly add products to cart and make secure payments. Experience seamless shopping!"

    const pathname = location.pathname

    if (pathname === "/") {
      title = "Scan Tap Pay - Smart Payment Solutions"
      description = "Scan QR codes or tap NFC tags to instantly add products to cart and make secure payments. Experience seamless shopping!"
    } else if (pathname === "/scanner") {
      title = "QR Scanner | Scan Tap Pay"
      description = "Point your camera at a product QR code to instantly add it to your shopping cart."
    } else if (pathname === "/nfc-reader") {
      title = "NFC Reader | Scan Tap Pay"
      description = "Tap an NFC-enabled product to instantly add it to your shopping cart."
    } else if (pathname === "/manual-entry") {
      title = "Manual Product Entry | Scan Tap Pay"
      description = "Search and select from our available catalog or manually enter a product ID."
    } else if (pathname === "/cart") {
      title = "Shopping Cart | Scan Tap Pay"
      description = "Review your selected items, adjust quantities, and proceed to checkout."
    } else if (pathname === "/payment") {
      title = "Secure Checkout | Scan Tap Pay"
      description = "Complete your payment securely using our encrypted online payment solutions."
    } else if (pathname === "/invoice") {
      let orderId = ""
      try {
        const lastOrder = localStorage.getItem("lastOrder")
        if (lastOrder) {
          const parsed = JSON.parse(lastOrder)
          if (parsed && parsed.id) {
            orderId = ` #${parsed.id}`
          }
        }
      } catch (e) {
        console.error("Error reading lastOrder for SEO:", e)
      }
      title = `Invoice${orderId} | Scan Tap Pay`
      description = "View and download your digital receipt and transaction invoice."
    } else if (pathname === "/orders") {
      title = "Order History | Scan Tap Pay"
      description = "Track and manage your recent orders, transaction receipts, and digital invoices."
    } else if (pathname === "/nfc-manager") {
      title = "NFC Manager | Scan Tap Pay"
      description = "Configure, manage, and write product data onto NFC tags."
    } else if (pathname === "/admin-login") {
      title = "Admin Login | Scan Tap Pay"
      description = "Secure access login portal for Scan Tap Pay administration dashboard."
    } else if (pathname.startsWith("/admin")) {
      const parts = pathname.split("/")
      const tab = parts[2] || "overview"
      const tabTitles = {
        overview: "Admin Overview",
        orders: "Admin Orders",
        inventory: "Admin Inventory",
        settings: "Admin Settings",
      }
      const activeTabTitle = tabTitles[tab.toLowerCase()] || "Admin Dashboard"
      title = `${activeTabTitle} | Scan Tap Pay`
      description = "Manage products, track completed orders, view sales analytics, and update settings."
    }

    // Set Document Title
    document.title = title

    // Set Meta Description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", description)
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = description
      document.head.appendChild(meta)
    }

    // Set Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement("meta")
      ogTitle.setAttribute("property", "og:title")
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = title

    // Set Open Graph Description
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) {
      ogDescription = document.createElement("meta")
      ogDescription.setAttribute("property", "og:description")
      document.head.appendChild(ogDescription)
    }
    ogDescription.content = description

  }, [location])

  return null
}

export default SEO
