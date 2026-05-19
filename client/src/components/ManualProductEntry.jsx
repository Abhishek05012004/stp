import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext.jsx"
import { getAllProducts, getProductById, validateStockForCart } from "../utils/productData.js"
import { playSuccessSound } from "../utils/soundUtils.js"
import { SmartImage } from "../utils/imageUtils.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFilePen,
  faChevronUp,
  faChevronDown,
  faCartPlus,
  faBasketShopping,
  faArrowsRotate,
  faUtensils,
  faLaptop,
  faShirt,
  faCircleCheck,
  faCircleXmark,
  faCheck,
  faTimes,
  faPlus,
  faBoxOpen,
  faMagnifyingGlass,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons"

const ManualProductEntry = ({ onProductAdded }) => {
  const [productId, setProductId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState({})
  const [showProductList, setShowProductList] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [recentToasts, setRecentToasts] = useState(new Set())
  const { addItemOnce, isItemInCart } = useCart()

  useEffect(() => {
    loadAllProducts()
  }, [])

  const showToastOnce = (message, type = "success") => {
    if (recentToasts.has(message)) {
    }

    setRecentToasts((prev) => new Set([...prev, message]))

    if (type === "success") {
    } else if (type === "error") {
    } else {
    }

    setTimeout(() => {
      setRecentToasts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(message)
        return newSet
      })
    }, 3000)
  }

  const loadAllProducts = async () => {
    try {
      const products = await getAllProducts()
      setAllProducts(products)

      if (Object.keys(products).length === 0) {
        showToastOnce("No products found.", "error")
      } else {
        showToastOnce(`Loaded ${Object.keys(products).length} products successfully!`)
      }
    } catch (error) {
      console.error("❌ Error loading products:", error)
      setAllProducts({})
      showToastOnce("Failed to load products. Please try again.", "error")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!productId.trim()) {
      return
    }
    await addProductToCart(productId.trim().toUpperCase())
  }

  const addProductToCart = async (id) => {
    setIsLoading(true)

    try {
      // Use locally loaded product to make it instant!
      let product = allProducts[id]
      
      if (!product) {
        product = await getProductById(id)
      }

      if (!product) {
        showToastOnce(`Product ${id} not found`, "error")
        setIsLoading(false)
        return
      }

      if (isItemInCart(product.id)) {
        showToastOnce(`${product.name} is already in your cart!`, "error")
        setIsLoading(false)
        return
      }

      if (product.stock === 0) {
        showToastOnce(`Sorry! ${product.name} is out of stock`, "error")
        setIsLoading(false)
        return
      }

      addItemOnce(product)
      playSuccessSound()
      showToastOnce(`✅ ${product.name} added to cart!`)

      if (onProductAdded) {
        onProductAdded(product)
      }
      setProductId("")
    } catch (error) {
      console.error("Error fetching product:", error)
      showToastOnce("Failed to add product. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredProducts = () => {
    const products = Object.values(allProducts)
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }

  const getCategories = () => {
    const categories = [
      ...new Set(
        Object.values(allProducts)
          .map((p) => p.category)
          .filter(Boolean),
      ),
    ]
    return categories.sort()
  }

  const filteredProducts = getFilteredProducts()
  const categories = getCategories()

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            margin: "0",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FontAwesomeIcon icon={faFilePen} /> Manual Product Entry
        </h3>
        <button
          onClick={() => {
            setShowProductList(!showProductList)
          }}
          className="nav-btn info"
          style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
        >
          {showProductList ? (
            <>
              <FontAwesomeIcon icon={faChevronUp} style={{ marginRight: "0.5rem" }} />
              <span className="hide-on-mobile">Hide Products</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} style={{ marginRight: "0.5rem" }} />
              <span className="hide-on-mobile">Show Products</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div className="form-group">
          <label htmlFor="productId" className="form-label">
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value.toUpperCase())}
            placeholder="Enter Product ID (e.g., FOOD001)"
            disabled={isLoading}
            className="form-input"
            style={{ textTransform: "uppercase" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !productId.trim()}
          className="nav-btn primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Adding Product...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCartPlus} style={{ marginRight: "0.5rem" }} />
              Add to Cart
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {showProductList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  margin: "0",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faBasketShopping} /> Available Products ({filteredProducts.length})
              </h4>
              <button
                onClick={() => {
                  loadAllProducts()
                }}
                className="nav-btn secondary"
                style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} style={{ marginRight: "0.5rem" }} />
                Refresh
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ flex: "1", minWidth: "min(100%, 200px)" }}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
                style={{ minWidth: "min(100%, 150px)" }}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 250px), 1fr))",
                gap: "1.5rem",
                maxHeight: "650px",
                overflowY: "auto",
                padding: "1rem",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)",
                alignItems: "stretch",
              }}
            >
              <AnimatePresence>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="card product-card"
                      style={{
                        padding: "1.5rem",
                        position: "relative",
                        overflow: "hidden",
                        border: "1px solid var(--border-light)",
                        background: "var(--bg-card)",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 0.95 }}
                      transition={{ duration: 0.1, delay: index * 0 }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="product-card-overlay"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(14, 165, 233, 0.03))",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                          {product.category && (
                            <div className="badge info">
                              {product.category}
                            </div>
                          )}
                          <div className="badge primary" style={{ marginLeft: "auto" }}>
                            {product.id}
                          </div>
                        </div>
                        <div
                          className="product-card-img-container"
                          style={{
                            overflow: "hidden",
                            borderRadius: "var(--radius-lg)",
                            marginBottom: "1rem",
                          }}
                        >
                          <SmartImage
                            src={product.image}
                            alt={product.name}
                            className="product-card-img"
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "var(--radius-lg)",
                              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            fallbackSrc="/placeholder.svg?height=120&width=300&text=Product+Image"
                          />
                        </div>

                        <h5
                          style={{
                            margin: "0 0 0.75rem 0",
                            color: "var(--text-primary)",
                            fontSize: "1.125rem",
                            fontWeight: "600",
                          }}
                        >
                          {product.name}
                        </h5>

                        <p
                          style={{
                            margin: "0 0 1rem 0",
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                            flexGrow: 1,
                          }}
                        >
                          {product.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1rem",
                            flexWrap: "nowrap",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--secondary-color)",
                              fontSize: "1.25rem",
                            }}
                          >
                            ₹{product.price.toFixed(2)}
                          </span>
                          {product.stock !== undefined && (
                            <span
                              className={`badge ${product.stock === 0 ? "danger" : product.stock <= 5 ? "warning" : "secondary"}`}
                              style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                            >
                              {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Low Stock: ${product.stock}` : `Stock: ${product.stock}`}
                            </span>
                          )}
                        </div>

                        <button
                          className={`nav-btn ${isItemInCart(product.id) ? "accent" : product.stock === 0 ? "disabled" : "primary"}`}
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            opacity: product.stock === 0 ? 0.5 : 1,
                            cursor: product.stock === 0 ? "not-allowed" : "pointer",
                            marginTop: "1rem",
                          }}
                          onClick={(e) => {
                            if (product.stock === 0) {
                              showToastOnce(`Sorry! ${product.name} is out of stock`, "error")
                              return
                            }
                            addProductToCart(product.id)
                          }}
                          disabled={product.stock === 0}
                        >
                          {isItemInCart(product.id) ? (
                            <>
                              <FontAwesomeIcon icon={faCircleCheck} style={{ marginRight: "0.5rem" }} /> In Cart
                            </>
                          ) : product.stock === 0 ? (
                            <>
                              <FontAwesomeIcon icon={faCircleXmark} style={{ marginRight: "0.5rem" }} /> Out of Stock
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faCartPlus} style={{ marginRight: "0.5rem" }} /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    {Object.keys(allProducts).length === 0 ? (
                      <>
                        <div className="empty-state-icon">
                          <FontAwesomeIcon icon={faBoxOpen} />
                        </div>
                        <h3>Loading Products...</h3>
                        <div className="loading-spinner" style={{ margin: "1rem auto" }}></div>
                      </>
                    ) : (
                      <>
                        <div className="empty-state-icon">
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <h3>No Products Found</h3>
                        <p>Try adjusting your search or category filter.</p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
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
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          <FontAwesomeIcon icon={faBoltLightning} style={{ marginRight: "0.5rem", color: "#fbbf24" }} />
          Quick Add - Popular Items
        </h4>

        <div style={{ display: "grid", gap: "1rem" }}>
          {[
            {
              title: (
                <>
                  <FontAwesomeIcon icon={faUtensils} style={{ marginRight: "0.5rem" }} />
                  Food
                </>
              ),
              ids: ["FOOD001", "FOOD002", "FOOD003", "FOOD004", "FOOD005"],
            },
            {
              title: (
                <>
                  <FontAwesomeIcon icon={faLaptop} style={{ marginRight: "0.5rem" }} />
                  Electronics
                </>
              ),
              ids: ["ELEC001", "ELEC002", "ELEC003", "ELEC004", "ELEC005"],
            },
            {
              title: (
                <>
                  <FontAwesomeIcon icon={faShirt} style={{ marginRight: "0.5rem" }} />
                  Clothes
                </>
              ),
              ids: ["CLTH001", "CLTH002", "CLTH003", "CLTH004", "CLTH005"],
            },
          ].map((category, idx) => (
            <div key={idx}>
              <h5
                style={{
                  margin: "0 0 0.75rem 0",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                {category.title}
              </h5>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {category.ids.map((id) => {
                  const product = allProducts[id]
                  const isOutOfStock = product && product.stock === 0
                  return (
                    <motion.button
                      key={id}
                      className={`badge ${isItemInCart(id) ? "warning" : isOutOfStock ? "danger" : "primary"}`}
                      style={{
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                        border: "none",
                        transition: "var(--transition)",
                        opacity: isOutOfStock ? 0.6 : 1,
                      }}
                      onClick={() => {
                        if (isOutOfStock) {
                          showToastOnce(`Sorry! ${product.name} is out of stock`, "error")
                          return
                        }
                        addProductToCart(id)
                      }}
                      whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
                      whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
                      disabled={isOutOfStock}
                    >
                      {isItemInCart(id) ? (
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.3rem" }} />
                      ) : isOutOfStock ? (
                        <FontAwesomeIcon icon={faTimes} style={{ marginRight: "0.3rem" }} />
                      ) : (
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: "0.3rem" }} />
                      )}{" "}
                      {id}
                      {product && ` - ₹${product.price}`}
                      {isOutOfStock && " (Out of Stock)"}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            margin: "1rem 0 0 0",
            textAlign: "center",
          }}
        >
          💡 Click any Product ID to add instantly • Perfect for testing NFC tags!
        </p>
      </div>
    </motion.div>
  )
}

export default ManualProductEntry
