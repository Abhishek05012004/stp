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

// Export function to generate invoice HTML for email
export const generateInvoiceHTML = (orderData) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Invoice - ${orderData.id}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', 'Arial', sans-serif; background-color: #f3f4f6; }
        table { border-spacing: 0; border-collapse: collapse; }
        td { padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding: 20px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 700px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
        
        /* Updated styles for better visibility, spacing and removing borders */
        /* Header Section */
        .header-bg { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 35px; }
        .header-box { background: rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; }
        .sent-to-box { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; }
        
        /* Details Cards */
        .details-card { background: #f8fafc; border-radius: 12px; padding: 22px; }
        .payment-card { background: #ecfdf5; border-radius: 12px; padding: 22px; }
        
        /* Table Styling */
        .items-table-container { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .items-table th { background-color: #f1f5f9; padding: 15px; text-align: left; font-size: 11px; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px; }
        .items-table td { padding: 15px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
        
        /* Helper for white text in blue area */
        .text-white { color: #ffffff !important; }
        .link-white { color: #ffffff !important; text-decoration: none !important; }
        
        /* Responsive Stacking */
        @media screen and (max-width: 600px) {
          .col-stack { display: block !important; width: 100% !important; max-width: 100% !important; }
          .col-spacer { height: 20px !important; display: block !important; width: 0 !important; }
          .header-right { text-align: left !important; margin-top: 20px; }
          .main { border-radius: 0 !important; }
          .mobile-hide { display: none !important; }
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0">
          <!-- Blue Header - Matches Website -->
          <tr>
            <td class="header-bg">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Company Left Side -->
                  <td class="col-stack" style="vertical-align: top; width: 55%;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 30px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background: rgba(255, 255, 255, 0.2); border-radius: 10px; width: 52px; height: 52px; text-align: center;">
                                <img src="https://img.icons8.com/ios-filled/50/ffffff/bank-cards.png" width="28" height="28" style="vertical-align: middle;" alt="Logo">
                              </td>
                              <td style="padding-left: 18px;">
                                <div class="text-white" style="font-size: 26px; font-weight: 800; line-height: 1; letter-spacing: 0.5px; text-transform: uppercase;">SCAN TAP PAY</div>
                                <div class="text-white" style="font-size: 12px; opacity: 0.9; padding-top: 5px;">Smart Payment Solutions</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; line-height: 2.2;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="24"><img src="https://img.icons8.com/ios-filled/20/ffffff/new-post.png" width="14" height="14"></td>
                              <td class="text-white">scantappay@gmail.com</td>
                            </tr>
                            <tr>
                              <td width="24"><img src="https://img.icons8.com/ios-filled/20/ffffff/phone.png" width="14" height="14"></td>
                              <td class="text-white">7575841397 / 8511231514</td>
                            </tr>
                            <tr>
                              <td width="24"><img src="https://img.icons8.com/ios-filled/20/ffffff/marker.png" width="14" height="14"></td>
                              <td class="text-white">Office no. 16, Digital Plaza, Mumbai - 400001</td>
                            </tr>
                            <tr>
                              <td width="24"><img src="https://img.icons8.com/ios-filled/20/ffffff/internet.png" width="14" height="14"></td>
                              <td><a href="https://scantappay.vercel.app/" class="link-white">https://scantappay.vercel.app/</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <td class="col-spacer" width="25"></td>
                  
                  <!-- Invoice Info Right Side -->
                  <td class="col-stack header-right" style="vertical-align: top; width: 40%; text-align: right;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="text-align: right;">
                      <tr>
                        <td class="header-box" style="text-align: right;">
                          <div class="text-white" style="font-size: 22px; font-weight: 800; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase;">INVOICE</div>
                          <div class="text-white" style="font-size: 11px; line-height: 1.8;">
                            <strong class="text-white">Invoice #:</strong> <span>INV-${orderData.id}</span><br>
                            <strong class="text-white">Date:</strong> <span>${formatDate(orderData.date)}</span>
                          </div>
                        </td>
                      </tr>
                      <tr><td style="height: 20px;"></td></tr>
                      <tr>
                        <td class="sent-to-box" style="text-align: left;">
                          <div class="text-white" style="font-size: 10px; font-weight: 800; margin-bottom: 6px; opacity: 0.8; text-transform: uppercase;">
                            <img src="https://img.icons8.com/ios-filled/20/ffffff/new-post.png" width="12" height="12" style="vertical-align: middle; margin-right: 5px;"> SENT TO:
                          </div>
                          <div class="text-white" style="font-size: 12px; word-break: break-all; font-weight: 600;">${orderData.customerEmail}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px;">
              <!-- Details Cards Grid -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="col-stack" width="48%" style="vertical-align: top;">
                    <table width="100%" class="details-card" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 18px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background: #3b82f6; border-radius: 8px; width: 36px; height: 36px; text-align: center;">
                                <img src="https://img.icons8.com/ios-filled/30/ffffff/list.png" width="18" height="18" style="vertical-align: middle;">
                              </td>
                              <td style="padding-left: 12px; font-size: 15px; font-weight: 700; color: #1e293b;">Invoice Details</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" style="font-size: 11px; line-height: 2.4;">
                            <tr><td style="color: #64748b;">Invoice #:</td><td style="text-align: right; font-weight: 700; color: #1e293b; font-family: monospace;">INV-${orderData.id.substring(0, 15)}</td></tr>
                            <tr><td style="color: #64748b;">Order ID:</td><td style="text-align: right; font-weight: 700; color: #1e293b; font-family: monospace;">${orderData.id.substring(0, 15)}</td></tr>
                            <tr><td style="color: #64748b;">Date & Time:</td><td style="text-align: right; font-weight: 600; color: #1e293b;">${formatDate(orderData.date)}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <td class="col-spacer" width="4%"></td>
                  
                  <td class="col-stack" width="48%" style="vertical-align: top;">
                    <table width="100%" class="payment-card" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 18px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background: #10b981; border-radius: 8px; width: 36px; height: 36px; text-align: center;">
                                <img src="https://img.icons8.com/ios-filled/30/ffffff/bank-cards.png" width="18" height="18" style="vertical-align: middle;">
                              </td>
                              <td style="padding-left: 12px; font-size: 15px; font-weight: 700; color: #1e293b;">Payment Details</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" style="font-size: 11px; line-height: 2.4;">
                            <tr><td style="color: #64748b;">Method:</td><td style="text-align: right; font-weight: 700; color: #1e293b;">${orderData.paymentMethod}</td></tr>
                            <tr><td style="color: #64748b;">Transaction:</td><td style="text-align: right; font-weight: 700; color: #1e293b; font-family: monospace;">${orderData.transactionId.substring(0, 15)}</td></tr>
                            <tr><td style="color: #64748b;">Status:</td><td style="text-align: right;"><span style="color: #059669; font-weight: 800; background: #d1fae5; padding: 4px 12px; border-radius: 20px; font-size: 9px;">✓ COMPLETED</span></td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Order Items Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px;">
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: #3b82f6; border-radius: 10px; width: 44px; height: 44px; text-align: center;">
                          <img src="https://img.icons8.com/ios-filled/40/ffffff/shopping-cart.png" width="22" height="22" style="vertical-align: middle;">
                        </td>
                        <td style="padding-left: 15px; font-size: 17px; font-weight: 700; color: #1e293b;">Order Items</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <!-- Wrapped table in container for rounded corners and removed side gaps -->
                    <div class="items-table-container">
                      <table width="100%" class="items-table" cellpadding="0" cellspacing="0">
                        <thead>
                          <tr>
                            <th width="50%">Product Name</th>
                            <th width="15%" style="text-align: center;">Qty</th>
                            <th width="35%" style="text-align: right;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${orderData.items
                            .map(
                              (item) => `
                            <tr>
                              <td style="font-weight: 600;">${item.name}</td>
                              <td style="text-align: center;">
                                <span style="background: #e2e8f0; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 11px;">${item.quantity}</span>
                              </td>
                              <td style="text-align: right; font-weight: 700;">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          `,
                            )
                            .join("")}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Summary Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td class="mobile-hide" width="55%"></td>
                  <td class="col-stack" width="45%">
                    <table width="100%" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                      <tr>
                        <td style="font-size: 14px; color: #64748b; padding-bottom: 8px;">Subtotal:</td>
                        <td style="text-align: right; font-size: 14px; font-weight: 700; color: #1e293b; padding-bottom: 8px;">₹${orderData.total.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #64748b; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">Shipping:</td>
                        <td style="text-align: right; font-size: 14px; font-weight: 700; color: #10b981; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">FREE</td>
                      </tr>
                      <tr>
                        <td style="font-size: 18px; font-weight: 800; color: #1e293b; padding-top: 15px;">Total:</td>
                        <td style="text-align: right; font-size: 20px; font-weight: 800; color: #2563eb; padding-top: 15px;">₹${orderData.total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 15px; padding: 30px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 15px;">⭐</div>
                    <div style="font-size: 20px; font-weight: 800; color: #1e40af; margin-bottom: 8px;">Thank You for your purchase!</div>
                    <div style="font-size: 14px; color: #3b82f6; font-weight: 600;">Your order is confirmed and being prepared.</div>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 30px; color: #94a3b8; font-size: 11px;">
                    © 2025 Scan Tap Pay. All rights reserved.<br>
                    Secure payment gateway. For support, reply to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `
}

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
    const allElements = clonedElement.querySelectorAll("*")
    allElements.forEach((el) => {
      el.style.boxShadow = "none"
      el.style.position = "static"
      el.style.transform = "none"
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

      {/* Invoice Content - Renders based on the generateInvoiceHTML function for email, adapted for display here */}
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
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Using the generateInvoiceHTML content for display, but modified to fit larger screen */}
        {/* Header Section - Adapted for larger screen */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
            color: "white",
            padding: "30px",
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
              maxWidth: "1000px",
              margin: "0 auto",
              color: "#1f2937",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Company Info */}
            <div style={{ flex: "1", minWidth: "300px", color: "white" }}>
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
                  <h2
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "800",
                      margin: "0 0 5px 0",
                      color: "white",
                      letterSpacing: "0.5px",
                    }}
                  >
                    SCAN TAP PAY
                  </h2>
                  <p style={{ margin: "0", fontSize: "0.95rem", opacity: "0.9" }}>Smart Payment Solutions</p>
                </div>
              </div>

              {/* Company Contact Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  fontSize: "0.85rem",
                  opacity: "0.9",
                }}
              >
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
                    <a href="https://scantappay.vercel.app/" style={{ color: "white", textDecoration: "none" }}>
                      https://scantappay.vercel.app/
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Title and Sent To Email */}
            <div
              style={{
                textAlign: "right",
                minWidth: "250px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    color: "white",
                  }}
                >
                  INVOICE
                </h2>
                <div style={{ fontSize: "0.85rem", color: "white" }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: "white" }}>Invoice #:</strong>{" "}
                    <span style={{ color: "white" }}>INV-{orderData.id}</span>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: "white" }}>Date:</strong>{" "}
                    <span style={{ color: "white" }}>{formatDate(orderData.date)}</span>
                  </p>
                </div>
              </div>

              {/* Sent To Email in Header */}
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(255,255,255,0.15)",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", color: "white" }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ width: "14px", color: "white" }} />
                  <strong style={{ color: "white", opacity: 0.8 }}>Sent to:</strong>
                </div>
                <div
                  style={{
                    wordBreak: "break-word",
                    padding: "4px 0",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  {orderData.customerEmail}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
          {/* Details Grid */}
          <div
            className="invoice-details-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <h3 style={{ margin: "0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "600" }}>
                  Invoice Details
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Invoice #:</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      background: "#e2e8f0",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    INV-{orderData.id}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Order ID:</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      background: "#e2e8f0",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {orderData.id}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Date & Time:</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{formatDate(orderData.date)}</span>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    background: "#10b981",
                    color: "white",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <h3 style={{ margin: "0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "600" }}>
                  Payment Details
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Method:</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{orderData.paymentMethod}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Transaction:</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      background: "#d1fae5",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {orderData.transactionId}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Status:</span>
                  <span
                    style={{
                      color: "#059669",
                      fontWeight: "600",
                      background: "#d1fae5",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                    {orderData.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div style={{ marginBottom: "30px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "#3b82f6",
                  color: "white",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <h3 style={{ margin: "0", fontSize: "1.2rem", color: "#1e293b", fontWeight: "600" }}>Order Items</h3>
            </div>

            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        color: "#334155",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        color: "#334155",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      Qty
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        color: "#334155",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      Unit Price
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "right",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        color: "#334155",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? "#f8fafc" : "white",
                        borderBottom: index !== orderData.items.length - 1 ? "1px solid #f1f5f9" : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "15px",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                          color: "#1e293b",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            background: "#e2e8f0",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            minWidth: "40px",
                            display: "inline-block",
                          }}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "center",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}
                      >
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontWeight: "600",
                          fontSize: "0.95rem",
                          color: "#1e293b",
                        }}
                      >
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Amount */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "100%", maxWidth: "350px" }}>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "25px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "0.95rem",
                    color: "#475569",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>Subtotal:</span>
                  <span style={{ fontWeight: "600" }}>₹{orderData.total.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    fontSize: "0.95rem",
                    color: "#475569",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>Shipping:</span>
                  <span style={{ color: "#059669", fontWeight: "600" }}>FREE</span>
                </div>
                <div
                  style={{
                    borderTop: "2px solid #3b82f6",
                    paddingTop: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                    }}
                  >
                    <span>Total Amount:</span>
                    <span style={{ color: "#3b82f6" }}>₹{orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "30px",
              borderTop: "2px solid #e2e8f0",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "#fef3c7",
                padding: "25px",
                borderRadius: "10px",
                border: "1px solid #f59e0b",
                marginBottom: "25px",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🎉</div>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#92400e",
                }}
              >
                Thank You for Your Business!
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "0.95rem",
                  color: "#a16207",
                  lineHeight: "1.6",
                }}
              >
                Your order has been processed successfully. We appreciate your trust in Scan Tap Pay and look forward to
                serving you again!
              </p>
            </div>

            {/* Footer Info */}
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
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
                    <a href="https://scantappay.vercel.app/" style={{ color: "#64748b", textDecoration: "none" }}>
                      https://scantappay.vercel.app/
                    </a>
                  </p>
                </div>
              </div>

              <div
                style={{
                  paddingTop: "15px",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                }}
              >
                <p style={{ margin: "5px 0" }}>This is a computer-generated invoice. No signature required.</p>
                <p style={{ margin: "5px 0" }}>
                  Generated on {new Date().toLocaleString()} | Invoice ID: INV-{orderData.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Section (Will be removed from PDF) */}
        <div
          className="continue-shopping-section"
          style={{
            padding: "25px 30px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
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
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#2563eb"
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6"
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "none"
            }}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Invoice
