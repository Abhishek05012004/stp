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
        body { font-family: 'Arial', 'Helvetica', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; background: #1e40af; color: white; margin: -30px -30px 30px -30px; padding: 30px; }
        .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .invoice-title { font-size: 24px; margin-bottom: 10px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
        .invoice-info, .customer-info { flex: 1; min-width: 300px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .invoice-info h3, .customer-info h3 { color: #1e293b; margin-bottom: 15px; font-size: 18px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
        .items-table th, .items-table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .items-table th { background-color: #1e293b; color: white; font-weight: bold; }
        .items-table tr:nth-child(even) { background-color: #f8fafc; }
        .totals { text-align: right; margin-bottom: 30px; }
        .totals table { margin-left: auto; background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0; }
        .totals td { padding: 12px 15px; font-size: 15px; }
        .total-row { font-weight: bold; font-size: 20px; color: #1e40af; border-top: 2px solid #1e40af; background: white; }
        .footer { text-align: center; color: #64748b; font-size: 14px; border-top: 2px solid #e2e8f0; padding-top: 30px; background: #fef3c7; padding: 25px; border-radius: 15px; margin-top: 25px; border: 2px solid #f59e0b; }
        .status-badge { background: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .thank-you { font-size: 36px; margin-bottom: 12px; }
        .company-info { font-size: 13px; opacity: 0.9; line-height: 1.5; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 24px;">💳</div>
                <div>
                  <div class="company-name">TIP TAP PAY</div>
                  <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Smart Payment Solutions</p>
                </div>
              </div>
              <div class="company-info">
                <p style="margin: 2px 0;">📧 support@tiptappay.com</p>
                <p style="margin: 2px 0;">📞 +91-9876-543-210</p>
                <p style="margin: 2px 0;">🏢 123 Tech Street, Digital City, India - 110001</p>
              </div>
            </div>
            <div style="text-align: right; min-width: 200px;">
              <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 10px;">
                <div class="invoice-title">INVOICE</div>
                <div style="font-size: 13px; opacity: 0.9;">
                  <p style="margin: 3px 0;"><strong>Invoice #:</strong> INV-${orderData.id}</p>
                  <p style="margin: 3px 0;"><strong>Date:</strong> ${currentDate}</p>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <span class="status-badge">✅ PAID</span>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="invoice-info">
            <h3>📋 Invoice Details</h3>
            <div style="line-height: 1.8; color: #475569; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Invoice #:</span>
                <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 3px;">INV-${orderData.id}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Order ID:</span>
                <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 3px;">${orderData.id}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Date:</span>
                <span>${currentDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600;">Time:</span>
                <span>${currentTime}</span>
              </div>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>💳 Payment Details</h3>
            <div style="line-height: 1.8; color: #475569; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Method:</span>
                <span>${orderData.paymentMethod}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Transaction:</span>
                <span style="font-family: monospace; background: #d1fae5; padding: 2px 6px; border-radius: 3px;">${orderData.transactionId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Email:</span>
                <span>${orderData.customerEmail}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600;">Status:</span>
                <span style="color: #059669; font-weight: bold; background: #d1fae5; padding: 3px 8px; border-radius: 12px; font-size: 12px;">✅ ${orderData.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e293b; margin-bottom: 20px; font-size: 20px; font-weight: bold; display: flex; align-items: center;">
            <span style="margin-right: 8px; font-size: 20px;">🛒</span>
            Order Items
          </h3>
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
                  <td style="font-weight: 600;">${item.name}</td>
                  <td style="text-align: center;"><span style="background: #e2e8f0; padding: 3px 8px; border-radius: 12px; font-weight: 600;">${item.quantity}</span></td>
                  <td style="text-align: center; font-weight: 500;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right; font-weight: bold; color: #1e293b;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="totals">
          <table>
            <tr>
              <td style="font-weight: 600;">Subtotal:</td>
              <td style="font-weight: 600;">₹${orderData.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">GST (18%):</td>
              <td style="font-weight: 600;">₹${orderData.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-weight: 600;">Shipping:</td>
              <td style="color: #059669; font-weight: bold;">Free</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount:</td>
              <td>₹${orderData.finalTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <div class="thank-you">🎉</div>
          <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: bold; color: #92400e;">Thank You for Your Business!</h3>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #a16207; font-weight: 500; line-height: 1.5;">
            Your order has been processed successfully. We appreciate your trust in Tip Tap Pay and look forward to serving you again!
          </p>
          <div style="font-size: 13px; color: #64748b; line-height: 1.6; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <p style="margin: 6px 0; font-weight: 600;">📧 For support: support@tiptappay.com | 📞 +91-9876-543-210</p>
            <p style="margin: 6px 0;">🌐 Visit us: www.tiptappay.com | Follow us on social media</p>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 4px 0; font-size: 11px; color: #94a3b8;">This is a computer-generated invoice. No signature required.</p>
              <p style="margin: 4px 0; font-size: 11px; color: #94a3b8;">Generated on ${new Date().toLocaleString()} | Invoice ID: INV-${orderData.id}</p>
            </div>
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
      from: `"QR Scanner Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice for Order ${orderData.id} - QR Scanner Store`,
      html: invoiceHTML,
      text: `
        Thank you for your order!
        
        Order Details:
        Order ID: ${orderData.id}
        Transaction ID: ${orderData.transactionId}
        Amount: ₹${orderData.finalTotal}
        Payment Method: ${orderData.paymentMethod}
        Status: Completed
        
        Items:
        ${orderData.items.map((item) => `- ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}
        
        Subtotal: ₹${orderData.total.toFixed(2)}
        GST (18%): ₹${orderData.tax.toFixed(2)}
        Total: ₹${orderData.finalTotal.toFixed(2)}
        
        Thank you for shopping with us!
        QR Scanner Store
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
