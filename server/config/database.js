const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // Use your MongoDB URI with specific database name
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.log("🔴 Mongoose connection error:", err)
})

module.exports = connectDB
