const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h"

// Generate JWT Token
const generateToken = (adminId) => {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      })
    }

    // Find admin by username
    const admin = await Admin.findOne({ username }).select("+password")

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      })
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Generate token
    const token = generateToken(admin._id)

    // Remove password from response
    const adminData = admin.toJSON()

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: adminData,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Verify Token
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const admin = await Admin.findById(decoded.adminId)

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    res.json({
      success: true,
      admin: admin.toJSON(),
    })
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}

// Create Admin (for initial setup)
const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and email are required",
      })
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this username or email already exists",
      })
    }

    // Create new admin
    const admin = new Admin({
      username,
      password,
      email,
    })

    await admin.save()

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: admin.toJSON(),
    })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Logout (client-side token removal, but we can track it)
const logoutAdmin = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  loginAdmin,
  verifyToken,
  createAdmin,
  logoutAdmin,
}
