const Product = require("../models/Product")

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 })

    // Convert to object format for compatibility
    const productsObj = {}
    products.forEach((product) => {
      productsObj[product.id] = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
      }
    })

    res.json(productsObj)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
}

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findOne({ id: productId })

    if (product) {
      res.json({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
      })
    } else {
      res.status(404).json({ error: "Product not found" })
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
}

// Add new product
const addProduct = async (req, res) => {
  try {
    const productData = req.body

    // Check if product with same ID already exists
    const existingProduct = await Product.findOne({ id: productData.id })
    if (existingProduct) {
      return res.status(400).json({ error: "Product with this ID already exists" })
    }

    const product = new Product(productData)
    await product.save()

    res.status(201).json({
      message: "Product added successfully",
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
      },
    })
  } catch (error) {
    console.error("Error adding product:", error)
    res.status(500).json({ error: "Failed to add product" })
  }
}

// Update product stock
const updateProductStock = async (req, res) => {
  try {
    const productId = req.params.id
    const { stock } = req.body

    const product = await Product.findOneAndUpdate({ id: productId }, { stock }, { new: true })

    if (product) {
      res.json({ message: "Stock updated successfully", stock: product.stock })
    } else {
      res.status(404).json({ error: "Product not found" })
    }
  } catch (error) {
    console.error("Error updating stock:", error)
    res.status(500).json({ error: "Failed to update stock" })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findOneAndDelete({ id: productId })

    if (product) {
      res.json({ message: "Product deleted successfully" })
    } else {
      res.status(404).json({ error: "Product not found" })
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ error: "Failed to delete product" })
  }
}

const validateStockForCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const product = await Product.findOne({ id: productId })

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        available: false,
      })
    }

    const isAvailable = product.stock >= quantity

    res.json({
      productId: product.id,
      requestedQuantity: quantity,
      availableStock: product.stock,
      available: isAvailable,
      message: isAvailable ? "Stock available" : `Only ${product.stock} items available`,
    })
  } catch (error) {
    console.error("Error validating stock:", error)
    res.status(500).json({ error: "Failed to validate stock" })
  }
}

const validateBulkStock = async (req, res) => {
  try {
    const { items } = req.body // Array of {productId, quantity}

    const validationResults = []
    let allAvailable = true

    for (const item of items) {
      const product = await Product.findOne({ id: item.productId })

      if (!product) {
        validationResults.push({
          productId: item.productId,
          available: false,
          error: "Product not found",
        })
        allAvailable = false
        continue
      }

      const isAvailable = product.stock >= item.quantity

      validationResults.push({
        productId: product.id,
        name: product.name,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
        available: isAvailable,
        message: isAvailable ? "Stock available" : `Only ${product.stock} items available`,
      })

      if (!isAvailable) {
        allAvailable = false
      }
    }

    res.json({
      allAvailable,
      items: validationResults,
      message: allAvailable ? "All items available" : "Some items have insufficient stock",
    })
  } catch (error) {
    console.error("Error validating bulk stock:", error)
    res.status(500).json({ error: "Failed to validate bulk stock" })
  }
}

const deductStock = async (req, res) => {
  try {
    const { items } = req.body // Array of {productId, quantity}

    // Start a session for atomic operations
    const session = await Product.startSession()

    try {
      await session.withTransaction(async () => {
        const deductionResults = []

        for (const item of items) {
          // Find and validate stock with session lock
          const product = await Product.findOne({ id: item.productId }).session(session)

          if (!product) {
            throw new Error(`Product ${item.productId} not found`)
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
            )
          }

          // Deduct stock atomically
          const updatedProduct = await Product.findOneAndUpdate(
            { id: item.productId },
            { $inc: { stock: -item.quantity } },
            { new: true, session },
          )

          deductionResults.push({
            productId: item.productId,
            name: product.name,
            deductedQuantity: item.quantity,
            remainingStock: updatedProduct.stock,
          })
        }

        return deductionResults
      })

      res.json({
        success: true,
        message: "Stock deducted successfully",
        timestamp: new Date().toISOString(),
      })
    } catch (transactionError) {
      throw transactionError
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error deducting stock:", error)
    res.status(400).json({
      error: "Failed to deduct stock",
      message: error.message,
    })
  }
}

const restoreStock = async (req, res) => {
  try {
    const { items } = req.body // Array of {productId, quantity}

    const session = await Product.startSession()

    try {
      await session.withTransaction(async () => {
        for (const item of items) {
          await Product.findOneAndUpdate({ id: item.productId }, { $inc: { stock: item.quantity } }, { session })
        }
      })

      res.json({
        success: true,
        message: "Stock restored successfully",
        timestamp: new Date().toISOString(),
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error restoring stock:", error)
    res.status(500).json({
      error: "Failed to restore stock",
      message: error.message,
    })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductStock,
  deleteProduct,
  validateStockForCart,
  validateBulkStock,
  deductStock,
  restoreStock,
}
