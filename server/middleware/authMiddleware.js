const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const admin = await Admin.findById(decoded.adminId)

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      })
    }

    req.admin = admin
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    })
  }
}

module.exports = { authenticateAdmin }
