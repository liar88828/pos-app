import { Transaction } from "@/store/transaction-store";


export interface SalesReport {
	date: string
	totalSales: number
	totalTransactions: number
	averageTransaction: number
}


export interface ProductSalesReport {
	productId: string
	productName: string
	productCategory: string
	quantitySold: number
	revenue: number
}


export function getDailySalesReport(
	days = 7,
	transactions: Transaction[]
): SalesReport[] {
	const reports: SalesReport[] = []

	for (let i = 0; i < days; i++) {
		const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
		const dayTransactions = transactions.filter(
			(t) => new Date(t.date).toISOString().split("T")[0] === date
		)

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

export function getPaymentMethodBreakdown(transactions: Transaction[]): {
	method: string;
	count: number;
	percentage: number
}[] {

	const breakdown = transactions.reduce(
		(acc, t) => {
			acc[t.paymentMethod] = ( acc[t.paymentMethod] || 0 ) + 1
			return acc
		},
		{} as { [key: string]: number },
	)

	const total = transactions.length

	return Object.entries(breakdown).map(([ method, count ]) => ( {
		method: method === "cash" ? "Tunai" : method === "card" ? "Kartu" : "Digital",
		count,
		percentage: ( count / total ) * 100,
	} ))
}

export function getProductSalesReport(transactions: Transaction[]): ProductSalesReport[] {
	const productSales = new Map<string, ProductSalesReport>()

	for (const { items } of transactions) {
		for (const { productId, productName, productCategory, quantity, total } of items) {
			const existing = productSales.get(productId)
			if (existing) {
				existing.quantitySold += quantity
				existing.revenue += total
			} else {
				productSales.set(productId, {
					productId,
					productName,
					productCategory,
					quantitySold: quantity,
					revenue: total,
				})
			}
		}
	}

	return [ ...productSales.values() ].sort((a, b) => b.revenue - a.revenue)
}

export function getTransactionStats(transactions: Transaction[]) {
	let totalRevenue = 0
	let totalTransactions = 0
	let revenueGrowth = 0
	let transactionGrowth = 0
	const dailyData = new Map<string, { revenue: number; count: number }>()

	for (const tx of transactions) {
		totalRevenue += tx.total
		totalTransactions += 1

		const dateKey = new Date(tx.date).toISOString().split("T")[0]
		const day = dailyData.get(dateKey) || { revenue: 0, count: 0 }
		day.revenue += tx.total
		day.count += 1
		dailyData.set(dateKey, day)
	}

	const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

	// Sort dates (latest first)
	const sortedDates = [ ...dailyData.keys() ].sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime()
	)

	if (sortedDates.length >= 2) {
		const today = dailyData.get(sortedDates[0])!
		const yesterday = dailyData.get(sortedDates[1])!

		revenueGrowth =
			yesterday.revenue === 0
				? 100
				: ( ( today.revenue - yesterday.revenue ) / yesterday.revenue ) * 100

		transactionGrowth =
			yesterday.count === 0
				? 100
				: ( ( today.count - yesterday.count ) / yesterday.count ) * 100
	}

	return {
		totalRevenue,
		totalTransactions,
		averageTransaction,
		revenueGrowth,
		transactionGrowth,
	}
}
