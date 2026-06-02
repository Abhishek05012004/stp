# 📱 Scan Tap Pay - Client Application

A modern React-based single-page application (SPA) built with Vite. It supports QR code scanning, NFC reading/writing, manual product entry, shopping cart management, PDF invoice generation, and Razorpay/UPI payment integrations.

---

## 🚀 Key Features

*   **🔍 Multiple Scan Formats**: Supports QR Code scanning (via Web Camera integration) and manual ID entry to add items to the cart.
*   **📡 NFC Support**: Integrates with the Web NFC API to read and write product information directly to NFC tags.
*   **🛒 Shopping Cart**: State-managed cart utilizing React Context API with real-time stock validation checks before checkout.
*   **💳 Payment Integrations**:
    *   **Razorpay SDK**: Handles secure digital transactions.
    *   **Direct UPI**: Generates dynamic QR codes and intent links for direct UPI transfers.
*   **📄 PDF Invoices**: Generates clean, downloadable PDF invoices locally using `html2pdf.js`.
*   **🛠️ Admin Dashboard**: Secure area to add products, modify stock levels, view real-time orders, and manage sales.
*   **✨ Premium UI/UX**: Built with fluid animations using `framer-motion`, modern icons from `lucide-react`, and 3D visual assets.

---

## 🛠️ Tech Stack

*   **Core**: React 18, Javascript (ES6+)
*   **Build Tool**: Vite
*   **Routing**: React Router DOM (v6)
*   **Animations**: Framer Motion, Three.js (React Three Fiber/Drei for 3D elements)
*   **Icons & Assets**: Lucide React, FontAwesome
*   **Scanning**: `html5-qrcode`, `qr-scanner`, `react-qr-scanner`

---

## 📁 Project Structure

```bash
client/
├── public/                 # Static assets
└── src/
    ├── assets/             # Images, SVGs, and 3D models
    ├── components/         # Reusable UI elements (QRScanner, NFCReader, NFCWriter, etc.)
    ├── context/            # Global state (CartContext, AuthContext)
    ├── pages/              # Page views (LandingPage, Home, Cart, Payment, Invoice, AdminDashboard, etc.)
    ├── styles/             # Global and component-specific CSS styles
    ├── utils/              # Helper functions and API utilities
    ├── App.jsx             # Root component & router setup
    ├── index.css           # Global CSS variables and styles
    └── main.jsx            # Application entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `client` directory:

```env
# API Endpoint URL (Local development)
VITE_API_BASE_URL=http://localhost:5000/api

# API Endpoint URL (Production deployment)
VITE_DEPLOYED_API_URL=https://scantappayserver.vercel.app/api

# Razorpay API Credentials
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# UPI Configuration (UPI ID for direct payments)
VITE_UPI_ID=yourname@upi
```

---

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev
    ```
4.  Build for production:
    ```bash
    npm run build
    ```
5.  Preview production build locally:
    ```bash
    npm run preview
    ```
