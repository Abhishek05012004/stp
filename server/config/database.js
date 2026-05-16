const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // Use your MongoDB URI with specific database name
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb+srv://alispatel1112003:eRu2Kpql6QWXajHA@cluster0.cke1m7w.mongodb.net/pin-tap-pay?retryWrites=true&w=majority&appName=Cluster0"

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
