import { Product } from "@/store/product-store";


export function getProductById(id: string, products: Product[]): Product | undefined {
	return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string, products: Product[]): Product[] {
	if (category === 'Semua') return products
	return products.filter((product) => product.category === category)
}

export function searchProducts(query: string, products: Product[]): Product[] {
	const lowercaseQuery = query.toLowerCase()
	return products.filter(
		(product) =>
			product.name.toLowerCase().includes(lowercaseQuery) ||
			product.barcode.includes(query),
	)
}

export function getLowStockProduct(products: Product[], lowStock: number) {
	return products.filter((product) => product.stock <= lowStock).length
}
