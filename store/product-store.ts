import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import { FormDataProduct } from "@/store/productForm-store";


export interface Product {
	id: string
	name: string
	price: number
	category: string
	stock: number
	barcode: string
	image: string
	description: string
}


interface ProductState {
	products: Product[]
	addProduct: (product: Omit<Product, "id">) => void
	updateProduct: (id: string, updated: Partial<Product>) => void
	deleteProduct: (id: string) => void
	getProduct: (id: string) => Product | undefined
}


export const useProductStore = create<ProductState>()(
	persist(
		(set, get) => ( {
			products: [],

			addProduct: (product) => {
				const newProduct: Product = {
					id: nanoid(),
					...product,
				}
				set((state) => ( {
					products: [ ...state.products, newProduct ],
				} ))
			},

			updateProduct: (id, updated) =>
				set((state) => ( {
					products: state.products.map((p) =>
						p.id === id ? { ...p, ...updated } : p
					),
				} )),

			deleteProduct: (id) =>
				set((state) => ( {
					products: state.products.filter((p) => p.id !== id),
				} )),

			getProduct: (id) => {
				return get().products.find((p) => p.id === id)
			},
		} ),
		{
			name: "products-storage", // key in localStorage
		}
	)
)

export const productSanitizer = (formData: FormDataProduct): Omit<Product, "id"> => {
	return {
		name: formData.name,
		price: Number.parseFloat(formData.price),
		category: formData.category,
		stock: Number.parseInt(formData.stock) || 0,
		description: formData.description || '',
		barcode: formData.barcode || `${ Date.now() }`,
		image: formData.image,
	}

}
