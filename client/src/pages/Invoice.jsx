"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import html2pdf from "html2pdf.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFileInvoice,
  faArrowsRotate,
  faArrowLeft,
  faCreditCard,
  faClipboardList,
  faCartShopping,
  faCircleCheck,
  faEnvelope,
  faGlobe,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"

const Invoice = () => {
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Invoice - Scan Tap Pay"
  }, [])

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder")
    if (lastOrder) {
      try {
        const parsedOrder = JSON.parse(lastOrder)
        // Ensure we have default values if needed
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
    const clonedElement = element.cloneNode(true)
    
    // Remove the Continue Shopping button from PDF
    const continueShoppingBtn = clonedElement.querySelector(".continue-shopping-section")
    if (continueShoppingBtn) {
      continueShoppingBtn.remove()
    }
    
    // Ensure all text is visible for PDF
    const allElements = clonedElement.querySelectorAll('*')
    allElements.forEach(el => {
      el.style.boxShadow = 'none'
      el.style.position = 'static'
      el.style.transform = 'none'
    })
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `invoice-${orderData.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: ["avoid-all", "css"] },
    }
    
    html2pdf().set(opt).from(clonedElement).save()
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

      <div
        id="invoice-content"
        style={{
          background: "white",
          padding: "0",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
          maxWidth: "1000px",
          margin: "0 auto 2rem auto",
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* Invoice Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
            color: "white",
            padding: "30px 30px 20px 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* Company Info */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px",
                    fontSize: "22px",
                  }}
                >
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: "1.8rem", 
                    fontWeight: "800", 
                    margin: "0 0 5px 0", 
                    color: "white",
                    letterSpacing: "0.5px"
                  }}>
                    SCAN TAP PAY
                  </h2>
                  <p style={{ margin: "0", fontSize: "0.95rem", opacity: "0.9" }}>
                    Smart Payment Solutions
                  </p>
                </div>
              </div>
              
              {/* Company Contact Info */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "12px",
                fontSize: "0.85rem",
                opacity: "0.9"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ width: "14px" }} />
                  <span>scantappay@gmail.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faPhone} style={{ width: "14px" }} />
                  <span>7575841397 / 8511231514</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ width: "14px" }} />
                  <span>Office no. 16, Digital Plaza, Mumbai - 400001</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faGlobe} style={{ width: "14px" }} />
                  <span>
                    <a 
                      href="https://scantappay.vercel.app/" 
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      https://scantappay.vercel.app/
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Title and Sent To Email */}
            <div style={{ 
              textAlign: "right", 
              minWidth: "250px",
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "15px",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                  }}
                >
                  INVOICE
                </h2>
                <div style={{ fontSize: "0.85rem", opacity: "0.95" }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Invoice #:</strong> INV-{orderData.id}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Date:</strong> {formatDate(orderData.date)}
                  </p>
                </div>
              </div>
              
              {/* Sent To Email in Header */}
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ width: "14px" }} />
                  <strong>Sent to:</strong>
                </div>
                <div style={{ 
                  wordBreak: "break-word",
                  background: "rgba(255,255,255,0.05)",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {orderData.customerEmail}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: "30px" }}>
          {/* Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Invoice Details Card */}
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                marginBottom: "15px" 
              }}>
                <div style={{
                  background: "#3b82f6",
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <h3 style={{ margin: "0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "600" }}>
                  Invoice Details
                </h3>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Invoice #:</span>
                  <span style={{ 
                    fontFamily: "monospace", 
                    background: "#e2e8f0", 
                    padding: "4px 10px", 
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    fontWeight: "600"
                  }}>
                    INV-{orderData.id}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Order ID:</span>
                  <span style={{ 
                    fontFamily: "monospace", 
                    background: "#e2e8f0", 
                    padding: "4px 10px", 
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    fontWeight: "600"
                  }}>
                    {orderData.id}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Date & Time:</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {formatDate(orderData.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div
              style={{
                background: "#ecfdf5",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #a7f3d0",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                marginBottom: "15px" 
              }}>
                <div style={{
                  background: "#10b981",
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <h3 style={{ margin: "0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "600" }}>
                  Payment Details
                </h3>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Method:</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {orderData.paymentMethod}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Transaction:</span>
                  <span style={{ 
                    fontFamily: "monospace", 
                    background: "#d1fae5", 
                    padding: "4px 10px", 
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    fontWeight: "600"
                  }}>
                    {orderData.transactionId}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Status:</span>
                  <span style={{ 
                    color: "#059669", 
                    fontWeight: "600", 
                    background: "#d1fae5", 
                    padding: "4px 12px", 
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    <FontAwesomeIcon icon={faCircleCheck} /> 
                    {orderData.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              marginBottom: "20px" 
            }}>
              <div style={{
                background: "#3b82f6",
                color: "white",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <h3 style={{ margin: "0", fontSize: "1.2rem", color: "#1e293b", fontWeight: "600" }}>
                Order Items
              </h3>
            </div>
            
            <div style={{ 
              borderRadius: "10px", 
              overflow: "hidden", 
              border: "1px solid #e2e8f0",
              overflowX: "auto"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ 
                      padding: "15px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      Product Name
                    </th>
                    <th style={{ 
                      padding: "15px", 
                      textAlign: "center", 
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      Qty
                    </th>
                    <th style={{ 
                      padding: "15px", 
                      textAlign: "center", 
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      Unit Price
                    </th>
                    <th style={{ 
                      padding: "15px", 
                      textAlign: "right", 
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index} style={{ 
                      background: index % 2 === 0 ? "#f8fafc" : "white",
                      borderBottom: index !== orderData.items.length - 1 ? "1px solid #f1f5f9" : "none"
                    }}>
                      <td style={{ 
                        padding: "15px", 
                        fontWeight: "500", 
                        fontSize: "0.95rem",
                        color: "#1e293b"
                      }}>
                        {item.name}
                      </td>
                      <td style={{ 
                        padding: "15px", 
                        textAlign: "center" 
                      }}>
                        <span style={{
                          background: "#e2e8f0",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          minWidth: "40px",
                          display: "inline-block"
                        }}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "15px", 
                        textAlign: "center", 
                        fontWeight: "500",
                        fontSize: "0.95rem"
                      }}>
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td style={{ 
                        padding: "15px", 
                        textAlign: "right", 
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        color: "#1e293b"
                      }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Amount */}
          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            marginBottom: "30px" 
          }}>
            <div style={{ width: "100%", maxWidth: "350px" }}>
              <div style={{ 
                background: "#f8fafc", 
                padding: "25px", 
                borderRadius: "10px",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "12px",
                  fontSize: "0.95rem",
                  color: "#475569"
                }}>
                  <span style={{ fontWeight: "500" }}>Subtotal:</span>
                  <span style={{ fontWeight: "600" }}>₹{orderData.total.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "20px",
                  fontSize: "0.95rem",
                  color: "#475569"
                }}>
                  <span style={{ fontWeight: "500" }}>Shipping:</span>
                  <span style={{ color: "#059669", fontWeight: "600" }}>FREE</span>
                </div>
                <div style={{ 
                  borderTop: "2px solid #3b82f6", 
                  paddingTop: "15px",
                  marginTop: "15px"
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#1e293b"
                  }}>
                    <span>Total Amount:</span>
                    <span style={{ color: "#3b82f6" }}>₹{orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div style={{ 
            textAlign: "center", 
            paddingTop: "30px", 
            borderTop: "2px solid #e2e8f0",
            marginBottom: "30px"
          }}>
            <div style={{ 
              background: "#fef3c7", 
              padding: "25px", 
              borderRadius: "10px",
              border: "1px solid #f59e0b",
              marginBottom: "25px"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🎉</div>
              <h3 style={{ 
                margin: "0 0 10px 0", 
                fontSize: "1.2rem", 
                fontWeight: "bold",
                color: "#92400e"
              }}>
                Thank You for Your Business!
              </h3>
              <p style={{ 
                margin: "0", 
                fontSize: "0.95rem", 
                color: "#a16207",
                lineHeight: "1.6"
              }}>
                Your order has been processed successfully. We appreciate your trust in 
                Scan Tap Pay and look forward to serving you again!
              </p>
            </div>

            {/* Footer Info */}
            <div style={{ 
              background: "#f8fafc", 
              padding: "20px", 
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "0.85rem",
              color: "#64748b"
            }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "15px",
                marginBottom: "15px"
              }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>
                    <FontAwesomeIcon icon={faEnvelope} /> For support:
                  </p>
                  <p style={{ margin: "0" }}>scantappay@gmail.com</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>
                    <FontAwesomeIcon icon={faPhone} /> Contact:
                  </p>
                  <p style={{ margin: "0" }}>7575841397 / 8511231514</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>
                    <FontAwesomeIcon icon={faGlobe} /> Website:
                  </p>
                  <p style={{ margin: "0" }}>
                    <a 
                      href="https://scantappay.vercel.app/" 
                      style={{ color: "#64748b", textDecoration: "none" }}
                    >
                      https://scantappay.vercel.app/
                    </a>
                  </p>
                </div>
              </div>
              
              <div style={{ 
                paddingTop: "15px", 
                borderTop: "1px solid #e2e8f0",
                fontSize: "0.75rem",
                color: "#94a3b8"
              }}>
                <p style={{ margin: "5px 0" }}>
                  This is a computer-generated invoice. No signature required.
                </p>
                <p style={{ margin: "5px 0" }}>
                  Generated on {new Date().toLocaleString()} | Invoice ID: INV-{orderData.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Section (Will be removed from PDF) */}
        <div className="continue-shopping-section" style={{
          padding: "25px 30px",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          textAlign: "center"
        }}>
          <Link
            to="/scanner"
            style={{
              padding: "12px 30px",
              background: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#2563eb";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            Continue Shopping
          </Link>
        </div>
      </div>
      
      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .nav-btn {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
          
          #invoice-content {
            margin: 0 -15px;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
          
          .continue-shopping-section {
            padding: 20px 15px;
          }
        }
        
        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.5rem;
          }
          
          #invoice-content > div:first-child {
            padding: 20px 15px;
          }
          
          #invoice-content > div:last-child {
            padding: 20px 15px;
          }
          
          table {
            font-size: 0.85rem;
          }
          
          th, td {
            padding: 10px !important;
          }
        }
        
        @media print {
          .nav-buttons,
          .continue-shopping-section {
            display: none !important;
          }
          
          #invoice-content {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Invoice