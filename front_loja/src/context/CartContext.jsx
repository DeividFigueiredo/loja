import React, { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product, variantId, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variantId)
      if (existing) {
        return prev.map(i =>
          i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, variantId, quantity }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((variantId) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }, [])

  const updateQuantity = useCallback((variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }
    setItems(prev =>
      prev.map(i => i.variantId === variantId ? { ...i, quantity } : i)
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = items.reduce((sum, i) => {
    const price = i.product?.variants?.find(v => v.id === i.variantId)?.prices?.[0]?.amount ?? 0
    return sum + (price / 100) * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      isOpen, setIsOpen,
      totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
