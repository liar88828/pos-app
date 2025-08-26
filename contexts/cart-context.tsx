"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product } from "@/lib/products"
import type { Cart } from "@/lib/cart"
import { addToCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cart"

interface CartContextType {
  cart: Cart
  addProduct: (product: Product, quantity?: number) => void
  removeProduct: (productId: string) => void
  updateProductQuantity: (productId: string, quantity: number) => void
  clearAllItems: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_PRODUCT"; product: Product; quantity?: number }
  | { type: "REMOVE_PRODUCT"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_PRODUCT":
      return addToCart(state, action.product, action.quantity)
    case "REMOVE_PRODUCT":
      return removeFromCart(state, action.productId)
    case "UPDATE_QUANTITY":
      return updateQuantity(state, action.productId, action.quantity)
    case "CLEAR_CART":
      return clearCart()
    default:
      return state
  }
}

const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  const addProduct = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_PRODUCT", product, quantity })
  }

  const removeProduct = (productId: string) => {
    dispatch({ type: "REMOVE_PRODUCT", productId })
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const clearAllItems = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        updateProductQuantity,
        clearAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
