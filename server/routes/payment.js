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

// Remove the old generateInvoiceHTML function since we're getting HTML from frontend

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

// Send payment invoice - Now uses HTML from frontend
router.post("/send-invoice", async (req, res) => {
  try {
    const { email, orderData, invoiceHTML } = req.body

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

    // Email options
    const mailOptions = {
      from: `"Scan Tap Pay" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice for Order ${orderData.id} - Scan Tap Pay`,
      html: invoiceHTML || `Simple invoice for order ${orderData.id}`, // Fallback if no HTML
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