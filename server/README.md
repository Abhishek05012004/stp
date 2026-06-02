# ⚙️ Scan Tap Pay - Backend API Server

A high-performance, secure backend server for the Scan Tap Pay QR Scanner and Payment application. Built with Node.js, Express, and MongoDB, it handles data storage, order processing, stock validation, admin authentication, payment verification, and transaction tracking.

---

## 🚀 Key Features

*   **🔐 Admin Authentication**: Secure endpoints guarded by JSON Web Tokens (JWT) and passwords hashed with Bcryptjs.
*   **📦 Inventory Management**: Endpoints for adding, updating, and deleting products.
*   **⚡ Real-Time Stock Validation**: Ensures products are not oversold during checkouts with bulk stock reservation, deduction, and automatic restoration upon cancellation.
*   **🛒 Order System**: Tracks purchase status, updates orders, and handles refunds/cancellations.
*   **💳 Payment Processing**:
    *   **Razorpay SDK**: Handles backend order generation, signature verification, and transaction status synchronization.
*   **✉️ Email Invoicing**: Auto-sends PDF-formatted email updates/receipts to clients using Nodemailer.
*   **🛡️ Production Security & Performance**:
    *   **Helmet**: Enforces secure HTTP response headers.
    *   **Rate Limiting**: Throttles general API traffic and places a strict limit on login attempts.
    *   **CORS Configuration**: Restricts API calls to approved origins.
    *   **Compression**: Gzip compression for faster network payloads.

---

## 🛠️ Tech Stack

*   **Runtime Environment**: Node.js (>= 18.0.0)
*   **Framework**: Express.js
*   **Database**: MongoDB (Object modeling via Mongoose)
*   **Security & Encryption**: Bcryptjs, JWT (jsonwebtoken), Helmet
*   **API Rate Limiting**: express-rate-limit
*   **Email Client**: Nodemailer
*   **Payment Gateway**: Razorpay Node SDK

---

## 📁 Project Structure

```bash
server/
├── config/                 # Database connection settings
├── controllers/            # Request handlers (auth, orders, products)
├── middleware/             # Authorization checking (admin security)
├── models/                 # Mongoose schemas (Admin, Order, Product)
├── routes/                 # Express API endpoints
├── scripts/                # Database seeding and admin creation utility scripts
├── server.js               # Entry point of the Express app
└── vercel.json             # Vercel deployment configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database-name

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Email Configuration (for sending invoices)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

---

## 🗺️ API Endpoints Summary

### Auth Routes (Public/Admin)
*   `POST /api/auth/login` - Admin authentication (Strict rate limit)
*   `POST /api/auth/verify` - Check token validity
*   `POST /api/auth/create-admin` - Create new administrator credentials
*   `POST /api/auth/logout` - Invalidate credentials

### Product Routes
*   `GET /api/products` - List all products
*   `GET /api/product/:id` - Fetch single product details
*   `POST /api/products` - [Admin] Create a product
*   `PUT /api/product/:id/stock` - [Admin] Update stock limits
*   `DELETE /api/product/:id` - [Admin] Delete a product
*   `POST /api/products/validate-bulk-stock` - Validate stock availability
*   `POST /api/products/deduct-stock` - Deduct stock on purchase
*   `POST /api/products/restore-stock` - Restore stock on order cancellation

### Order Routes
*   `POST /api/orders` - Generate client order
*   `POST /api/orders/with-stock-validation` - Create order + validate stock atomically
*   `GET /api/orders` - [Admin] List all orders
*   `GET /api/order/:id` - [Admin] Fetch specific order details
*   `PUT /api/order/:id/status` - [Admin] Update order payment/delivery status
*   `PUT /api/order/:id/cancel` - [Admin] Cancel order and restore product stock levels
*   `PUT /api/order/:id/email` - [Admin] Update receipt email address

### Payment & System Routes
*   `POST /api/payment` - Create payment or verify Razorpay signatures
*   `GET /api/health` - Check health status of API & Database
*   `GET /api/db-status` - [Admin] Detailed Mongoose connection state
*   `GET /api/stats` - [Admin] Returns dashboard statistics (total counts, categories)

---

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance running

### Installation

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up local Admin credentials:
    ```bash
    npm run create-admin
    ```
4.  Populate local database with mock products:
    ```bash
    npm run seed
    ```
5.  Start the development server (runs with `nodemon` for auto-reloading):
    ```bash
    npm run dev
    ```
6.  Start production server:
    ```bash
    npm run start
    ```
