const mongoose = require("mongoose")
require("dotenv").config()
const Admin = require("../models/Admin")
const connectDB = require("../config/database")

const createDefaultAdmin = async () => {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Default admin already exists")
      process.exit(0)
    }

    // Create default admin
    const admin = new Admin({
      username: "admin",
      password: "admin123", // Change this in production
      email: "admin@tiptappay.com",
      role: "super-admin",
    })

    await admin.save()
    console.log("Default admin created successfully")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createDefaultAdmin()
