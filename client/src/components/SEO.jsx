import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Lightweight SEO component to update page metadata dynamically.
 * usage: <SEO title="My Page" description="Description" />
 */
const SEO = ({ title, description }) => {
  const location = useLocation()

  useEffect(() => {
    if (title) {
      document.title = `${title} | Scan Tap Pay`
    } else {
      document.title = "Scan Tap Pay - Smart Payment Solutions"
    }

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute("content", description)
      }
    }
  }, [title, description, location])

  return null
}

export default SEO
