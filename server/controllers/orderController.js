const Order = require("../models/Order")
const Product = require("../models/Product")

// Create new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body

    const order = new Order({
      orderId: orderData.id,
      items: orderData.items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: orderData.total,
      tax: orderData.tax,
      total: orderData.total + orderData.tax,
      status: orderData.status || "completed",
    })

    await order.save()

    res.status(201).json({
      message: "Order created successfully",
      orderId: order.orderId,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
}

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id
    const order = await Order.findOne({ orderId })

    if (order) {
      res.json({
        id: order.orderId,
        items: order.items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: order.subtotal,
        tax: order.tax,
        status: order.status,
        date: order.createdAt.toISOString(),
      })
    } else {
      res.status(404).json({ error: "Order not found" })
    }
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ error: "Failed to fetch order" })
  }
}

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 })

    const formattedOrders = orders.map((order) => ({
      id: order.orderId,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      date: order.createdAt,
    }))

    res.json(formattedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
}

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body

    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true })

    if (order) {
      res.json({ message: "Order status updated successfully", status: order.status })
    } else {
      res.status(404).json({ error: "Order not found" })
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(500).json({ error: "Failed to update order status" })
  }
}

const createOrderWithStockValidation = async (req, res) => {
  try {
    const orderData = req.body

    // Step 1: Validate stock availability for all items
    const stockValidation = []
    let allAvailable = true

    for (const item of orderData.items) {
      const product = await Product.findOne({ id: item.id })

      if (!product) {
        return res.status(404).json({
          error: `Product ${item.id} not found`,
        })
      }

      const isAvailable = product.stock >= item.quantity

      stockValidation.push({
        productId: item.id,
        name: product.name,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
        available: isAvailable,
      })

      if (!isAvailable) {
        allAvailable = false
      }
    }

    // Step 2: Return stock validation errors if any
    if (!allAvailable) {
      const unavailableItems = stockValidation.filter((item) => !item.available)
      return res.status(400).json({
        error: "Insufficient stock for some items",
        unavailableItems,
        message: "Please reduce quantities or remove unavailable items",
      })
    }

    // Step 3: Create order with atomic stock deduction
    const session = await Order.startSession()

    try {
      const result = await session.withTransaction(async () => {
        // Deduct stock for all items atomically
        for (const item of orderData.items) {
          const product = await Product.findOne({ id: item.id }).session(session)

          // Double-check stock (race condition protection)
          if (product.stock < item.quantity) {
            throw new Error(`Stock changed for ${product.name}. Please try again.`)
          }

          await Product.findOneAndUpdate({ id: item.id }, { $inc: { stock: -item.quantity } }, { session })
        }

        // Create the order
        const order = new Order({
          orderId: orderData.id,
          items: orderData.items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: orderData.total,
          tax: orderData.tax,
          total: orderData.total + orderData.tax,
          status: "completed", // Mark as completed since payment was successful
        })

        await order.save({ session })
        return order
      })

      res.status(201).json({
        success: true,
        message: "Order created and inventory updated successfully",
        orderId: result.orderId,
        timestamp: new Date().toISOString(),
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error creating order with stock validation:", error)
    res.status(500).json({
      error: "Failed to create order",
      message: error.message,
    })
  }
}

const cancelOrderAndRestoreStock = async (req, res) => {
  try {
    const orderId = req.params.id

    const order = await Order.findOne({ orderId })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order already cancelled" })
    }

    // Restore stock atomically
    const session = await Order.startSession()

    try {
      await session.withTransaction(async () => {
        // Restore stock for all items
        for (const item of order.items) {
          await Product.findOneAndUpdate({ id: item.productId }, { $inc: { stock: item.quantity } }, { session })
        }

        // Update order status
        await Order.findOneAndUpdate({ orderId }, { status: "cancelled" }, { session })
      })

      res.json({
        success: true,
        message: "Order cancelled and stock restored successfully",
        orderId: order.orderId,
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error cancelling order:", error)
    res.status(500).json({
      error: "Failed to cancel order",
      message: error.message,
    })
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  createOrderWithStockValidation,
  cancelOrderAndRestoreStock,
}
