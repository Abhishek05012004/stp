"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import QrScanner from "qr-scanner"
import { useCart } from "../context/CartContext.jsx"
import { getProductById } from "../utils/productData.js"
import { playBeepSound, playSuccessSound, preloadAudio } from "../utils/soundUtils.js"
import "../styles/components/scanner.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faCircleXmark, faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"

const QRScannerComponent = ({ isActive = true, onProductAdded }) => {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState("idle")
  const [cameraError, setCameraError] = useState(false)
  const { addItemOnce, isItemInCart } = useCart()

  const [pendingProduct, setPendingProduct] = useState(null)
  const [duplicateProduct, setDuplicateProduct] = useState(null)

  const lastScannedRef = useRef("")
  const pendingProductRef = useRef(null)
  const duplicateProductRef = useRef(null)

  const setPendingProductWithRef = (val) => {
    pendingProductRef.current = val
    setPendingProduct(val)
  }

  const setDuplicateProductWithRef = (val) => {
    duplicateProductRef.current = val
    setDuplicateProduct(val)
  }

  useEffect(() => {
    preloadAudio()
  }, [])

  useEffect(() => {
    if (!isActive) {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
        setIsScanning(false)
      }
      setPendingProductWithRef(null)
      setDuplicateProductWithRef(null)
      lastScannedRef.current = ""
      return
    }

    const startScanner = async () => {
      try {
        if (videoRef.current && !scannerRef.current) {
          scannerRef.current = new QrScanner(videoRef.current, (result) => handleScanResult(result.data), {
            highlightScanRegion: false,
            highlightCodeOutline: false,
            preferredCamera: "environment",
            maxScansPerSecond: 2,
            returnDetailedScanResult: true,
          })

          await scannerRef.current.start()
          setIsScanning(true)
          setCameraError(false)
        }
      } catch (error) {
        console.error("Error starting scanner:", error)
        setCameraError(true)
        setIsScanning(false)
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
        setIsScanning(false)
      }
    }
  }, [isActive])

  const handleScanResult = async (data) => {
    if (pendingProductRef.current || duplicateProductRef.current) return

    if (data === lastScannedRef.current) return
    lastScannedRef.current = data

    try {
      const product = await getProductById(data)

      if (product) {
        if (isItemInCart(product.id)) {
          setDuplicateProductWithRef(product)
        } else {
          playBeepSound()
          setPendingProductWithRef(product)
        }
      } else {
        setScanStatus("error")
        setTimeout(() => {
          setScanStatus("idle")
          lastScannedRef.current = ""
        }, 2000)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setScanStatus("error")
      setTimeout(() => {
        setScanStatus("idle")
        lastScannedRef.current = ""
      }, 2000)
    }
  }

  const handleConfirmAdd = () => {
    if (pendingProduct) {
      playSuccessSound()
      addItemOnce(pendingProduct)
      if (onProductAdded) {
        onProductAdded(pendingProduct)
      }
      setScanStatus("success")
      setTimeout(() => {
        setScanStatus("idle")
      }, 1500)
    }
    setPendingProductWithRef(null)
    lastScannedRef.current = ""
  }

  const handleCancelAdd = () => {
    setPendingProductWithRef(null)
    lastScannedRef.current = ""
  }

  const handleConfirmDuplicate = () => {
    setDuplicateProductWithRef(null)
    lastScannedRef.current = ""
  }

  const retryCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.start()
        setIsScanning(true)
        setCameraError(false)
      } catch (error) {
        console.error("Failed to restart camera:", error)
      }
    }
  }

  if (!isActive) {
    return (
      <motion.div
        className="scanner-container"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.7 }}
        style={{ pointerEvents: "none" }}
      >
        <div className="scanner-placeholder">
          <div className="scanner-placeholder-icon">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <FontAwesomeIcon icon={faCamera} style={{ fontSize: "3rem" }} />
            </motion.div>
          </div>
          <h3>Scanner Inactive</h3>
          <p>Activate scanner to begin adding products</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="scanner-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative" }}
    >
      <AnimatePresence>
        {pendingProduct && (
          <motion.div
            className="scanner-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              backdropFilter: "blur(12px)",
              padding: "1.5rem",
            }}
          >
            <motion.div
              className="scanner-modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: "rgba(30, 30, 30, 0.95)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                width: "100%",
                maxWidth: "380px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-xl)",
                textAlign: "center",
                color: "var(--text-primary)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  background: "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🛒
              </div>
              <h3 style={{ margin: "0 0 1rem 0", fontWeight: "700" }}>Confirm Add</h3>
              <p style={{ margin: "0 0 1.5rem 0", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                <strong>{pendingProduct.name}</strong> will be added to your cart. Do you want to confirm?
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  onClick={handleCancelAdd}
                  className="nav-btn secondary"
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.5rem",
                    borderRadius: "var(--radius-lg)",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  className="nav-btn primary"
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.5rem",
                    borderRadius: "var(--radius-lg)",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {duplicateProduct && (
          <motion.div
            className="scanner-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              backdropFilter: "blur(12px)",
              padding: "1.5rem",
            }}
          >
            <motion.div
              className="scanner-modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: "rgba(30, 30, 30, 0.95)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                width: "100%",
                maxWidth: "380px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-xl)",
                textAlign: "center",
                color: "var(--text-primary)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  color: "var(--warning-color)",
                }}
              >
                ⚠️
              </div>
              <h3 style={{ margin: "0 0 1rem 0", fontWeight: "700" }}>Already in Cart</h3>
              <p style={{ margin: "0 0 1.5rem 0", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                This is already in your cart. If you want, you can increase the quantity by going inside the cart.
              </p>
              <button
                onClick={handleConfirmDuplicate}
                className="nav-btn primary"
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <video
        ref={videoRef}
        className="scanner-video"
        playsInline
        muted
        style={{
          filter: isScanning ? "none" : "grayscale(1) blur(2px)",
          transform: isScanning ? "scale(1.02)" : "scale(1)",
        }}
      />

      <div className="scanner-overlay">
        <motion.div
          className={`scan-box ${scanStatus}`}
          animate={{
            scale: scanStatus === "scanning" ? [1, 1.03, 1] : scanStatus === "success" ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="scan-line"></div>
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
        </motion.div>
      </div>

      <AnimatePresence>
        {cameraError && (
          <motion.div
            className="camera-error-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="camera-error-content">
              <div className="error-icon">
                <FontAwesomeIcon icon={faCircleXmark} />
              </div>
              <h3>Camera Access Required</h3>
              <p>Please allow camera permissions to use the scanner</p>
              <button className="retry-button" onClick={retryCamera}>
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scanStatus !== "idle" && (
          <motion.div
            className={`scan-status ${scanStatus}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {scanStatus === "scanning" && (
              <div className="status-content">
                <div className="loading-spinner"></div>
                <p>Processing QR code...</p>
              </div>
            )}
            {scanStatus === "success" && (
              <div className="status-content">
                <div className="status-icon">
                  <FontAwesomeIcon icon={faCircleCheck} style={{ color: "var(--secondary-color)" }} />
                </div>
                <p>Product added to cart!</p>
              </div>
            )}
            {scanStatus === "error" && (
              <div className="status-content">
                <div className="status-icon">
                  <FontAwesomeIcon icon={faCircleXmark} style={{ color: "var(--danger-color)" }} />
                </div>
                <p>Product not found</p>
              </div>
            )}
            {scanStatus === "duplicate" && (
              <div className="status-content">
                <div className="status-icon">
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: "var(--warning-color)" }} />
                </div>
                <p>Product is already in the cart. If you need, you can increase the quantity.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scanner-footer">
        <div className="scanner-instruction">
          {isScanning
            ? "Align QR code within the frame"
            : cameraError
              ? "Camera access needed"
              : "Initializing camera..."}
        </div>

        <div className="scanner-indicators">
          <div className={`indicator ${isScanning ? "active" : ""}`}>
            <span className="indicator-dot"></span>
            Camera {isScanning ? "Active" : "Inactive"}
          </div>
          <div className="indicator">
            <span className="indicator-dot audio"></span>
            Audio Ready
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QRScannerComponent
