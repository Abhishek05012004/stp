const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
})

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      default: "Guest Customer",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "Online Payment",
    },
    transactionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Add indexes for performance
orderSchema.index({ customerEmail: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ orderId: 1 }) // Already unique, but explicit index doesn't hurt

module.exports = mongoose.model("Order", orderSchema)
