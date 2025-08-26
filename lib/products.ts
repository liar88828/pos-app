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

export const products: Product[] = [
  {
    id: "1",
    name: "Coca Cola 330ml",
    price: 5000,
    category: "Minuman",
    stock: 50,
    barcode: "8999999001234",
    image: "/classic-coca-cola.png",
    description: "Minuman berkarbonasi rasa cola segar",
  },
  {
    id: "2",
    name: "Indomie Goreng",
    price: 3500,
    category: "Makanan",
    stock: 100,
    barcode: "8999999005678",
    image: "/instant-noodles-package.png",
    description: "Mi instan goreng rasa original",
  },
  {
    id: "3",
    name: "Roti Tawar",
    price: 8000,
    category: "Makanan",
    stock: 25,
    barcode: "8999999009012",
    image: "/white-bread-loaf.png",
    description: "Roti tawar putih segar untuk sarapan",
  },
  {
    id: "4",
    name: "Susu Ultra 1L",
    price: 15000,
    category: "Minuman",
    stock: 30,
    barcode: "8999999003456",
    image: "/milk-carton-1-liter.png",
    description: "Susu segar ultra pasteurisasi",
  },
  {
    id: "5",
    name: "Sabun Mandi",
    price: 12000,
    category: "Perawatan",
    stock: 40,
    barcode: "8999999007890",
    image: "/soap-bar.png",
    description: "Sabun mandi dengan aroma segar",
  },
  {
    id: "6",
    name: "Shampoo 200ml",
    price: 18000,
    category: "Perawatan",
    stock: 35,
    barcode: "8999999002345",
    image: "/shampoo-bottle.png",
    description: "Shampoo untuk rambut sehat dan berkilau",
  },
  {
    id: "7",
    name: "Beras 5kg",
    price: 65000,
    category: "Makanan",
    stock: 20,
    barcode: "8999999004567",
    image: "/rice-bag-5kg.png",
    description: "Beras premium kualitas terbaik",
  },
  {
    id: "8",
    name: "Minyak Goreng 1L",
    price: 22000,
    category: "Makanan",
    stock: 45,
    barcode: "8999999006789",
    image: "/cooking-oil-bottle.png",
    description: "Minyak goreng untuk memasak sehari-hari",
  },
]

export const categories = ["Semua", "Makanan", "Minuman", "Perawatan"]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "Semua") return products
  return products.filter((product) => product.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) => product.name.toLowerCase().includes(lowercaseQuery) || product.barcode.includes(query),
  )
}
