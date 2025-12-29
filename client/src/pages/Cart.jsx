"use client"

import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../utils/CartContext.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faShoppingCart,
  faTrashCan,
  faCreditCard,
  faFloppyDisk,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons"
import toast from "../utils/toastUtils"
import { useState, useEffect } from "react"

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [blinkingId, setBlinkingId] = useState(null)

  useEffect(() => {
    const handleBlink = (e) => {
      setBlinkingId(e.detail.id)
      setTimeout(() => setBlinkingId(null), 1000)
    }
    window.addEventListener("out-of-stock-blink", handleBlink)
    return () => window.removeEventListener("out-of-stock-blink", handleBlink)
  }, [])

  const handleIncreaseQuantity = (item) => {
    const maxStock = item.stock || 999
    if (item.quantity >= maxStock) {
      toast.error(`Only ${maxStock} units of ${item.name} available in stock!`)
      // trigger custom event to blink the button
      const event = new CustomEvent("out-of-stock-blink", { detail: { id: item.id } })
      window.dispatchEvent(event)
      return
    }
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/payment")
    }
  }

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart? This action cannot be undone.")) {
      clearCart()
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="header">
          <h1>Shopping Cart</h1>
        </div>

        <div className="nav-buttons">
          <Link to="/" className="nav-btn secondary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </Link>
          <Link to="/scanner" className="nav-btn">
            <FontAwesomeIcon icon={faShoppingCart} /> Start Shopping
          </Link>
        </div>

        <div className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Scan some QR codes to add products!</p>
            <Link to="/scanner" className="nav-btn" style={{ marginTop: "1rem" }}>
              Start Scanning Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Shopping Cart</h1>
        <p>
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="nav-buttons">
        <Link to="/" className="nav-btn secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
        <Link to="/scanner" className="nav-btn">
          <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
        </Link>
        <button onClick={handleClearCart} className="nav-btn danger">
          <FontAwesomeIcon icon={faTrashCan} /> Clear Cart
        </button>
      </div>

      <div className="cart-container">
        {items.map((item) => {
          const isAtStockLimit = item.stock !== undefined && item.quantity >= item.stock

          return (
            <div key={item.id} className="cart-item">
              <img src={item.image || "/placeholder.svg"} alt={item.name} />

              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₹{item.price.toFixed(2)} each</div>
                {isAtStockLimit && (
                  <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: "bold", marginTop: "2px" }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Out of Stock (Limit Reached)
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <div className="quantity-controls">
                  <button
                    className={`quantity-btn ${item.quantity <= 1 ? "disabled" : ""}`}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span
                    style={{
                      margin: "0 1rem",
                      fontWeight: "bold",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    className={`quantity-btn ${isAtStockLimit ? "out-of-stock" : ""} ${blinkingId === item.id ? "blink-danger" : ""}`}
                    onClick={() => handleIncreaseQuantity(item)}
                    title={isAtStockLimit ? "Out of Stock" : "Increase Quantity"}
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                <FontAwesomeIcon icon={faTrashCan} /> Remove
              </button>
            </div>
          )
        })}

        <div className="cart-total">
          <div style={{ marginBottom: "1rem", fontSize: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0.5rem 0",
              }}
            >
              <span>Subtotal:</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0.5rem 0",
              }}
            >
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr style={{ margin: "1rem 0" }} />
          </div>

          <div className="total-amount">Total: ₹{getTotal().toFixed(2)}</div>

          <button className="nav-btn" style={{ marginTop: "1rem", fontSize: "1.2rem" }} onClick={handleCheckout}>
            <FontAwesomeIcon icon={faCreditCard} /> Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Persistence Info */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#0066cc",
          textAlign: "center",
        }}
      >
        <FontAwesomeIcon icon={faFloppyDisk} /> Your cart is automatically saved and will persist even if you refresh
        the browser!
      </div>
    </div>
  )
}

export default Cart
