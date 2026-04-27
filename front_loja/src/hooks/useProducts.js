import { useState, useEffect } from 'react'

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000'

export function useProducts(limit = 24) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`${GATEWAY}/api/products?limit=${limit}`, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data.products ?? []
          setProducts(list)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [limit])

  return { products, loading, error }
}
