import { products } from "./products"

export interface Transaction {
  id: string
  date: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: "cash" | "card" | "digital"
  cashierName: string
}

export interface SalesReport {
  date: string
  totalSales: number
  totalTransactions: number
  averageTransaction: number
}

export interface ProductSalesReport {
  productId: string
  productName: string
  category: string
  quantitySold: number
  revenue: number
}

// Mock transaction data for the last 30 days
export const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    date: "2024-01-15",
    items: [
      { productId: "1", productName: "Coca Cola 330ml", quantity: 2, price: 5000, total: 10000 },
      { productId: "3", productName: "Roti Tawar", quantity: 1, price: 12000, total: 12000 },
    ],
    subtotal: 22000,
    tax: 2200,
    total: 24200,
    paymentMethod: "cash",
    cashierName: "Admin",
  },
  {
    id: "TXN002",
    date: "2024-01-15",
    items: [
      { productId: "2", productName: "Indomie Goreng", quantity: 5, price: 3500, total: 17500 },
      { productId: "4", productName: "Susu UHT 1L", quantity: 2, price: 15000, total: 30000 },
    ],
    subtotal: 47500,
    tax: 4750,
    total: 52250,
    paymentMethod: "card",
    cashierName: "Admin",
  },
  {
    id: "TXN003",
    date: "2024-01-14",
    items: [{ productId: "5", productName: "Sabun Mandi", quantity: 3, price: 8000, total: 24000 }],
    subtotal: 24000,
    tax: 2400,
    total: 26400,
    paymentMethod: "digital",
    cashierName: "Admin",
  },
  {
    id: "TXN004",
    date: "2024-01-14",
    items: [
      { productId: "1", productName: "Coca Cola 330ml", quantity: 1, price: 5000, total: 5000 },
      { productId: "6", productName: "Shampoo 200ml", quantity: 1, price: 25000, total: 25000 },
      { productId: "7", productName: "Beras 5kg", quantity: 1, price: 65000, total: 65000 },
    ],
    subtotal: 95000,
    tax: 9500,
    total: 104500,
    paymentMethod: "cash",
    cashierName: "Admin",
  },
  {
    id: "TXN005",
    date: "2024-01-13",
    items: [
      { productId: "2", productName: "Indomie Goreng", quantity: 10, price: 3500, total: 35000 },
      { productId: "3", productName: "Roti Tawar", quantity: 2, price: 12000, total: 24000 },
    ],
    subtotal: 59000,
    tax: 5900,
    total: 64900,
    paymentMethod: "card",
    cashierName: "Admin",
  },
  // Add more mock transactions for the last 30 days
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `TXN${String(i + 6).padStart(3, "0")}`,
    date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [
      {
        productId: products[Math.floor(Math.random() * products.length)].id,
        productName: products[Math.floor(Math.random() * products.length)].name,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 50000) + 5000,
        total: 0,
      },
    ].map((item) => ({ ...item, total: item.quantity * item.price })),
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: ["cash", "card", "digital"][Math.floor(Math.random() * 3)] as "cash" | "card" | "digital",
    cashierName: "Admin",
  })).map((transaction) => {
    const subtotal = transaction.items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    return {
      ...transaction,
      subtotal,
      tax,
      total: subtotal + tax,
    }
  }),
]

export function getDailySalesReport(days = 7): SalesReport[] {
  const reports: SalesReport[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const dayTransactions = mockTransactions.filter((t) => t.date === date)

    const totalSales = dayTransactions.reduce((sum, t) => sum + t.total, 0)
    const totalTransactions = dayTransactions.length
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0

    reports.push({
      date,
      totalSales,
      totalTransactions,
      averageTransaction,
    })
  }

  return reports.reverse()
}

export function getProductSalesReport(): ProductSalesReport[] {
  const productSales: { [key: string]: ProductSalesReport } = {}

  mockTransactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      if (!productSales[item.productId]) {
        const product = products.find((p) => p.id === item.productId)
        productSales[item.productId] = {
          productId: item.productId,
          productName: item.productName,
          category: product?.category || "Unknown",
          quantitySold: 0,
          revenue: 0,
        }
      }

      productSales[item.productId].quantitySold += item.quantity
      productSales[item.productId].revenue += item.total
    })
  })

  return Object.values(productSales).sort((a, b) => b.revenue - a.revenue)
}

export function getTotalRevenue(): number {
  return mockTransactions.reduce((sum, t) => sum + t.total, 0)
}

export function getTotalTransactions(): number {
  return mockTransactions.length
}

export function getAverageTransactionValue(): number {
  const total = getTotalRevenue()
  const count = getTotalTransactions()
  return count > 0 ? total / count : 0
}

export function getPaymentMethodBreakdown(): { method: string; count: number; percentage: number }[] {
  const breakdown = mockTransactions.reduce(
    (acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )

  const total = mockTransactions.length

  return Object.entries(breakdown).map(([method, count]) => ({
    method: method === "cash" ? "Tunai" : method === "card" ? "Kartu" : "Digital",
    count,
    percentage: (count / total) * 100,
  }))
}
