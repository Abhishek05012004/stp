import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import QRScannerComponent from "../components/QRScanner.jsx"
import ManualProductEntry from "../components/ManualProductEntry.jsx"
import NFCReaderComponent from "../components/NFCReader.jsx"
import { updatePageMeta, scrollToTop } from "../utils/pageUtils.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRocket,
  faArrowLeft,
  faShoppingCart,
  faCreditCard,
  faMobileAlt,
  faQrcode,
  faFilePen,
  faTrashCan,
  faCircleCheck,
  faBookOpen,
  faUtensils,
  faLaptop,
  faShirt,
  faBook,
  faHouse,
  faFutbol,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons"
import { useCart } from "../context/CartContext.jsx" // Corrected import for useCart
import "../styles/components/header.css"
import "../styles/pages/home.css"

const Home = () => {
  const { getItemCount, items, clearCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  
  let currentMode = "qr"
  if (location.pathname === "/nfc-reader") currentMode = "nfc"
  if (location.pathname === "/manual-entry") currentMode = "manual"
  
  const scanMode = currentMode === "nfc" ? "nfc" : "qr"
  const showManualEntry = currentMode === "manual"

  const [isScannerActive, setIsScannerActive] = useState(true)
  const [lastAddedProduct, setLastAddedProduct] = useState(null)

  useEffect(() => {
    updatePageMeta(
      "Scanner - QR & NFC Scanner",
      "Scan QR codes and NFC tags to add products to your cart. Modern shopping experience with instant product recognition.",
    )
    scrollToTop()
  }, [])

  const handleProductAdded = (product) => {
    setLastAddedProduct(product)
    // Scanner always remains active for seamless consecutive scans
    setIsScannerActive(true)
  }

  const handleAddMoreProducts = () => {
    setIsScannerActive(true)
    setLastAddedProduct(null)
  }

  const handleClearCart = () => {
    clearCart()
    if (window.resetScannedProducts) {
      window.resetScannedProducts()
    }
    setLastAddedProduct(null)
    setIsScannerActive(true)
  }

  const toggleManualEntry = () => {
    navigate('/manual-entry')
  }

  const handleScanModeChange = (newMode) => {
    if (newMode === "qr") navigate('/scanner')
    if (newMode === "nfc") navigate('/nfc-reader')
  }

  return (
    <div className="container">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <FontAwesomeIcon icon={faRocket} /> Scan Tap Pay
        </h1>
        <p>Scan QR code or tap on NFC tag of any product to add it to your cart</p>
      </motion.div>

      <motion.div
        className="nav-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Link to="/" className="nav-btn secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>

        <Link to="/cart" className="nav-btn secondary">
          <FontAwesomeIcon icon={faShoppingCart} /> Cart ({getItemCount()})
        </Link>



        <Link to="/nfc-manager" className="nav-btn accent">
          <FontAwesomeIcon icon={faMobileAlt} /> NFC Manager
        </Link>

        <button
          onClick={() => handleScanModeChange("qr")}
          className={`nav-btn primary ${currentMode === "qr" ? "active-tab" : ""}`}
        >
          <FontAwesomeIcon icon={faQrcode} /> QR Scanner
        </button>

        <button
          onClick={() => handleScanModeChange("nfc")}
          className={`nav-btn accent ${currentMode === "nfc" ? "active-tab" : ""}`}
        >
          <FontAwesomeIcon icon={faMobileAlt} /> NFC Reader
        </button>

        <button 
          onClick={toggleManualEntry} 
          className={`nav-btn info ${currentMode === "manual" ? "active-tab" : ""}`}
        >
          <FontAwesomeIcon icon={faFilePen} /> Manual Entry
        </button>

        {items.length > 0 && (
          <button onClick={handleClearCart} className="nav-btn danger">
            <FontAwesomeIcon icon={faTrashCan} /> Clear Cart
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!isScannerActive && lastAddedProduct && !showManualEntry && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="status-message success"
            style={{ margin: "1rem 0" }}
          >
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.125rem",
                fontWeight: "600",
              }}
            >
              <FontAwesomeIcon icon={faCircleCheck} /> Product Added Successfully!
            </h3>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              <strong>{lastAddedProduct.name}</strong> has been added to your cart.
            </p>
            <p style={{ margin: "0", fontSize: "0.875rem", opacity: "0.8" }}>
              Use the cart to modify quantities or scan more products.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isScannerActive && !showManualEntry && (
          <motion.div
            key="add-more-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: "center", margin: "1.5rem 0" }}
          >
            <button
              onClick={handleAddMoreProducts}
              className="nav-btn primary"
              style={{
                fontSize: "1.125rem",
                padding: "1rem 2rem",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              📱 Add More Products
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={showManualEntry ? "manual" : scanMode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {showManualEntry ? (
          <ManualProductEntry onProductAdded={handleProductAdded} />
        ) : scanMode === "qr" ? (
          <QRScannerComponent isActive={isScannerActive} onProductAdded={handleProductAdded} />
        ) : (
          <NFCReaderComponent isActive={isScannerActive} onProductAdded={handleProductAdded} />
        )}
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ marginTop: "2rem" }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "var(--text-primary)",
          }}
        >
          <FontAwesomeIcon icon={faBookOpen} /> How to Use
        </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                gap: "2rem",
              }}
            >
          <div>
            <h4
              style={{
                color: "var(--primary-color)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {showManualEntry ? (
                <FontAwesomeIcon icon={faFilePen} />
              ) : scanMode === "qr" ? (
                <FontAwesomeIcon icon={faQrcode} />
              ) : (
                <FontAwesomeIcon icon={faMobileAlt} />
              )}
              {showManualEntry ? "Manual Entry" : scanMode === "qr" ? "QR Scanner" : "NFC Reader"}
            </h4>
            <ol
              style={{
                paddingLeft: "1.5rem",
                lineHeight: "1.8",
                color: "var(--text-secondary)",
                wordBreak: "break-word",
              }}
            >
              {showManualEntry ? (
                <>
                  <li>Browse all available products in the list</li>
                  <li>Click on any product card to add it to cart</li>
                  <li>Or enter a Product ID manually</li>
                  <li>Use search and category filters</li>
                  <li>Switch to scanner mode for QR/NFC</li>
                </>
              ) : scanMode === "qr" ? (
                <>
                  <li>Point your camera at a QR code</li>
                  <li>Wait for the green animation and sound</li>
                  <li>Product will be added automatically</li>
                  <li>Duplicates are prevented</li>
                  <li>Use cart to modify quantities</li>
                </>
              ) : (
                <>
                  <li>Hold your device near an NFC tag</li>
                  <li>Wait for the blue animation and sound</li>
                  <li>Product will be added automatically</li>
                  <li>Duplicates are prevented</li>
                  <li>Use cart to modify quantities</li>
                </>
              )}
            </ol>
          </div>

          <div>
            <h4 style={{ color: "var(--secondary-color)", marginBottom: "1rem" }}>
              <FontAwesomeIcon icon={faWandMagicSparkles} /> Sample Product IDs
            </h4>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: "0.75rem",
                fontSize: "0.875rem",
                width: "max-content",
              }}
            >
              {[
                { icon: faUtensils, category: "Food", id: "FOOD001-015", className: "primary" },
                { icon: faLaptop, category: "Electronics", id: "ELEC001-020", className: "info" },
                { icon: faShirt, category: "Clothes", id: "CLTH001-020", className: "secondary" },
                { icon: faBook, category: "Books", id: "BOOK001-015", className: "warning" },
                { icon: faHouse, category: "Home", id: "HOME001-015", className: "danger" },
                { icon: faFutbol, category: "Sports", id: "SPRT001-015", className: "primary" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`badge ${item.className}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5rem 7rem 0.5rem auto",
                    alignItems: "center",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span>{item.category}</span>
                  <span>:</span>
                  <span>{item.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faShoppingCart} /> Current Cart Summary
              </h4>
              <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      margin: "0.5rem 0",
                      padding: "0.5rem",
                      background: "var(--bg-primary)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "var(--secondary-color)",
                      }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
                <div
                  style={{
                    fontWeight: "700",
                    marginTop: "1rem",
                    fontSize: "1.125rem",
                    color: "var(--primary-color)",
                    textAlign: "right",
                    padding: "0.75rem",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--primary-color)",
                  }}
                >
                  Total: ₹{items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "var(--radius-xl)",
            fontSize: "0.875rem",
            color: "var(--primary-dark)",
          }}
        >
          <h4
            style={{
              margin: "0 0 1rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ✨ Features
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>• Smart product browser with filters</div>
            <div>• One-click add to cart</div>
            <div>• Real-time search functionality</div>
            <div>• Duplicate prevention system</div>
            <div>• Responsive design for all devices</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
