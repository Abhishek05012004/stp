const express = require("express")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const router = express.Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RH0I6LBnmc0Ziz",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "7ReMSO0JONPPyRe0WkuylqTl",
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
})

const generateInvoiceHTML = (orderData) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${orderData.id}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f3f4f6; color: #1f2937; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
        
        .header { background: #2563eb; color: white; padding: 40px; }
        .header-table { width: 100%; border-collapse: collapse; }
        .company-logo-box { width: 48px; height: 48px; background: white; border-radius: 10px; text-align: center; line-height: 48px; font-size: 24px; display: inline-block; margin-right: 15px; color: #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .company-name { font-size: 36px; font-weight: 800; margin: 0; letter-spacing: -0.025em; display: inline-block; vertical-align: middle; text-transform: uppercase; }
        .invoice-badge { background: rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; text-align: left; width: 280px; border: 1px solid rgba(255,255,255,0.2); }
        .paid-status { display: inline-block; background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-top: 15px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }

        .details-container { padding: 30px; }
        .details-table { width: 100%; border-collapse: separate; border-spacing: 20px 0; margin: 0 -20px; }
        .details-box { background: #f9fafb; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; vertical-align: top; width: 33%; }
        .payment-box { background: #f0fdf4; padding: 25px; border-radius: 12px; border: 1px solid #dcfce7; vertical-align: top; width: 33%; }
        .customer-box { background: #fef9c3; padding: 25px; border-radius: 12px; border: 1px solid #fde68a; vertical-align: top; width: 33%; }
        
        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; color: #111827; }
        .section-icon { width: 32px; height: 32px; background: #dbeafe; color: #2563eb; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 10px; font-size: 16px; }
        .payment-icon { width: 32px; height: 32px; background: #dcfce7; color: #059669; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 10px; font-size: 16px; }
        .customer-icon { width: 32px; height: 32px; background: #fef9c3; color: #92400e; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 10px; font-size: 16px; }
        
        .row { margin-bottom: 12px; font-size: 14px; display: table; width: 100%; }
        .label { font-weight: 600; color: #4b5563; display: table-cell; width: 100px; }
        .value { color: #111827; display: table-cell; }
        .value-tag { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 6px; border: 1px solid #e5e7eb; color: #374151; font-size: 13px; }
        .payment-tag { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #ecfdf5; padding: 4px 8px; border-radius: 6px; border: 1px solid #dcfce7; color: #065f46; font-size: 13px; }
        .status-badge { color: #059669; font-weight: 700; background: #dcfce7; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }

        .items-section { padding: 0 30px 40px 30px; }
        .items-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; }
        .items-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
        .items-table th { background: #1f2937; color: white; padding: 18px; text-align: left; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        .items-table td { padding: 15px 18px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        
        .totals-section { padding: 0 30px 40px 30px; text-align: right; }
        .totals-container { display: inline-block; width: 380px; text-align: left; }
        .total-row { display: table; width: 100%; margin-bottom: 8px; font-size: 15px; }
        .total-label { display: table-cell; color: #4b5563; }
        .total-value { display: table-cell; text-align: right; font-weight: 600; color: #111827; }
        
        .grand-total-box { background: #f8fafc; padding: 25px; border-radius: 16px; border: 2px solid #3b82f6; margin-top: 20px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
        .grand-total-label { font-size: 18px; font-weight: 700; color: #1e293b; }
        .grand-total-value { font-size: 26px; font-weight: 800; color: #2563eb; }
        
        .footer { background: #fffbeb; padding: 40px; text-align: center; border-top: 1px solid #fef3c7; }
        .footer-title { color: #92400e; font-size: 20px; font-weight: 800; margin-bottom: 10px; }
        .footer-text { color: #b45309; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto 25px auto; }
        .footer-contact { background: white; padding: 20px; border-radius: 12px; border: 1px solid #fde68a; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .footer-link { color: #2563eb; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <table class="header-table">
            <tr>
              <td valign="top">
                <div style="display: flex; align-items: center; margin-bottom: 25px;">
                  <div class="company-logo-box">💳</div>
                  <div>
                    <div class="company-name">SCAN TAP PAY</div>
                    <p style="margin: 2px 0 0 0; font-size: 15px; opacity: 0.9; font-weight: 500;">Smart Payment Solutions</p>
                  </div>
                </div>
                <div style="font-size: 14px; opacity: 0.9; line-height: 1.8;">
                  <p style="margin: 0;">📧 <a href="mailto:scantappay@gmail.com" style="color: white; text-decoration: none;">scantappay@gmail.com</a></p>
                  <p style="margin: 0;">📞 7575841397 / 8511231514</p>
                  <p style="margin: 0;">🏢 Office no. - 16, Digital Plaza, Mumbai - 400001</p>
                  <p style="margin: 8px 0 0 0;">🌐 <a href="https://scantappay.vercel.app/" style="color: white; font-weight: 600;">visit us: scantappay.vercel.app</a></p>
                </div>
              </td>
              <td align="right" valign="top">
                <div class="invoice-badge">
                  <h2 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 800; letter-spacing: 0.05em;">INVOICE</h2>
                  <div style="font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0;"><strong>Invoice #:</strong> <span style="opacity: 0.9;">INV-${orderData.id}</span></p>
                    <p style="margin: 0;"><strong>Date:</strong> <span style="opacity: 0.9;">${currentDate} at ${currentTime}</span></p>
                  </div>
                  <div class="paid-status">✓ PAID</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="details-container">
          <table class="details-table" width="100%">
            <tr>
              <td class="details-box">
                <div class="section-title"><span class="section-icon">📋</span> Invoice Details</div>
                <div class="row"><span class="label">Invoice #:</span> <span class="value"><span class="value-tag">INV-${orderData.id}</span></span></div>
                <div class="row"><span class="label">Order ID:</span> <span class="value"><span class="value-tag">${orderData.id}</span></span></div>
                <div class="row"><span class="label">Date:</span> <span class="value">${currentDate}</span></div>
                <div class="row"><span class="label">Time:</span> <span class="value">${currentTime}</span></div>
              </td>
              <td class="payment-box">
                <div class="section-title"><span class="payment-icon">💳</span> Payment Details</div>
                <div class="row"><span class="label">Method:</span> <span class="value">${orderData.paymentMethod || "Demo Payment"}</span></div>
                <div class="row"><span class="label">Transaction:</span> <span class="value"><span class="payment-tag">${orderData.transactionId}</span></span></div>
                <div class="row"><span class="label">Status:</span> <span class="value"><span class="status-badge">✓ ${orderData.status.toUpperCase()}</span></span></div>
              </td>
              <td class="customer-box">
                <div class="section-title"><span class="customer-icon">👤</span> Customer</div>
                <div class="row"><span class="label">Sent to:</span> <span class="value" style="font-weight: 600;">${orderData.customerEmail}</span></div>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="items-section">
          <div class="items-title"><span style="margin-right: 10px;">🛒</span> Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item, index) => `
                <tr style="background: ${index % 2 === 0 ? "#ffffff" : "#f9fafb"};">
                  <td style="font-weight: 600; color: #111827;">${item.name}</td>
                  <td style="text-align: center;"><span style="background: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-weight: 700; color: #374151; border: 1px solid #e5e7eb;">${item.quantity}</span></td>
                  <td style="text-align: right; color: #4b5563;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right; font-weight: 700; color: #111827;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="totals-section">
          <div class="totals-container">
            <div class="total-row">
              <span class="total-label">Subtotal:</span>
              <span class="total-value">₹${orderData.total.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Shipping:</span>
              <span class="total-value" style="color: #10b981;">Free</span>
            </div>
            <div class="grand-total-box">
              <table width="100%">
                <tr>
                  <td class="grand-total-label">Total Amount:</td>
                  <td align="right" class="grand-total-value">₹${orderData.finalTotal.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-title">Thank You for Your Order!</div>
          <p class="footer-text">
            We appreciate your trust in Scan Tap Pay. Your order has been processed successfully and your smart payment solutions are on the way!
          </p>
          <div class="footer-contact">
            <p style="margin: 0 0 8px 0; font-weight: 700; color: #1e293b;">
              📧 <span style="font-weight: 500;">scantappay@gmail.com</span> | 📞 <span style="font-weight: 500;">7575841397 / 8511231514</span>
            </p>
            <p style="margin: 0;">
              🌐 visit us: <a href="https://scantappay.vercel.app/" class="footer-link">https://scantappay.vercel.app/</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" })
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
})

// Verify Razorpay payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification data" })
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "7ReMSO0JONPPyRe0WkuylqTl")
      .update(body.toString())
      .digest("hex")

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      res.json({
        success: true,
        message: "Payment verified successfully",
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      })
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({ error: "Payment verification failed" })
  }
})

// Send payment invoice
router.post("/send-invoice", async (req, res) => {
  try {
    const { email, orderData } = req.body

    if (!email || !orderData) {
      return res.status(400).json({ error: "Email and order data are required" })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.")
      return res.status(500).json({
        error: "Email service not configured",
        message: "Please configure email credentials in environment variables",
      })
    }

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(orderData)

    // Email options
    const mailOptions = {
      from: `"Scan Tap Pay" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice for Order ${orderData.id} - Scan Tap Pay`,
      html: invoiceHTML,
      text: `
        Thank you for your order!
        
        Order Details:
        Order ID: ${orderData.id}
        Transaction ID: ${orderData.transactionId}
        Amount: ₹${orderData.finalTotal}
        Payment Method: ${orderData.paymentMethod || "Demo Payment"}
        Status: Completed
        
        Items:
        ${orderData.items.map((item) => `- ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}
        
        Subtotal: ₹${orderData.total.toFixed(2)}
        Shipping: Free
        Total Amount: ₹${orderData.finalTotal.toFixed(2)}
        
        Thank you for shopping with us!
        Scan Tap Pay
      `,
    }

    console.log(`[v0] Attempting to send invoice email to: ${email}`)
    await transporter.sendMail(mailOptions)
    console.log(`[v0] Invoice email sent successfully to: ${email}`)

    res.json({
      success: true,
      message: "Invoice email sent successfully",
      email: email,
      orderId: orderData.id,
    })
  } catch (error) {
    console.error("Error sending invoice email:", error)
    res.status(500).json({
      error: "Failed to send invoice email",
      details: error.message,
      suggestion: "Please check your email configuration (EMAIL_USER and EMAIL_PASS environment variables)",
    })
  }
})

// Get payment details
router.get("/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params
    const payment = await razorpay.payments.fetch(paymentId)

    res.json({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      created_at: payment.created_at,
    })
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({ error: "Failed to fetch payment details" })
  }
})

module.exports = router
