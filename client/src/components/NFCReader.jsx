"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext.jsx"
import { getProductById } from "../utils/productData.js"
import { playBeepSound, playSuccessSound, preloadAudio } from "../utils/soundUtils.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMobileAlt, faRss, faCheckCircle, faTimesCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons"

const NFCReaderComponent = ({ isActive = true, onProductAdded }) => {
  const [isReading, setIsReading] = useState(false)
  const [nfcStatus, setNfcStatus] = useState("idle")
  const [isNFCSupported, setIsNFCSupported] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const { addItemOnce, isItemInCart } = useCart()
  const abortControllerRef = useRef(null)
  const ndefReaderRef = useRef(null)

  const [pendingProduct, setPendingProduct] = useState(null)
  const [duplicateProduct, setDuplicateProduct] = useState(null)

  const lastReadRef = useRef("")
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
    checkNFCSupport()
    preloadAudio()
  }, [])

  useEffect(() => {
    if (!isActive || !isNFCSupported) {
      stopNFCReading()
      return
    }

    if (isActive && isNFCSupported) {
      startNFCReading()
    }

    return () => {
      stopNFCReading()
    }
  }, [isActive, isNFCSupported])

  const checkNFCSupport = () => {
    if ("NDEFReader" in window) {
      setIsNFCSupported(true)
    } else {
      setIsNFCSupported(false)
    }
  }

  const requestNFCPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "nfc" })

      if (permission.state === "granted") {
        setPermissionGranted(true)
        return true
      } else if (permission.state === "prompt") {
        return true
      } else {
        setPermissionGranted(false)
        return false
      }
    } catch (error) {
      return true
    }
  }

  const startNFCReading = async () => {
    if (!isNFCSupported || isReading) return

    try {
      setIsReading(true)
      setNfcStatus("reading")

      const hasPermission = await requestNFCPermission()
      if (!hasPermission) {
        setIsReading(false)
        setNfcStatus("error")
        return
      }

      abortControllerRef.current = new AbortController()
      ndefReaderRef.current = new window.NDEFReader()

      await ndefReaderRef.current.scan({
        signal: abortControllerRef.current.signal,
      })

      ndefReaderRef.current.addEventListener("reading", handleNFCReading)
      ndefReaderRef.current.addEventListener("readingerror", handleNFCError)

      setPermissionGranted(true)
    } catch (error) {
      console.error("❌ Error starting NFC reader:", error)
      setIsReading(false)
      setNfcStatus("error")

      if (error.name === "NotAllowedError") {
        // NotAllowedError handled
      } else if (error.name === "NotSupportedError") {
        setIsNFCSupported(false)
      } else if (error.name === "NotReadableError") {
        // NotReadableError handled
      } else {
        // Generic error
      }
    }
  }

  const stopNFCReading = () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      if (ndefReaderRef.current) {
        ndefReaderRef.current.removeEventListener("reading", handleNFCReading)
        ndefReaderRef.current.removeEventListener("readingerror", handleNFCError)
        ndefReaderRef.current = null
      }

      setIsReading(false)
      setNfcStatus("idle")
    } catch (error) {
      console.error("Error stopping NFC reader:", error)
    }
  }

  const handleNFCReading = (event) => {
    handleNFCRead(event.message, event.serialNumber)
  }

  const handleNFCError = (error) => {
    console.error("❌ NFC reading error:", error)

    if (nfcStatus === "info" || nfcStatus === "success") return

    setNfcStatus("error")

    setTimeout(() => {
      if (isReading) {
        setNfcStatus("reading")
      }
    }, 2000)
  }

  const handleNFCRead = async (message, serialNumber) => {
    try {
      let productId = null

      for (const record of message.records) {

        if (record.recordType === "text") {
          try {
            const textDecoder = new TextDecoder("utf-8")
            let text = ""

            if (record.data.byteLength > 0) {
              const firstByte = new Uint8Array(record.data)[0]

              if (firstByte < 32) {
                const languageCodeLength = firstByte & 0x3f
                const textData = record.data.slice(1 + languageCodeLength)
                text = textDecoder.decode(textData)
              } else {
                text = textDecoder.decode(record.data)
              }
            }



            const cleanText = text.trim().toUpperCase()
            const productMatch = cleanText.match(/^(FOOD|ELEC|CLTH|BOOK|HOME|SPRT)\d{3}$/i)
            if (productMatch) {
              productId = cleanText
              break
            }

            const extractMatch = cleanText.match(/(FOOD|ELEC|CLTH|BOOK|HOME|SPRT)\d{3}/i)
            if (extractMatch) {
              productId = extractMatch[0].toUpperCase()
              break
            }
          } catch (decodeError) {
            console.error("Error decoding text record:", decodeError)

            try {
              const rawText = String.fromCharCode(...new Uint8Array(record.data))
              const fallbackMatch = rawText.match(/(FOOD|ELEC|CLTH|BOOK|HOME|SPRT)\d{3}/i)
              if (fallbackMatch) {
                productId = fallbackMatch[0].toUpperCase()
                break
              }
            } catch (rawError) {
              console.error("Raw text fallback failed:", rawError)
            }
          }
        } else if (record.recordType === "url") {
          try {
            const url = new TextDecoder().decode(record.data)

            const urlMatch = url.match(/\/product\/([A-Z0-9]+)$/i)
            if (urlMatch) {
              const extractedId = urlMatch[1].toUpperCase()
              if (extractedId.match(/^(FOOD|ELEC|CLTH|BOOK|HOME|SPRT)\d{3}$/)) {
                productId = extractedId
                break
              }
            }
          } catch (decodeError) {
            console.error("Error decoding URL record:", decodeError)
          }
        }
      }

      if (!productId) {
        setNfcStatus("error")

        setTimeout(() => {
          if (isReading) {
            setNfcStatus("reading")
          }
        }, 3000)
        return
      }

      if (productId === lastReadRef.current) {
        return
      }

      lastReadRef.current = productId
      const product = await getProductById(productId)

      if (product) {
        if (isItemInCart(product.id)) {
          setDuplicateProductWithRef(product)
        } else {
          playBeepSound()
          setPendingProductWithRef(product)
        }
      } else {
        setNfcStatus("error")
        setTimeout(() => {
          if (isReading) {
            setNfcStatus("reading")
            lastReadRef.current = ""
          }
        }, 3000)
      }
    } catch (error) {
      console.error("❌ Error processing NFC tag:", error)
      setNfcStatus("error")
      setTimeout(() => {
        if (isReading) {
          setNfcStatus("reading")
          lastReadRef.current = ""
        }
      }, 3000)
    }
  }

  const handleConfirmAdd = () => {
    if (pendingProduct) {
      playSuccessSound()
      addItemOnce(pendingProduct)
      if (onProductAdded) {
        onProductAdded(pendingProduct)
      }
      setNfcStatus("success")
      setTimeout(() => {
        if (isReading) {
          setNfcStatus("reading")
        }
      }, 1500)
    }
    setPendingProductWithRef(null)
    lastReadRef.current = ""
  }

  const handleCancelAdd = () => {
    setPendingProductWithRef(null)
    lastReadRef.current = ""
  }

  const handleConfirmDuplicate = () => {
    setDuplicateProductWithRef(null)
    lastReadRef.current = ""
  }

  if (!isActive) {
    return (
      <motion.div
        className="nfc-container"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        style={{ pointerEvents: "none" }}
      >
        <div className="empty-state" style={{ minHeight: "400px" }}>
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faMobileAlt} />
          </div>
          <h3>NFC Reader Disabled</h3>
          <p>Click "Add More Products" to activate</p>
        </div>
      </motion.div>
    )
  }

  if (!isNFCSupported) {
    return (
      <motion.div
        className="nfc-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-state" style={{ minHeight: "400px", background: "rgba(245, 158, 11, 0.1)", padding: "2rem" }}>
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faMobileAlt} />
          </div>
          <h3>NFC Not Supported</h3>
          <p>Your device or browser doesn't support NFC functionality.</p>
          <div
            style={{
              fontSize: "0.875rem",
              marginTop: "1rem",
              textAlign: "left",
              maxWidth: "300px",
            }}
          >
            <p>
              <strong>NFC is supported on:</strong>
            </p>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.6" }}>
              <li>Android devices with Chrome browser</li>
              <li>Requires HTTPS connection</li>
              <li>NFC must be enabled in device settings</li>
            </ul>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              marginTop: "1rem",
              fontWeight: "600",
            }}
          >
            Please use QR code scanning instead.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="nfc-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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

      <div className="nfc-reader">
        <motion.div
          className={`nfc-animation ${nfcStatus}`}
          animate={{
            scale: nfcStatus === "reading" ? [1, 1.1, 1] : nfcStatus === "success" ? 1.2 : 1,
          }}
          transition={{
            duration: nfcStatus === "reading" ? 2 : 0.5,
            repeat: nfcStatus === "reading" ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          <div style={{ fontSize: "4rem", color: "white" }}>
            {nfcStatus === "reading" ? (
              <FontAwesomeIcon icon={faRss} />
            ) : nfcStatus === "success" ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : nfcStatus === "info" ? (
              <FontAwesomeIcon icon={faInfoCircle} />
            ) : nfcStatus === "error" ? (
              <FontAwesomeIcon icon={faTimesCircle} />
            ) : (
              <FontAwesomeIcon icon={faMobileAlt} />
            )}
          </div>
        </motion.div>

        <motion.div
          style={{
            textAlign: "center",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: "600",
            color:
              nfcStatus === "success"
                ? "var(--secondary-color)"
                : nfcStatus === "error"
                  ? "var(--danger-color)"
                  : nfcStatus === "info"
                    ? "var(--info-color)"
                    : "var(--text-primary)",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {nfcStatus === "reading"
            ? "🎯 Ready to read NFC tags - Tap a product tag"
            : nfcStatus === "success"
              ? "✅ Product added successfully!"
              : nfcStatus === "info"
                ? "ℹ️ Product is already in the cart. If you need, you can increase the quantity."
                : nfcStatus === "error"
                  ? "❌ Error reading tag"
                  : "Initializing NFC reader..."}
        </motion.div>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--text-secondary)",
            background: "rgba(255,255,255,0.95)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-xl)",
            fontSize: "0.75rem",
            textAlign: "center",
            border: "1px solid var(--border-light)",
            maxWidth: "90%",
            backdropFilter: "blur(10px)",
          }}
        >
          {isReading ? "Hold device near NFC tag" : "Starting NFC reader..."}
        </div>

        <div
          className={`badge ${isReading ? "secondary" : "warning"}`}
          style={{ position: "absolute", top: "1rem", right: "1rem" }}
        >
          📡 {isReading ? "ACTIVE" : "INACTIVE"}
        </div>

        {isNFCSupported && (
          <div
            className={`badge ${permissionGranted ? "secondary" : "warning"}`}
            style={{ position: "absolute", top: "1rem", left: "1rem" }}
          >
            🔐 {permissionGranted ? "ALLOWED" : "PENDING"}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default NFCReaderComponent
