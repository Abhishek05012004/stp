const express = require("express")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const router = express.Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_RH0I6LBnmc0Ziz",
  key_secret: "7ReMSO0JONPPyRe0WkuylqTl",
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
})

const generateInvoiceHTML = (orderData) => {
  const currentDate = new Date().toLocaleDateString("en-IN")
  const currentTime = new Date().toLocaleTimeString("en-IN")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${orderData.id}</title>
      <style>
        body { font-family: 'Arial', 'Helvetica', sans-serif; margin: 0; padding: 20px; background-color: #f3f4f6; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #1e40af; color: white; padding: 40px; }
        .company-name { font-size: 32px; font-weight: bold; margin: 0; letter-spacing: -0.01em; }
        .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
        .company-info { font-size: 14px; opacity: 0.9; line-height: 1.6; margin-top: 15px; }
        .invoice-badge { background: rgba(255,255,255,0.15); padding: 20px; border-radius: 12px; text-align: right; min-width: 220px; }
        .paid-badge { display: inline-block; background: #10b981; color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 15px; border: 2px solid rgba(255,255,255,0.2); }
        
        .section-grid { display: flex; gap: 24px; padding: 40px; background: white; }
        .details-box { flex: 1; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .details-box h3 { color: #1e293b; margin: 0 0 16px 0; font-size: 18px; display: flex; align-items: center; gap: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #475569; }
        .detail-label { font-weight: 600; }
        .detail-value { font-family: monospace; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; }
        .status-value { color: #059669; font-weight: bold; background: #d1fae5; padding: 3px 10px; border-radius: 12px; font-size: 12px; }

        .items-section { padding: 0 40px 40px 40px; }
        .items-section h3 { font-size: 20px; color: #1e293b; margin-bottom: 20px; font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .items-table th { background: #1e293b; color: white; padding: 16px; text-align: left; font-size: 14px; }
        .items-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .items-table tr:last-child td { border-bottom: none; }
        
        .totals-section { display: flex; justify-content: flex-end; padding: 0 40px 40px 40px; }
        .totals-box { width: 300px; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; color: #1e293b; }
        .final-total { border-top: 2px solid #1e40af; margin-top: 12px; padding-top: 12px; font-size: 22px; font-weight: bold; color: #1e40af; }
        
        .footer { background: #fef3c7; padding: 40px; text-align: center; border-top: 1px solid #fde68a; }
        .footer h3 { color: #92400e; font-size: 20px; margin: 0 0 12px 0; }
        .footer-text { color: #a16207; font-size: 14px; line-height: 1.6; max-width: 600px; margin: 0 auto 24px auto; }
        .contact-box { background: white; padding: 20px; border-radius: 12px; border: 1px solid #fde68a; display: inline-block; font-size: 14px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="header-content">
            <div>
              <div class="company-name">TIP TAP PAY</div>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Smart Payment Solutions</p>
              <div class="company-info">
                <p style="margin: 4px 0;">📧 scantappay@gmail.com</p>
                <p style="margin: 4px 0;">📞 7575841397 | 8511231514</p>
                <p style="margin: 4px 0;">🏢 Office no. - 16, Digital Plaza, Mumbai - 400001</p>
              </div>
            </div>
            <div class="invoice-badge">
              <div class="invoice-title">INVOICE</div>
              <div style="font-size: 14px; opacity: 0.9;">
                <p style="margin: 4px 0;"><strong>Invoice #:</strong> INV-${orderData.id}</p>
                <p style="margin: 4px 0;"><strong>Date:</strong> ${currentDate}</p>
              </div>
              <span class="paid-badge">✓ PAID</span>
            </div>
          </div>
        </div>
        
        <div class="section-grid">
          <div class="details-box">
            <h3>📋 Invoice Details</h3>
            <div class="detail-row">
              <span class="detail-label">Invoice #:</span>
              <span class="detail-value">INV-${orderData.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Order ID:</span>
              <span class="detail-value">${orderData.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span>${currentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span>${currentTime}</span>
            </div>
          </div>
          
          <div class="details-box">
            <h3>💳 Payment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Method:</span>
              <span>${orderData.paymentMethod || "UPI Payment"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transaction:</span>
              <span class="detail-value" style="background: #d1fae5;">${orderData.transactionId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span>${orderData.customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="status-value">✓ ${orderData.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div class="items-section">
          <h3>🛒 Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item, index) => `
                <tr style="background: ${index % 2 === 0 ? "#f8fafc" : "white"};">
                  <td style="font-weight: 600; color: #1e293b;">${item.name}</td>
                  <td style="text-align: center;"><span style="background: #e2e8f0; padding: 4px 10px; border-radius: 12px; font-weight: 600;">${item.quantity}</span></td>
                  <td style="text-align: center;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right; font-weight: bold; color: #1e293b;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row">
              <span>Subtotal:</span>
              <span style="font-weight: 600;">₹${orderData.total.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>GST (18%):</span>
              <span style="font-weight: 600;">₹${orderData.tax.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span style="color: #059669; font-weight: bold;">Free</span>
            </div>
            <div class="final-total">
              <span>Total:</span>
              <span>₹${orderData.finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <h3>Thank You for Your Order!</h3>
          <p class="footer-text">
            We appreciate your trust in Tip Tap Pay. Your order has been processed and your smart payment solutions are on the way!
          </p>
          <div class="contact-box">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e293b;">📧 scantappay@gmail.com | 📞 7575841397 / 8511231514</p>
            <p style="margin: 0;">🌐 visit us: <a href="https://scan-tap-pay.vercel.app/" style="color: #1e40af; text-decoration: none;">https://scan-tap-pay.vercel.app/</a></p>
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
      .createHmac("sha256", "7ReMSO0JONPPyRe0WkuylqTl")
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
      from: `"Tip Tap Pay" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice for Order ${orderData.id} - Tip Tap Pay`,
      html: invoiceHTML,
      text: `
        Thank you for your order!
        
        Order Details:
        Order ID: ${orderData.id}
        Transaction ID: ${orderData.transactionId}
        Amount: ₹${orderData.finalTotal}
        Payment Method: ${orderData.paymentMethod || "UPI Payment"}
        Status: Completed
        
        Items:
        ${orderData.items.map((item) => `- ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}
        
        Subtotal: ₹${orderData.total.toFixed(2)}
        GST (18%): ₹${orderData.tax.toFixed(2)}
        Total: ₹${orderData.finalTotal.toFixed(2)}
        
        Thank you for shopping with us!
        Tip Tap Pay
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
