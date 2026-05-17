"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import html2pdf from "html2pdf.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileInvoice, faArrowsRotate, faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import { InvoiceDisplay, generateEmailInvoiceHTML } from "../components/InvoiceTemplate"

const Invoice = () => {
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder")
    if (lastOrder) {
      try {
        const parsedOrder = JSON.parse(lastOrder)
        const enhancedOrder = {
          ...parsedOrder,
          customerEmail: parsedOrder.customerEmail || "scantappay@gmail.com",
        }
        setOrderData(enhancedOrder)
      } catch (error) {
        console.error("Error parsing order data:", error)
      }
    }
    setLoading(false)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice-content")
    if (!element) return

    // Clone element to modify it for PDF without affecting UI
    const clonedElement = element.cloneNode(true)
    clonedElement.style.margin = "0"
    clonedElement.style.padding = "0"
    clonedElement.style.boxShadow = "none"
    clonedElement.style.border = "none"
    clonedElement.style.width = "794px" // Exact A4 width at 96 DPI

    // Create a temporary container
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    container.appendChild(clonedElement)
    document.body.appendChild(container)

    const opt = {
      margin: 0,
      filename: `invoice-${orderData.id}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 800, // Fixed width for consistent rendering
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    }

    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save()
      .then(() => {
        document.body.removeChild(container)
      })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>
            <FontAwesomeIcon icon={faFileInvoice} /> Invoice
          </h1>
          <p>Loading your invoice...</p>
        </div>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <FontAwesomeIcon icon={faArrowsRotate} spin />
          </div>
          <p>Loading invoice details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="container">
        <div className="header">
          <h1>
            <FontAwesomeIcon icon={faFileInvoice} /> Invoice
          </h1>
          <p>No invoice data found</p>
        </div>

        <div className="nav-buttons">
          <Link to="/" className="nav-btn secondary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </Link>
        </div>

        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <FontAwesomeIcon icon={faFileInvoice} />
          </div>
          <h3>No Invoice Found</h3>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            No recent order data found. Please complete a purchase first.
          </p>
          <Link
            to="/scanner"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <FontAwesomeIcon icon={faFileInvoice} /> Invoice
        </h1>
        <p>Order #{orderData.id}</p>
      </div>

      <div className="nav-buttons">
        <Link to="/" className="nav-btn secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
        <button onClick={handleDownloadPDF} className="nav-btn accent">
          <FontAwesomeIcon icon={faFileInvoice} /> Download PDF
        </button>
      </div>

      <InvoiceDisplay orderData={orderData} />

      {/* Continue Shopping Section */}
      <div className="continue-shopping-section" style={{ textAlign: "center", paddingBottom: "2rem" }}>
        <Link to="/scanner" className="nav-btn primary">
          <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Invoice
