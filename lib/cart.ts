import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export function addToCart(cart: Cart, product: Product, quantity = 1): Cart {
  const existingItemIndex = cart.items.findIndex((item) => item.product.id === product.id)

  if (existingItemIndex >= 0) {
    // Update existing item
    const updatedItems = [...cart.items]
    updatedItems[existingItemIndex].quantity += quantity
    updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * product.price

    return {
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    }
  } else {
    // Add new item
    const newItem: CartItem = {
      product,
      quantity,
      subtotal: product.price * quantity,
    }

    const updatedItems = [...cart.items, newItem]

    return {
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    }
  }
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  const updatedItems = cart.items.filter((item) => item.product.id !== productId)

  return {
    items: updatedItems,
    total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export function updateQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId)
  }

  const updatedItems = cart.items.map((item) => {
    if (item.product.id === productId) {
      return {
        ...item,
        quantity,
        subtotal: item.product.price * quantity,
      }
    }
    return item
  })

  return {
    items: updatedItems,
    total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export function clearCart(): Cart {
  return {
    items: [],
    total: 0,
    itemCount: 0,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}
