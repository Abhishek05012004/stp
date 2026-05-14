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

export const generateInvoiceHTML = (orderData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Invoice - ${orderData.id}</title>
      <style>
        * { margin: 0; padding: 0; }
        body { 
          margin: 0; 
          padding: 10px; 
          font-family: 'Segoe UI', 'Arial', sans-serif; 
          background-color: #f3f4f6; 
          box-sizing: border-box;
        }
        table { border-spacing: 0; border-collapse: collapse; }
        td { padding: 0; }
        .wrapper { 
          width: 100%; 
          table-layout: fixed; 
          background-color: transparent; 
          padding: 0; 
          margin: 0;
        }
        .main { 
          background-color: #ffffff; 
          margin: 0 auto; 
          width: 100%; 
          max-width: 700px; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
          border: 1px solid #e2e8f0; 
          page-break-inside: avoid;
        }
        
        /* Updated header to darker blue matching email version */
        .header-bg { 
          background: linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%); 
          padding: 20px 25px;
          border-bottom: 3px solid #334155;
          page-break-inside: avoid;
        }
        .header-box { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 15px; border: none; }
        .sent-to-box { background: rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; border: none; }
        
        /* Reduced padding for cards to prevent page breaks */
        .details-card { background: #f0f4f8; border-radius: 12px; padding: 18px; border: none; page-break-inside: avoid; }
        .payment-card { background: #e8f5f0; border-radius: 12px; padding: 18px; border: none; page-break-inside: avoid; }
        .summary-card { background: #f0f4f8; border-radius: 12px; border: none; page-break-inside: avoid; }
        
        /* Table styling */
        .items-table-container { border-radius: 12px; overflow: hidden; border: 2px solid #cbd5e0; page-break-inside: avoid; }
        .items-table th { 
          background-color: #f1f5f9; 
          padding: 12px; 
          text-align: left; 
          font-size: 10px; 
          color: #475569; 
          border-bottom: 1px solid #e2e8f0; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }
        .items-table td { 
          padding: 12px; 
          font-size: 12px; 
          border-bottom: 1px solid #f1f5f9; 
          color: #1e293b; 
        }
        
        /* Text colors */
        .text-dark { color: #ffffff !important; }
        .text-light { color: #e2e8f0 !important; }
        .link-light { color: #e2e8f0 !important; text-decoration: none !important; }
        
        /* Mobile responsiveness with smaller font sizes and boxes */
        @media screen and (max-width: 600px) {
          body { padding: 5px; }
          .header-bg { padding: 15px 15px; }
          .col-stack { display: block !important; width: 100% !important; max-width: 100% !important; }
          .col-spacer { height: 12px !important; display: block !important; width: 0 !important; }
          .header-right { text-align: left !important; margin-top: 12px; }
          .main { border-radius: 8px !important; }
          .mobile-hide { display: none !important; }
          .wrapper { padding: 0 !important; }
          
          /* Smaller font sizes for mobile */
          .header-bg div:nth-child(1) { font-size: 18px !important; }
          .tagline-text { font-size: 11px !important; }
          .contact-text { font-size: 10px !important; }
          .invoice-title { font-size: 14px !important; }
          .invoice-detail { font-size: 9px !important; }
          .order-title { font-size: 12px !important; }
          .items-table th { font-size: 8px !important; padding: 8px !important; }
          .items-table td { font-size: 10px !important; padding: 8px !important; }
          .summary-font { font-size: 12px !important; }
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0">
          <!-- Restructured header with better spacing -->
          <tr>
            <td class="header-bg">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Company Left Side -->
                  <td class="col-stack" style="vertical-align: top; width: 60%;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; width: 40px; height: 40px; text-align: center; font-size: 20px; vertical-align: middle; line-height: 40px;">
                                💳
                              </td>
                              <td style="padding-left: 12px;">
                                <div style="font-size: 18px; font-weight: 800; margin: 0; color: #ffffff; letter-spacing: 0.5px;">SCAN TAP PAY</div>
                                <div class="tagline-text" style="font-size: 11px; color: #cbd5e1; margin: 2px 0 0 0;">Smart Payment Solutions</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="contact-text" style="font-size: 10px; color: #cbd5e1; line-height: 1.6;">
                          <div style="margin-bottom: 3px;"><strong>📞</strong> 7575841397 / 8511231514</div>
                          <div style="margin-bottom: 3px;"><strong>📍</strong> Office no. 16, Digital Plaza, Mumbai - 400001</div>
                          <div><strong>🌐</strong> https://scantappay.vercel.app/</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="col-spacer" width="3%"></td>
                  <!-- Invoice Info Right -->
                  <td class="col-stack header-right" style="vertical-align: top; width: 37%; text-align: right;">
                    <div class="header-box" style="margin-bottom: 12px;">
                      <div class="invoice-title" style="font-size: 14px; margin-bottom: 2px; color: #ffffff; font-weight: 800;">📄 INVOICE</div>
                      <div class="invoice-detail" style="font-size: 9px; color: #cbd5e1; line-height: 1.6;">
                        <div><strong>Invoice #:</strong> INV-${orderData.id}</div>
                        <div><strong>Date:</strong> ${formatDate(orderData.date)}</div>
                      </div>
                    </div>
                    <div class="sent-to-box">
                      <div style="font-size: 8px; font-weight: 800; color: #e2e8f0; margin-bottom: 4px; text-transform: uppercase;">📧 Sent To:</div>
                      <div class="invoice-detail" style="font-size: 9px; color: #ffffff; font-weight: 600; word-break: break-all;">${orderData.customerEmail}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 20px;">
              <!-- Reduced padding and margins to prevent page breaks -->
              <!-- Invoice & Payment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; page-break-inside: avoid;">
                <tr>
                  <td width="48%" style="vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0f4f8; border-radius: 12px;">
                      <tr>
                        <td style="padding: 18px;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                            <tr>
                              <td style="background: #3b82f6; border-radius: 8px; width: 32px; height: 32px; text-align: center; font-size: 16px; display: inline-block; vertical-align: middle; line-height: 32px;">
                                📋
                              </td>
                              <td style="padding-left: 10px; font-size: 13px; font-weight: 700; color: #1e293b;">Invoice Details</td>
                            </tr>
                          </table>
                          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 10px; line-height: 1.8;">
                            <tr><td style="color: #64748b;">Invoice #:</td><td style="text-align: right; font-weight: 700; color: #1e293b;">INV-${orderData.id}</td></tr>
                            <tr><td style="color: #64748b;">Order ID:</td><td style="text-align: right; font-weight: 700; color: #1e293b;">${orderData.id}</td></tr>
                            <tr><td style="color: #64748b;">Date & Time:</td><td style="text-align: right; font-weight: 700; color: #1e293b;">${formatDate(orderData.date)}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #e8f5f0; border-radius: 12px;">
                      <tr>
                        <td style="padding: 18px;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                            <tr>
                              <td style="background: #10b981; border-radius: 8px; width: 32px; height: 32px; text-align: center; font-size: 16px; display: inline-block; vertical-align: middle; line-height: 32px;">
                                💳
                              </td>
                              <td style="padding-left: 10px; font-size: 13px; font-weight: 700; color: #1e293b;">Payment Details</td>
                            </tr>
                          </table>
                          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 10px; line-height: 1.8;">
                            <tr><td style="color: #64748b;">Method:</td><td style="text-align: right; font-weight: 700; color: #1e293b;">${orderData.paymentMethod}</td></tr>
                            <tr><td style="color: #64748b;">Transaction:</td><td style="text-align: right; font-weight: 700; color: #1e293b; font-family: monospace;">${orderData.transactionId.substring(0, 15)}</td></tr>
                            <tr><td style="color: #64748b;">Status:</td><td style="text-align: right;"><span style="color: #059669; font-weight: 800; background: #d1fae5; padding: 3px 10px; border-radius: 20px; font-size: 8px;">✅ COMPLETED</span></td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Order Items Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 18px; page-break-inside: avoid;">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: #3b82f6; border-radius: 8px; width: 36px; height: 36px; text-align: center; font-size: 18px; line-height: 36px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;">
                          🛒
                        </td>
                        <td style="padding-left: 12px; font-size: 14px; font-weight: 700; color: #1e293b;">Order Items</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 12px; overflow: hidden; border: 2px solid #cbd5e0;">
                      <thead>
                        <tr>
                          <th width="50%" style="background-color: #f1f5f9; padding: 10px; text-align: left; font-size: 9px; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px;">Product Name</th>
                          <th width="15%" style="background-color: #f1f5f9; padding: 10px; text-align: center; font-size: 9px; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                          <th width="35%" style="background-color: #f1f5f9; padding: 10px; text-align: right; font-size: 9px; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${orderData.items
                          .map(
                            (item) => `
                          <tr>
                            <td style="padding: 10px; font-size: 11px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${item.name}</td>
                            <td style="padding: 10px; font-size: 11px; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: center;">
                              <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 9px;">${item.quantity}</span>
                            </td>
                            <td style="padding: 10px; font-size: 11px; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right; font-weight: 700;">${formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        `,
                          )
                          .join("")}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Summary Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 18px; page-break-inside: avoid;">
                <tr>
                  <td width="55%"></td>
                  <td width="45%">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0f4f8; border-radius: 12px;">
                      <tr>
                        <td style="padding: 18px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size: 11px; color: #64748b; padding-bottom: 8px;">Subtotal:</td>
                              <td style="text-align: right; font-size: 11px; font-weight: 700; color: #1e293b; padding-bottom: 8px;">${formatCurrency(orderData.total)}</td>
                            </tr>
                            <tr>
                              <td style="font-size: 11px; color: #64748b; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Shipping:</td>
                              <td style="text-align: right; font-size: 11px; font-weight: 700; color: #10b981; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">FREE</td>
                            </tr>
                            <tr>
                              <td style="font-size: 13px; font-weight: 800; color: #1e293b; padding-top: 10px;">Total:</td>
                              <td style="text-align: right; font-size: 14px; font-weight: 800; color: #2563eb; padding-top: 10px;">${formatCurrency(orderData.total)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="padding: 0 20px 20px 20px; page-break-inside: avoid;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⭐</div>
                    <div style="font-size: 14px; font-weight: 800; color: #1e40af; margin-bottom: 5px;">Thank You for your purchase!</div>
                    <div style="font-size: 11px; color: #3b82f6; font-weight: 600;">Your order is confirmed and being prepared.</div>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 15px; color: #94a3b8; font-size: 9px;">
                    © 2025 SCAN TAP PAY. All rights reserved.<br>
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
          <div style={{ flex: "1 1 45%", minWidth: "250px", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "clamp(12px, 3%, 20px)" }}>
              <div
                style={{
                  width: "clamp(40px, 8%, 50px)",
                  height: "clamp(40px, 8%, 50px)",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "clamp(10px, 2%, 15px)",
                  fontSize: "clamp(18px, 4%, 22px)",
                }}
              >
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "clamp(1.4rem, 4%, 1.8rem)",
                    fontWeight: "800",
                    margin: "0 0 5px 0",
                    color: "white",
                    letterSpacing: "0.5px",
                  }}
                >
                  {INVOICE_COMPANY_INFO.name}
                </h2>
                <p style={{ margin: "0", fontSize: "clamp(0.75rem, 2%, 0.95rem)", opacity: "0.9" }}>
                  {INVOICE_COMPANY_INFO.tagline}
                </p>
              </div>
            </div>

            {/* Company Contact Info */}
            <div style={{ fontSize: "clamp(0.75rem, 2%, 0.85rem)", opacity: "0.9", lineHeight: "1.6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>{INVOICE_COMPANY_INFO.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <FontAwesomeIcon icon={faPhone} />
                <span>{INVOICE_COMPANY_INFO.phones.join(" / ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{INVOICE_COMPANY_INFO.address}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FontAwesomeIcon icon={faGlobe} />
                <a href={INVOICE_COMPANY_INFO.website} style={{ color: "white", textDecoration: "none" }}>
                  {INVOICE_COMPANY_INFO.website}
                </a>
              </div>
            </div>
          </div>

          {/* Invoice Info Right */}
          <div style={{ flex: "1 1 45%", minWidth: "250px", textAlign: "right" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "clamp(12px, 2%, 20px)",
                marginBottom: "clamp(10px, 2%, 20px)",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(1.2rem, 3%, 1.5rem)",
                  fontWeight: "800",
                  margin: "0 0 8px 0",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Invoice
              </h3>
              <div style={{ fontSize: "clamp(0.75rem, 1.5%, 0.85rem)", lineHeight: "1.6" }}>
                <div>
                  <strong>Invoice #:</strong> INV-{orderData.id}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(orderData.date)}
                </div>
              </div>
            </div>

            <div
              style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "clamp(10px, 2%, 15px)" }}
            >
              <div
                style={{
                  fontSize: "clamp(0.65rem, 1.5%, 0.75rem)",
                  fontWeight: "800",
                  marginBottom: "4px",
                  opacity: "0.9",
                  textTransform: "uppercase",
                }}
              >
                📧 Sent To:
              </div>
              <div style={{ fontSize: "clamp(0.75rem, 2%, 0.85rem)", fontWeight: "600", wordBreak: "break-all" }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                  borderRadius: "8px",
                  width: "clamp(28px, 5%, 36px)",
                  height: "clamp(28px, 5%, 36px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "clamp(8px, 2%, 12px)",
                  color: "white",
                  fontSize: "clamp(14px, 3%, 18px)",
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
                  borderRadius: "8px",
                  width: "clamp(28px, 5%, 36px)",
                  height: "clamp(28px, 5%, 36px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "clamp(8px, 2%, 12px)",
                  color: "white",
                  fontSize: "clamp(14px, 3%, 18px)",
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
                    <span
                      style={{
                        color: "#059669",
                        fontWeight: "800",
                        background: "#d1fae5",
                        padding: "clamp(3px, 0.5%, 4px) clamp(8px, 1%, 12px)",
                        borderRadius: "20px",
                        fontSize: "clamp(0.6rem, 1%, 0.7rem)",
                        display: "inline-block",
                      }}
                    >
                      ✓ COMPLETED
                    </span>
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
                borderRadius: "10px",
                width: "clamp(32px, 6%, 44px)",
                height: "clamp(32px, 6%, 44px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "clamp(10px, 2%, 15px)",
                color: "white",
                fontSize: "clamp(16px, 4%, 22px)",
              }}
            >
              <FontAwesomeIcon icon={faCartShopping} size="lg" />
            </div>
            <h3 style={{ margin: "0", fontSize: "clamp(0.95rem, 3%, 1.1rem)", fontWeight: "700", color: "#1e293b" }}>
              Order Items
            </h3>
          </div>

          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
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
                      width: "35%",
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px, 2%, 20px)" }}>
          <div></div>
          <div
            style={{
              background: "#f0f4f8",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
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
            © 2025 {INVOICE_COMPANY_INFO.name}. All rights reserved.
            <br />
            Secure payment gateway. For support, reply to this email.
          </p>
        </div>
      </div>
    </div>
  )
}
