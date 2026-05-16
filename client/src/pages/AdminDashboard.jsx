"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { makeAuthenticatedRequest } from "../utils/authUtils.js"
import { getFullUrl } from "../utils/apiConfig.js"
import { InvoiceDisplay, generateEmailInvoiceHTML } from "../components/InvoiceTemplate.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGears,
  faHouse,
  faRightFromBracket,
  faChartSimple,
  faClipboardList,
  faBox,
  faChartLine,
  faGear,
  faTriangleExclamation,
  faBan,
  faMoneyBillWave,
  faPlus,
  faArrowsRotate,
  faFileInvoice,
  faPaperPlane,
  faEdit,
  faXmark,
  faDownload,
  faEnvelope,
  faCheckSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

const AdminDashboard = () => {
  const [products, setProducts] = useState({})
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { tab } = useParams()
  const [activeTab, setActiveTab] = useState(tab || "overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
  })
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [bulkUpdateMode, setBulkUpdateMode] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [bulkStockValue, setBulkStockValue] = useState("")

  // Invoice modal state
  const [invoiceModal, setInvoiceModal] = useState(null)
  const [resendModal, setResendModal] = useState(null)
  const [editedInvoiceNote, setEditedInvoiceNote] = useState("")
  const [selectedOrdersForResend, setSelectedOrdersForResend] = useState(new Set())
  const [bulkResendMode, setBulkResendMode] = useState(false)
  const [sendingInvoice, setSendingInvoice] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false) // for checkmark animation
  const invoiceRef = useRef(null)

  const { admin, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab, activeTab])

  // View invoice in modal (no navigation)
  const openInvoiceModal = (order) => {
    const orderData = {
      ...order,
      transactionId: order.transactionId || `TXN${order.id}`,
      paymentMethod: order.paymentMethod || "Online Payment",
      tax: order.tax || order.total * 0.18,
      finalTotal: order.total,
      status: order.status || "completed",
      customerEmail: order.customerEmail || "N/A",
    }
    setInvoiceModal(orderData)
  }

  // Resend invoice to a single order's email (with optional edit)
  const handleResendInvoice = async (order, overrideEmail = null, extraNote = "") => {
    setSendingInvoice(true)
    setSendSuccess(false)
    try {
      const effectiveEmail = overrideEmail && overrideEmail !== order.customerEmail ? overrideEmail : null
      const orderData = {
        ...order,
        transactionId: order.transactionId || `TXN${order.id}`,
        paymentMethod: order.paymentMethod || "Online Payment",
        tax: order.tax || 0,
        finalTotal: order.total,
        status: order.status || "completed",
        customerEmail: effectiveEmail || order.customerEmail,
      }
      const invoiceHTML = generateEmailInvoiceHTML(orderData) + (extraNote ? `<p style="margin:20px;color:#555;">${extraNote}</p>` : "")
      const res = await fetch(getFullUrl("/payment/resend-invoice"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: [{ orderData, invoiceHTML, overrideEmail: effectiveEmail || undefined }] }),
      })
      const data = await res.json()
      if (data.success) {
        // If admin provided a different email, update it in the DB and local state
        if (effectiveEmail) {
          try {
            await makeAuthenticatedRequest(`/order/${order.id}/email`, {
              method: "PUT",
              body: JSON.stringify({ customerEmail: effectiveEmail }),
            })
            // Update local orders list so UI reflects immediately
            setOrders((prev) =>
              prev.map((o) => (o.id === order.id ? { ...o, customerEmail: effectiveEmail } : o))
            )
          } catch (emailErr) {
            console.warn("Could not update email in DB:", emailErr)
          }
        }
        setSendSuccess(true)
        // Auto-close after short delay showing success
        setTimeout(() => {
          setResendModal(null)
          setSendSuccess(false)
        }, 1800)
      } else {
      }
    } catch (e) {
    } finally {
      setSendingInvoice(false)
    }
  }

  // Bulk resend invoices to all selected orders
  const handleBulkResendInvoices = async () => {
    if (selectedOrdersForResend.size === 0) {
      return
    }
    setSendingInvoice(true)
    setSendSuccess(false)
    try {
      const selectedList = orders.filter((o) => selectedOrdersForResend.has(o.id))
      const payload = selectedList.map((order) => {
        const orderData = {
          ...order,
          transactionId: order.transactionId || `TXN${order.id}`,
          paymentMethod: order.paymentMethod || "Online Payment",
          tax: order.tax || 0,
          finalTotal: order.total,
          status: order.status || "completed",
        }
        return { orderData, invoiceHTML: generateEmailInvoiceHTML(orderData) }
      })
      const res = await fetch(getFullUrl("/payment/resend-invoice"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: payload }),
      })
      const data = await res.json()
      if (data.success) {
        setSendSuccess(true)
        setTimeout(() => {
          setSelectedOrdersForResend(new Set())
          setBulkResendMode(false)
          setSendSuccess(false)
        }, 1800)
      } else {
      }
    } catch (e) {
    } finally {
      setSendingInvoice(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login")
      return
    }
    fetchData()
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const tabTitles = {
      overview: "Admin Dashboard - Overview",
      orders: "Admin Dashboard - Orders",
      inventory: "Admin Dashboard - Inventory",
      analytics: "Admin Dashboard - Analytics",
      settings: "Admin Dashboard - Settings",
    }
    document.title = tabTitles[activeTab] || "Admin Dashboard"
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsResponse, ordersResponse] = await Promise.all([
        makeAuthenticatedRequest("/products"),
        makeAuthenticatedRequest("/orders"),
      ])

      const productsData = await productsResponse.json()
      const ordersData = await ordersResponse.json()

      setProducts(productsData || {})
      setOrders(ordersData || [])

      // Low stock notification check (≤ 5 units)
      const lowStockItems = Object.values(productsData || {}).filter((p) => p.stock <= 5)
      if (lowStockItems.length > 0) {
        lowStockItems.forEach((item) => {
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (productId, newStock) => {
    try {
      await makeAuthenticatedRequest(`/product/${productId}/stock`, {
        method: "PUT",
        body: JSON.stringify({ stock: Number.parseInt(newStock) }),
      })

      setProducts((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          stock: Number.parseInt(newStock),
        },
      }))
      setEditingProduct(null)
    } catch (error) {
      console.error("Error updating stock:", error)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        stock: Number.parseInt(newProduct.stock),
      }

      const response = await makeAuthenticatedRequest("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        await fetchData() // Refresh data
        setNewProduct({
          id: "",
          name: "",
          price: "",
          description: "",
          category: "",
          stock: "",
          image: "",
        })
        setShowAddProduct(false)
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleBulkStockUpdate = async () => {
    if (!bulkStockValue || selectedProducts.size === 0) {
      return
    }

    try {
      const updatePromises = Array.from(selectedProducts).map((productId) =>
        makeAuthenticatedRequest(`/product/${productId}/stock`, {
          method: "PUT",
          body: JSON.stringify({ stock: Number.parseInt(bulkStockValue) }),
        }),
      )

      await Promise.all(updatePromises)
      await fetchData() // Refresh data
      setSelectedProducts(new Set())
      setBulkStockValue("")
      setBulkUpdateMode(false)
    } catch (error) {
      console.error("Error bulk updating stock:", error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      const response = await makeAuthenticatedRequest(`/product/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/admin-login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getCategories = () => {
    const categories = new Set(Object.values(products).map((p) => p.category))
    return Array.from(categories)
  }

  const getAnalytics = () => {
    const productList = Object.values(products)
    const totalProducts = productList.length
    const totalStock = productList.reduce((sum, p) => sum + p.stock, 0)
    const lowStockProducts = productList.filter((p) => p.stock <= 10).length
    const outOfStockProducts = productList.filter((p) => p.stock === 0).length
    const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, order) => sum + (order.total || 0), 0)
    const completedOrders = orders.filter((o) => o.status === "completed").length

    return {
      totalProducts,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      totalRevenue,
      completedOrders,
      totalOrders: orders.length,
    }
  }

  const analytics = getAnalytics()

  const filteredProducts = Object.values(products).filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "available" && product.stock > 0) ||
      (stockFilter === "low" && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === "out" && product.stock === 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#666", margin: 0 }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeScaleIn {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
      }

      /* Responsive Container */
      .admin-container {
        padding: 2rem;
        width: 100%;
        margin: 0;
        transition: padding 0.3s ease;
      }

      /* Responsive Header */
      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
        gap: 1.5rem;
      }

      /* Responsive Navigation */
      .admin-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #e9ecef;
        overflow-x: auto;
        padding-bottom: 5px; /* Space for scrollbar */
      }
      .admin-tabs::-webkit-scrollbar {
        height: 4px;
        display: block;
      }
      .admin-tabs::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      /* Analytics Grid */
      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      /* Section Card */
      .admin-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      }

      /* Filter Grid */
      .filter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      /* Responsive Table Wrapper */
      .table-wrapper {
        overflow-x: auto;
        border-radius: 8px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        background: #f8f9fa;
      }

      /* Product Grid */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      /* Responsive Media Queries */
      @media (max-width: 1024px) {
        .admin-container { padding: 1.5rem; }
        .analytics-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
      }

      @media (max-width: 768px) {
        .admin-header {
          flex-direction: column;
          text-align: center;
          padding: 1.5rem;
        }
        .header-actions {
          width: 100%;
          justify-content: center;
        }
        .admin-card { padding: 1.5rem; }
        .analytics-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }
        .analytics-card { padding: 1.5rem !important; }
        .analytics-card svg, .analytics-card i { font-size: 1.5rem !important; }
        .analytics-card div:nth-child(2) { font-size: 1.5rem !important; }
      }

      @media (max-width: 480px) {
        .admin-container { padding: 0.75rem; }
        .admin-header h1 { font-size: 1.5rem !important; }
        .admin-header p { font-size: 0.85rem !important; }
        .header-actions { flex-direction: column; width: 100%; }
        .header-actions > * { width: 100%; text-align: center; justify-content: center; }
        .admin-card { padding: 1rem; }
        .filter-grid { grid-template-columns: 1fr; }
        .product-grid { grid-template-columns: 1fr; }
        .admin-tabs button { padding: 0.75rem 1rem !important; font-size: 0.85rem !important; }
      }
    `}</style>
    <div
      className="admin-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <div className="admin-header">
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h1 style={{ margin: "0 0 0.5rem 0", color: "#333", fontSize: "1.75rem" }}>
            <FontAwesomeIcon icon={faGears} /> Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
            Welcome back, <strong>{admin?.username || "Admin"}</strong>! Manage inventory and orders.
          </p>
        </div>
        <div className="header-actions" style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            <FontAwesomeIcon icon={faHouse} /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        {[
          { id: "overview", label: "Overview", icon: faChartSimple },
          { id: "orders", label: "Orders", icon: faClipboardList },
          { id: "inventory", label: "Inventory", icon: faBox },
          { id: "settings", label: "Settings", icon: faGear },
        ].map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => navigate(`/admin/${tabItem.id}`)}
            style={{
              padding: "1rem 1.5rem",
              background: activeTab === tabItem.id ? "#007bff" : "transparent",
              color: activeTab === tabItem.id ? "white" : "#666",
              border: "none",
              borderBottom: activeTab === tabItem.id ? "3px solid #007bff" : "3px solid transparent",
              cursor: "pointer",
              fontWeight: activeTab === tabItem.id ? "600" : "400",
              whiteSpace: "nowrap",
            }}
          >
            <FontAwesomeIcon icon={tabItem.icon} style={{ marginRight: "0.5rem" }} />
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Analytics Cards */}
          <div className="analytics-grid">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {analytics.totalProducts}
              </div>
              <div>Total Products</div>
            </div>

            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faChartSimple} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {analytics.totalStock}
              </div>
              <div>Total Stock Units</div>
            </div>

            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {analytics.lowStockProducts}
              </div>
              <div>Low Stock Alerts</div>
            </div>

            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faBan} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {analytics.outOfStockProducts}
              </div>
              <div>Out of Stock</div>
            </div>

            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                ₹{analytics.totalRevenue.toFixed(2)}
              </div>
              <div>Total Revenue</div>
            </div>

            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {analytics.completedOrders}
              </div>
              <div>Completed Orders</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-card">
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Quick Actions</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => setShowAddProduct(true)}
                style={{
                  padding: "1rem",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> Add New Product
              </button>



              <button
                onClick={() => setActiveTab("inventory")}
                style={{
                  padding: "1rem",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} /> Manage Inventory
              </button>

              <button
                onClick={fetchData}
                style={{
                  padding: "1rem",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} /> Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          {/* Orders Header */}
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h2 style={{ margin: 0, color: "#333", fontSize: "1.5rem" }}>📋 Order Management</h2>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    setBulkResendMode(!bulkResendMode)
                    setSelectedOrdersForResend(new Set())
                  }}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: bulkResendMode ? "#6c757d" : "#6f42c1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  {bulkResendMode ? "Cancel Bulk Select" : "Bulk Resend Invoices"}
                </button>
                {bulkResendMode && selectedOrdersForResend.size > 0 && (
                  <button
                    onClick={handleBulkResendInvoices}
                    disabled={sendingInvoice || sendSuccess}
                    style={{
                      padding: "0.6rem 1.2rem",
                      background: sendSuccess ? "#10b981" : sendingInvoice ? "#28a745" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: sendingInvoice || sendSuccess ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      minWidth: "160px",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    {sendSuccess ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        All Sent!
                      </>
                    ) : sendingInvoice ? (
                      <>
                        <span style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                          flexShrink: 0,
                        }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {`Send to ${selectedOrdersForResend.size} order(s)`}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Order Filters */}
            <div className="filter-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Search Orders
                </label>
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Status Filter
                </label>
                <select
                  value="completed"
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    background: "#f8f9fa",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                >
                  <option value="completed">Completed Payments Only</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Date Range
                </label>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    {bulkResendMode && (
                      <th style={{ padding: "1rem", width: "40px" }}>
                        <input
                          type="checkbox"
                          style={{ width: "16px", height: "16px", accentColor: "#6f42c1" }}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrdersForResend(new Set(orders.map((o) => o.id)))
                            } else {
                              setSelectedOrdersForResend(new Set())
                            }
                          }}
                          checked={orders.length > 0 && selectedOrdersForResend.size === orders.length}
                        />
                      </th>
                    )}
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Order ID</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Customer</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Products</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Amount</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Payment</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Status</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Date</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#333" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((order) => {
                      const matchesSearch =
                        searchTerm === "" ||
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                      
                      // Only show completed orders as requested
                      return matchesSearch && order.status === "completed"
                    })
                    .map((order, index) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: "1px solid #e9ecef",
                          background: bulkResendMode && selectedOrdersForResend.has(order.id) ? "#f0e6ff" : "white",
                        }}
                      >
                        {bulkResendMode && (
                          <td style={{ padding: "1rem", width: "40px" }}>
                            <input
                              type="checkbox"
                              style={{ width: "16px", height: "16px", accentColor: "#6f42c1" }}
                              checked={selectedOrdersForResend.has(order.id)}
                              onChange={(e) => {
                                const next = new Set(selectedOrdersForResend)
                                if (e.target.checked) next.add(order.id)
                                else next.delete(order.id)
                                setSelectedOrdersForResend(next)
                              }}
                            />
                          </td>
                        )}
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#007bff", fontSize: "0.8rem" }}>
                          {order.id}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div>
                            <div style={{ fontWeight: "600" }}>{order.customerName || "Guest Customer"}</div>
                            <div style={{ fontSize: "0.875rem", color: "#666" }}>{order.customerEmail || "N/A"}</div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontSize: "0.875rem" }}>
                            {order.items ? `${order.items.length} item(s)` : "N/A"}
                          </div>
                        </td>
                        <td style={{ padding: "1rem", fontWeight: "600" }}>
                          ₹{order.total ? order.total.toFixed(2) : "0.00"}
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.82rem", color: "#444" }}>
                          {order.paymentMethod || "Online Payment"}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              background:
                                order.status === "completed"
                                  ? "#d4edda"
                                  : order.status === "pending"
                                    ? "#fff3cd"
                                    : "#f8d7da",
                              color:
                                order.status === "completed"
                                  ? "#155724"
                                  : order.status === "pending"
                                    ? "#856404"
                                    : "#721c24",
                            }}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#666" }}>
                          {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button
                              onClick={() => openInvoiceModal(order)}
                              style={{
                                padding: "0.4rem 0.8rem",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.72rem",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <FontAwesomeIcon icon={faFileInvoice} /> View
                            </button>
                            <button
                              onClick={() => {
                                setResendModal(order)
                                setEditedInvoiceNote("")
                              }}
                              style={{
                                padding: "0.4rem 0.8rem",
                                background: "#6f42c1",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.72rem",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} /> Resend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div>
          {/* Product Management Quick Actions */}
          <div className="admin-card">
            <h3 style={{ margin: 0, color: "#333", fontSize: "1.25rem" }}>
              <FontAwesomeIcon icon={faBox} style={{ marginRight: "0.5rem" }} />
              Product Management
            </h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowAddProduct(true)}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Product
              </button>
              <button
                onClick={() => {
                  const csvData = Object.values(products)
                    .map((p) => `${p.id},${p.name},${p.price},${p.stock},${p.category}`)
                    .join("\n")
                  const blob = new Blob([`ID,Name,Price,Stock,Category\n${csvData}`], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "products.csv"
                  a.click()
                }}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faDownload} /> Export
              </button>
              <button
                onClick={fetchData}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} /> Refresh
              </button>
            </div>
          </div>
          {/* Filters */}
          <div className="admin-card">
            <div className="filter-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                >
                  <option value="all">All Categories</option>
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Stock Status
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                >
                  <option value="all">All Products</option>
                  <option value="available">In Stock</option>
                  <option value="low">Low Stock (≤10)</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    visibility: "hidden",
                  }}
                >
                  Action
                </label>
                <button
                  onClick={() => setBulkUpdateMode(true)}
                  disabled={bulkUpdateMode}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: bulkUpdateMode ? "#6c757d" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: bulkUpdateMode ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FontAwesomeIcon icon={faBox} /> Bulk Stock Update
                </button>
              </div>
            </div>

            {/* Bulk Update Controls */}
            {bulkUpdateMode && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  border: "2px solid #007bff",
                }}
              >
                <h4 style={{ marginBottom: "1rem", color: "#007bff" }}>📦 Bulk Stock Update Mode</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "end",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1", minWidth: "200px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                      }}
                    >
                      New Stock Value
                    </label>
                    <input
                      type="number"
                      placeholder="Enter stock quantity"
                      value={bulkStockValue}
                      onChange={(e) => setBulkStockValue(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #007bff",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleBulkStockUpdate}
                    disabled={selectedProducts.size === 0 || !bulkStockValue}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: selectedProducts.size === 0 || !bulkStockValue ? "#6c757d" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: selectedProducts.size === 0 || !bulkStockValue ? "not-allowed" : "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Update Selected ({selectedProducts.size})
                  </button>
                  <button
                    onClick={() => {
                      setBulkUpdateMode(false)
                      setSelectedProducts(new Set())
                      setBulkStockValue("")
                    }}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            </div>

          {/* Products Grid */}
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  border: bulkUpdateMode
                    ? selectedProducts.has(product.id)
                      ? "3px solid #007bff"
                      : "3px solid transparent"
                    : "1px solid #e9ecef",
                  cursor: bulkUpdateMode ? "pointer" : "default",
                }}
                onClick={() => {
                  if (bulkUpdateMode) {
                    const newSelected = new Set(selectedProducts)
                    if (newSelected.has(product.id)) {
                      newSelected.delete(product.id)
                    } else {
                      newSelected.add(product.id)
                    }
                    setSelectedProducts(newSelected)
                  }
                }}
              >
                {bulkUpdateMode && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "1rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => {}}
                      style={{
                        width: "20px",
                        height: "20px",
                        accentColor: "#007bff",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.1rem",
                        color: "#333",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      ID: {product.id}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        color: "#666",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Price
                    </label>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#28a745",
                      }}
                    >
                      ₹{product.price}
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        color: "#666",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Category
                    </label>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        padding: "0.25rem 0.5rem",
                        background: "#e9ecef",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    >
                      {product.category}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#666",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Stock
                  </label>
                  {editingProduct === product.id ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="number"
                        defaultValue={product.stock}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleStockUpdate(product.id, e.target.value)
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          border: "2px solid #007bff",
                          borderRadius: "4px",
                        }}
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector("input")
                          handleStockUpdate(product.id, input.value)
                        }}
                        style={{
                          padding: "0.5rem",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        style={{
                          padding: "0.5rem",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          color: product.stock === 0 ? "#dc3545" : product.stock <= 10 ? "#ffc107" : "#28a745",
                        }}
                      >
                        {product.stock} units
                        {product.stock === 0 && " (Out of Stock)"}
                        {product.stock > 0 && product.stock <= 10 && " (Low Stock)"}
                      </span>
                      {!bulkUpdateMode && (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => setEditingProduct(product.id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              background: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                            title="Delete Product"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#666",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Description
                  </label>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "#666",
                      lineHeight: "1.4",
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>No products found</h3>
              <p style={{ color: "#999", margin: 0 }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}


      {activeTab === "settings" && (
        <div>
          {/* Settings Header */}
          <div className="admin-card">
            <h2 style={{ margin: "0 0 1rem 0", color: "#333", fontSize: "1.5rem" }}>⚙️ Settings & Configuration</h2>
            <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>Manage your admin profile and system preferences</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            }}
          >

            {/* System Preferences */}
            <div className="admin-card">
              <h3 style={{ margin: "0 0 1.5rem 0", color: "#333" }}>🔧 System Preferences</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  />
                  <small style={{ color: "#666" }}>Alert when stock falls below this number</small>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Currency
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  >
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="admin-card"
            style={{
              maxWidth: "500px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Product ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.id}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, id: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                      }}
                    >
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                      }}
                    >
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          stock: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Category *
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  >
                    <option value="">Select Category</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Description *
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

      {/* ========== INVOICE VIEWER MODAL ========== */}
      {invoiceModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "2rem 1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setInvoiceModal(null) }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "900px",
              position: "relative",
              padding: 0,
              background: "none",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0, color: "white", fontWeight: 700 }}>
                <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: "0.5rem" }} />
                Invoice — {invoiceModal.id}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => { setResendModal(invoiceModal); setEditedInvoiceNote(""); setInvoiceModal(null) }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#6f42c1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} /> Resend Invoice
                </button>
                <button
                  onClick={() => setInvoiceModal(null)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} /> Close
                </button>
              </div>
            </div>
            <InvoiceDisplay orderData={invoiceModal} />
          </div>
        </div>
      )}

      {/* ========== RESEND INVOICE MODAL ========== */}
      {resendModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setResendModal(null) }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Loading / success overlay */}
            {(sendingInvoice || sendSuccess) && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: sendSuccess ? "rgba(16,185,129,0.93)" : "rgba(111,66,193,0.88)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "16px",
                  gap: "1rem",
                  animation: "fadeScaleIn 0.2s ease",
                }}
              >
                {sendSuccess ? (
                  <>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <p style={{ color: "white", fontWeight: 700, fontSize: "1.15rem", margin: 0 }}>Invoice Sent!</p>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", margin: 0 }}>Closing automatically...</p>
                  </>
                ) : (
                  <>
                    <span style={{
                      width: "48px",
                      height: "48px",
                      border: "4px solid rgba(255,255,255,0.3)",
                      borderTop: "4px solid white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.9s linear infinite",
                    }} />
                    <p style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Sending Invoice...</p>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", margin: 0 }}>Please wait</p>
                  </>
                )}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, color: "#1e293b" }}>
                <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "0.5rem", color: "#6f42c1" }} />
                Resend Invoice
              </h3>
              <button
                onClick={() => setResendModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#666" }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px", fontSize: "0.875rem" }}>
              <div><strong>Order:</strong> {resendModal.id}</div>
              <div><strong>Customer:</strong> {resendModal.customerName || "Guest Customer"}</div>
              <div><strong>Default Email:</strong> {resendModal.customerEmail || "N/A"}</div>
              <div><strong>Payment:</strong> {resendModal.paymentMethod || "Online Payment"}</div>
              <div><strong>Amount:</strong> ₹{resendModal.total?.toFixed(2)}</div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", fontSize: "0.875rem" }}>
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.4rem", color: "#6f42c1" }} />
                Send To (leave blank to use customer email)
              </label>
              <input
                type="email"
                id="resend-override-email"
                placeholder={resendModal.customerEmail || "customer@example.com"}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", fontSize: "0.875rem" }}>
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.4rem", color: "#6f42c1" }} />
                Additional Note (optional — appended to invoice)
              </label>
              <textarea
                value={editedInvoiceNote}
                onChange={(e) => setEditedInvoiceNote(e.target.value)}
                placeholder="e.g. Sorry for the delay — here is your resent invoice."
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setResendModal(null)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                disabled={sendingInvoice || sendSuccess}
                onClick={() => {
                  const overrideEmail = document.getElementById("resend-override-email")?.value?.trim() || null
                  handleResendInvoice(resendModal, overrideEmail || null, editedInvoiceNote)
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: sendSuccess ? "#10b981" : sendingInvoice ? "#6f42c1" : "#6f42c1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: sendingInvoice || sendSuccess ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minWidth: "140px",
                  justifyContent: "center",
                  transition: "background 0.3s",
                }}
              >
                {sendSuccess ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Sent!
                  </>
                ) : sendingInvoice ? (
                  <>
                    <span style={{
                      width: "16px",
                      height: "16px",
                      border: "2.5px solid rgba(255,255,255,0.4)",
                      borderTop: "2.5px solid white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                      flexShrink: 0,
                    }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Send Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
