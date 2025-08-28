import { Product } from '@/app/products/product-assets'
import { create } from 'zustand'
import { persist } from "zustand/middleware";


export interface CartItem {
	product: Product
	quantity: number
	subtotal: number
}


export interface CartStore {
	items: CartItem[]
	total: number
	itemCount: number
}

interface CartState {
	cart: CartStore
	addToCart: (product: Product, quantity?: number) => void
	removeFromCart: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void,
	getCart: (id: string) => CartItem | undefined

}


export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ( {

			cart: {
				items: [],
				total: 0,
				itemCount: 0,
			},
			getCart: (id) => {
				return get().cart.items.find((p) => p.product.id === id)
			},
			addToCart: (product, quantity = 1) =>
				set((state) => {
					const existingItemIndex = state.cart.items.findIndex(
						(item) => item.product.id === product.id
					)

					let updatedItems: CartItem[]

					if (existingItemIndex >= 0) {
						updatedItems = [ ...state.cart.items ]
						updatedItems[existingItemIndex].quantity += quantity
						updatedItems[existingItemIndex].subtotal =
							updatedItems[existingItemIndex].quantity * product.price
					} else {
						const newItem: CartItem = {
							product,
							quantity,
							subtotal: product.price * quantity,
						}
						updatedItems = [ ...state.cart.items, newItem ]
					}

					return {
						cart: {
							items: updatedItems,
							total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
							itemCount: updatedItems.reduce(
								(sum, item) => sum + item.quantity,
								0
							),
						},
					}
				}),

			removeFromCart: (productId) =>
				set((state) => {
					const updatedItems = state.cart.items.filter(
						(item) => item.product.id !== productId
					)

					return {
						cart: {
							items: updatedItems,
							total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
							itemCount: updatedItems.reduce(
								(sum, item) => sum + item.quantity,
								0
							),
						},
					}
				}),

			updateQuantity: (productId, quantity) =>
				set((state) => {
					if (quantity <= 0) {
						const updatedItems = state.cart.items.filter(
							(item) => item.product.id !== productId
						)
						return {
							cart: {
								items: updatedItems,
								total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
								itemCount: updatedItems.reduce(
									(sum, item) => sum + item.quantity,
									0
								),
							},
						}
					}

					const updatedItems = state.cart.items.map((item) =>
						item.product.id === productId
							? {
								...item,
								quantity,
								subtotal: item.product.price * quantity,
							}
							: item
					)

					return {
						cart: {
							items: updatedItems,
							total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
							itemCount: updatedItems.reduce(
								(sum, item) => sum + item.quantity,
								0
							),
						},
					}
				}),

			clearCart: () =>
				set({
					cart: {
						items: [],
						total: 0,
						itemCount: 0,
					},
				}),
		} ),
		{
			name: "cart-storage", // key in localStorage
		}
	)
)
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount)
}
