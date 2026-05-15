"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClipboardList,
  faCreditCard,
  faCartShopping,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faFileInvoice,
  faUser,
  faCalendarAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons"

// Constants for consistent formatting
export const INVOICE_COMPANY_INFO = {
  name: "SCAN TAP PAY",
  tagline: "Smart Payment Solutions",
  email: "scantappay@gmail.com",
  phones: ["7575841397", "8511231514"],
  address: "Office no. 16, Digital Plaza, Mumbai - 400001",
  website: "https://scantappay.vercel.app/",
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatCurrency = (amount) => {
  return `₹${Number.parseFloat(amount).toFixed(2)}`
}

/**
 * Generates an HTML string optimized for email clients (Gmail, Outlook, etc.)
 */
export const generateEmailInvoiceHTML = (orderData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Invoice - ${orderData.id}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f9; color: #2d3748; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f9; padding: 20px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 650px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%); padding: 35px; color: #ffffff; }
        .content { padding: 30px; }
        .card { background-color: #f1f5f9; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
        .payment-card { background-color: #e8f5f0; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden; }
        .items-table th { background-color: #f8fafc; padding: 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; letter-spacing: 0.5px; }
        .items-table td { padding: 12px; font-size: 13px; border-bottom: 1px solid #edf2f7; color: #1e293b; }
        .total-box { background-color: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .footer { padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; background-color: #ffffff; }
        .status-badge { background-color: #d1fae5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; border: 1px solid #a7f3d0; }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="header">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="60%" style="vertical-align: top;">
                    <div style="font-size: 26px; font-weight: 900; margin-bottom: 5px; color: #ffffff; letter-spacing: 1px;">SCAN TAP PAY</div>
                    <div style="font-size: 12px; color: #ffffff; opacity: 0.8; margin-bottom: 15px;">Smart Payment Solutions</div>
                    <div style="font-size: 11px; color: #ffffff; line-height: 1.8;">
                      <span style="opacity: 0.7;">📍</span> Office no. 16, Digital Plaza, Mumbai - 400001<br>
                      <span style="opacity: 0.7;">📞</span> 7575841397 / 8511231514<br>
                      <span style="opacity: 0.7;">✉️</span> <a href="mailto:scantappay@gmail.com" style="color: #ffffff !important; text-decoration: none !important;">scantappay@gmail.com</a><br>
                      <span style="opacity: 0.7;">🌐</span> <a href="https://scantappay.vercel.app/" style="color: #ffffff !important; text-decoration: none !important;">https://scantappay.vercel.app/</a>
                    </div>
                  </td>
                  <td width="40%" style="text-align: right; vertical-align: top;">
                    <div style="font-size: 20px; font-weight: 900; margin-bottom: 12px; color: #ffffff; letter-spacing: 2px;">INVOICE</div>
                    <div style="font-size: 11px; color: #ffffff; line-height: 1.6;">
                      <strong style="opacity: 0.7;">Invoice #:</strong> INV-${orderData.id.substring(0, 15)}<br>
                      <strong style="opacity: 0.7;">Date:</strong> ${new Date(orderData.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style="margin-top: 25px; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">
                      <div style="font-size: 9px; text-transform: uppercase; margin-bottom: 5px; color: #ffffff; opacity: 0.7; font-weight: 800;">👤 SENT TO:</div>
                      <div style="font-size: 11px; font-weight: bold; word-break: break-all;">
                        <a href="mailto:${orderData.customerEmail}" style="color: #ffffff !important; text-decoration: none !important;">${orderData.customerEmail}</a>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="content">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="48%" style="vertical-align: top;">
                    <div class="card">
                      <div style="font-size: 14px; font-weight: 800; margin-bottom: 12px; color: #1e293b;">📋 Invoice Info</div>
                      <table width="100%" style="font-size: 11px; line-height: 2;">
                        <tr><td style="color: #64748b;">Invoice ID:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">INV-${orderData.id.substring(0, 15)}</td></tr>
                        <tr><td style="color: #64748b;">Order ID:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">${orderData.id.substring(0, 15)}</td></tr>
                        <tr><td style="color: #64748b;">Date:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">${new Date(orderData.date).toLocaleDateString()}</td></tr>
                      </table>
                    </div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top;">
                    <div class="payment-card">
                      <div style="font-size: 14px; font-weight: 800; margin-bottom: 12px; color: #1e293b;">💳 Payment Info</div>
                      <table width="100%" style="font-size: 11px; line-height: 2;">
                        <tr><td style="color: #64748b;">Method:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">${orderData.paymentMethod}</td></tr>
                        <tr><td style="color: #64748b;">Transaction:</td><td style="text-align: right; font-weight: bold; color: #1e293b;">${orderData.transactionId ? orderData.transactionId.substring(0, 15) : 'N/A'}</td></tr>
                        <tr><td style="color: #64748b;">Status:</td><td style="text-align: right;"><span class="status-badge">✓ SUCCESS</span></td></tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="font-size: 16px; font-weight: 800; margin-top: 15px; margin-bottom: 10px; color: #1e293b; border-bottom: 2px solid #3b82f6; display: inline-block; padding-bottom: 2px;">🛒 Order Items</div>
              <table class="items-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #edf2f7; border-bottom: 2px solid #edf2f7;">
                <thead>
                  <tr style="background-color: #f8fafc;">
                    <th style="text-align: left; padding: 12px; font-size: 11px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Product</th>
                    <th style="text-align: center; padding: 12px; font-size: 11px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Qty</th>
                    <th style="text-align: right; padding: 12px; font-size: 11px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.items
                    .map(
                      (item, index) => `
                    <tr>
                      <td style="padding: 12px; font-size: 13px; border-bottom: 1px solid #edf2f7; font-weight: 600;">${item.name}</td>
                      <td style="padding: 12px; font-size: 13px; border-bottom: 1px solid #edf2f7; text-align: center;">${item.quantity}</td>
                      <td style="padding: 12px; font-size: 13px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="40%"></td>
                  <td width="60%">
                    <div class="total-box">
                      <table width="100%" style="font-size: 13px;">
                        <tr>
                          <td style="color: #64748b; padding-bottom: 8px;">Subtotal:</td>
                          <td style="text-align: right; font-weight: bold; color: #1e293b; padding-bottom: 8px;">₹${orderData.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">Shipping:</td>
                          <td style="text-align: right; font-weight: bold; color: #10b981; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">FREE</td>
                        </tr>
                        <tr>
                          <td style="font-size: 16px; font-weight: 900; padding-top: 15px; color: #1e3a5f;">Total:</td>
                          <td style="text-align: right; font-size: 18px; font-weight: 900; padding-top: 15px; color: #2563eb;">₹${orderData.total.toFixed(2)}</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 40px; padding: 30px; background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">⭐</div>
                <div style="font-size: 20px; font-weight: 900; color: #1e3a5f; margin-bottom: 5px;">Thank you for your purchase!</div>
                <div style="font-size: 13px; color: #3b82f6; font-weight: 600;">Your order has been confirmed and is being processed.</div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <div style="margin-bottom: 15px;">
                <a href="https://scantappay.vercel.app/" style="color: #3b82f6; text-decoration: none; font-weight: bold;">Visit Website</a> | 
                <a href="mailto:scantappay@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: bold;">Support</a>
              </div>
              <p style="margin: 0; opacity: 0.8;">© ${new Date().getFullYear()} SCAN TAP PAY. All rights reserved.</p>
              <p style="margin: 5px 0 0 0; font-size: 11px;">This is an automated receipt for your purchase. Please do not reply directly to this email.</p>
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `
}

export const InvoiceDisplay = ({ orderData }) => {
  return (
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
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)",
          color: "white",
          padding: "clamp(15px, 5%, 30px)",
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
            gap: "clamp(10px, 3%, 20px)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Company Info Left */}
          <div style={{ flex: "1 1 45%", minWidth: "min(100%, 280px)" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "clamp(15px, 4%, 25px)" }}>
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  marginRight: "clamp(12px, 3%, 18px)",
                  fontSize: "24px",
                  boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
                  flexShrink: 0,
                  lineHeight: 0,
                }}
              >
                <FontAwesomeIcon icon={faFileInvoice} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "clamp(1.2rem, 6vw, 2rem)",
                    fontWeight: "900",
                    margin: "0",
                    color: "white",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    lineHeight: "1.2",
                  }}
                >
                  {INVOICE_COMPANY_INFO.name}
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "clamp(0.7rem, 3vw, 0.9rem)", opacity: "0.8" }}>
                  {INVOICE_COMPANY_INFO.tagline}
                </p>
              </div>
            </div>

            {/* Company Contact Info with better alignment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: "20px", textAlign: "center", opacity: "0.7" }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>{INVOICE_COMPANY_INFO.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: "20px", textAlign: "center", opacity: "0.7" }}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span>{INVOICE_COMPANY_INFO.phones.join(" / ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "clamp(0.7rem, 3vw, 0.85rem)" }}>
                <div style={{ width: "20px", textAlign: "center", opacity: "0.7", marginTop: "3px" }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <span style={{ maxWidth: "100%", overflowWrap: "break-word" }}>{INVOICE_COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Invoice Info Right */}
          <div style={{ flex: "1 1 45%", minWidth: "min(100%, 280px)", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "15px",
                width: "100%",
                maxWidth: "320px",
                marginLeft: "auto", // Keeps it right-aligned on large screens
                marginRight: "auto", // Center-aligned on mobile when wrapped
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "900",
                  margin: "0 0 10px 0",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textAlign: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "10px",
                }}
              >
                INVOICE
              </div>
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ opacity: "0.8" }}>Invoice #:</span>
                  <span style={{ fontWeight: "700", wordBreak: "break-all", textAlign: "right" }}>INV-{orderData.id.substring(0, 12)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ opacity: "0.8" }}>Date:</span>
                  <span style={{ fontWeight: "700", textAlign: "right" }}>{formatDate(orderData.date)}</span>
                </div>
              </div>
            </div>

            <div
              style={{ 
                background: "rgba(255,255,255,0.08)", 
                borderRadius: "12px", 
                padding: "15px",
                width: "100%",
                maxWidth: "320px",
                marginLeft: "auto",
                marginRight: "auto",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "800",
                  marginBottom: "6px",
                  opacity: "0.7",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FontAwesomeIcon icon={faUser} /> Bill To:
              </div>
              <div style={{ fontSize: "clamp(0.85rem, 3.5vw, 0.95rem)", fontWeight: "700", wordBreak: "break-all" }}>
                {orderData.customerEmail}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: "clamp(15px, 4%, 35px)" }}>
        {/* Details Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(12px, 3%, 20px)",
            marginBottom: "clamp(20px, 4%, 40px)",
          }}
        >
          {/* Invoice Details Card */}
          <div style={{ background: "#f0f4f8", borderRadius: "12px", padding: "clamp(15px, 3%, 22px)" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "clamp(12px, 2%, 18px)" }}>
              <div
                style={{
                  background: "#3b82f6",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "grid",
                  placeItems: "center",
                  marginRight: "clamp(8px, 2%, 12px)",
                  color: "white",
                  fontSize: "18px",
                  flexShrink: 0,
                  lineHeight: 0,
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <h4 style={{ margin: "0", fontSize: "clamp(0.8rem, 2%, 0.9rem)", fontWeight: "700", color: "#1e293b" }}>
                Invoice Details
              </h4>
            </div>

            <table style={{ width: "100%", fontSize: "clamp(0.7rem, 1.5%, 0.85rem)", lineHeight: "2" }}>
              <tbody>
                <tr>
                  <td style={{ color: "#64748b" }}>Invoice #:</td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "#1e293b", fontFamily: "monospace" }}>
                    INV-{orderData.id.substring(0, 15)}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b" }}>Order ID:</td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "#1e293b", fontFamily: "monospace" }}>
                    {orderData.id.substring(0, 15)}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b" }}>Date & Time:</td>
                  <td style={{ textAlign: "right", fontWeight: "600", color: "#1e293b" }}>
                    {formatDate(orderData.date)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Details Card */}
          <div style={{ background: "#e8f5f0", borderRadius: "12px", padding: "clamp(15px, 3%, 22px)" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "clamp(12px, 2%, 18px)" }}>
              <div
                style={{
                  background: "#10b981",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "grid",
                  placeItems: "center",
                  marginRight: "clamp(8px, 2%, 12px)",
                  color: "white",
                  fontSize: "18px",
                  flexShrink: 0,
                  lineHeight: 0,
                }}
              >
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <h4 style={{ margin: "0", fontSize: "clamp(0.8rem, 2%, 0.9rem)", fontWeight: "700", color: "#1e293b" }}>
                Payment Details
              </h4>
            </div>

            <table style={{ width: "100%", fontSize: "clamp(0.7rem, 1.5%, 0.85rem)", lineHeight: "2" }}>
              <tbody>
                <tr>
                  <td style={{ color: "#64748b" }}>Method:</td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "#1e293b" }}>{orderData.paymentMethod}</td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b" }}>Transaction:</td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "#1e293b", fontFamily: "monospace" }}>
                    {orderData.transactionId.substring(0, 15)}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b" }}>Status:</td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        color: "#059669",
                        fontWeight: "900",
                        background: "#d1fae5",
                        padding: "4px 14px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} size="xs" /> PAID
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Items Section */}
        <div style={{ marginBottom: "clamp(20px, 4%, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "clamp(15px, 3%, 22px)" }}>
            <div
              style={{
                background: "#3b82f6",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "grid",
                placeItems: "center",
                marginRight: "clamp(10px, 2%, 15px)",
                color: "white",
                fontSize: "20px",
                flexShrink: 0,
                lineHeight: 0,
                paddingLeft: "2px", // Visual adjustment for cart icon
              }}
            >
              <FontAwesomeIcon icon={faCartShopping} size="lg" />
            </div>
            <h3 style={{ margin: "0", fontSize: "clamp(0.95rem, 3%, 1.1rem)", fontWeight: "700", color: "#1e293b" }}>
              Order Items
            </h3>
          </div>

          <div style={{ borderRadius: "12px", overflowX: "auto", border: "1px solid #e2e8f0", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th
                    style={{
                      padding: "clamp(10px, 2%, 15px)",
                      textAlign: "left",
                      fontSize: "clamp(0.6rem, 1.2%, 0.7rem)",
                      color: "#475569",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Product Name
                  </th>
                  <th
                    style={{
                      padding: "clamp(10px, 2%, 15px)",
                      textAlign: "center",
                      fontSize: "clamp(0.6rem, 1.2%, 0.7rem)",
                      color: "#475569",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "1px solid #e2e8f0",
                      width: "15%",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: "clamp(10px, 2%, 15px)",
                      textAlign: "right",
                      fontSize: "clamp(0.6rem, 1.2%, 0.7rem)",
                      color: "#475569",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "1px solid #e2e8f0",
                      width: "auto",
                      minWidth: "100px",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "clamp(10px, 2%, 15px)",
                        fontSize: "clamp(0.75rem, 1.5%, 0.85rem)",
                        borderBottom: "1px solid #f1f5f9",
                        color: "#1e293b",
                        fontWeight: "600",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: "clamp(10px, 2%, 15px)",
                        fontSize: "clamp(0.75rem, 1.5%, 0.85rem)",
                        borderBottom: "1px solid #f1f5f9",
                        color: "#1e293b",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          background: "#e2e8f0",
                          padding: "clamp(3px, 0.5%, 5px) clamp(8px, 1%, 12px)",
                          borderRadius: "20px",
                          fontWeight: "700",
                          fontSize: "clamp(0.6rem, 1%, 0.7rem)",
                        }}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "clamp(10px, 2%, 15px)",
                        fontSize: "clamp(0.75rem, 1.5%, 0.85rem)",
                        borderBottom: "1px solid #f1f5f9",
                        color: "#1e293b",
                        textAlign: "right",
                        fontWeight: "700",
                      }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "clamp(12px, 2%, 20px)" }}>
          <div
            style={{
              background: "#f0f4f8",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "400px",
              padding: "clamp(15px, 3%, 20px)",
            }}
          >
            <table style={{ width: "100%", fontSize: "clamp(0.8rem, 1.5%, 0.85rem)" }}>
              <tbody>
                <tr>
                  <td style={{ color: "#64748b", paddingBottom: "6px" }}>Subtotal:</td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "#1e293b", paddingBottom: "6px" }}>
                    {formatCurrency(orderData.total)}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
                    Shipping:
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "700",
                      color: "#10b981",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    FREE
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: "clamp(0.95rem, 2%, 1rem)",
                      fontWeight: "800",
                      color: "#1e293b",
                      paddingTop: "10px",
                    }}
                  >
                    Total:
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontSize: "clamp(1rem, 2.5%, 1.15rem)",
                      fontWeight: "800",
                      color: "#2563eb",
                      paddingTop: "10px",
                    }}
                  >
                    {formatCurrency(orderData.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div style={{ padding: "0 clamp(15px, 3%, 30px) clamp(15px, 3%, 40px) clamp(15px, 3%, 30px)" }}>
        <div
          style={{
            background: "#eff6ff",
            border: "2px dashed #3b82f6",
            borderRadius: "12px",
            padding: "clamp(15px, 3%, 30px)",
            textAlign: "center",
            marginBottom: "clamp(15px, 3%, 30px)",
          }}
        >
          <div style={{ fontSize: "clamp(1.5rem, 4%, 2rem)", marginBottom: "clamp(10px, 2%, 15px)" }}>⭐</div>
          <h3
            style={{ fontSize: "clamp(1rem, 2.5%, 1.3rem)", fontWeight: "800", color: "#1e40af", margin: "0 0 6px 0" }}
          >
            Thank You for your purchase!
          </h3>
          <p style={{ fontSize: "clamp(0.8rem, 1.5%, 0.9rem)", color: "#3b82f6", fontWeight: "600", margin: "0" }}>
            Your order is confirmed and being prepared.
          </p>
        </div>

        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "clamp(0.65rem, 1%, 0.7rem)" }}>
          <p style={{ margin: "0" }}>
            © {new Date().getFullYear()} {INVOICE_COMPANY_INFO.name}. All rights reserved.
            <br />
            Secure payment gateway. For support, reply to this email.
          </p>
        </div>
      </div>
    </div>
  )
}
