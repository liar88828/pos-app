import { Transaction } from "@/store/transaction-store";
import * as XLSX from "xlsx";
import { formatCurrency, formatDate } from "@/store/cart-store";
import { ProductSalesReport } from "@/app/reports/reports-utils";


export function handleExportExcel(productSalesData: ProductSalesReport[]) {
	// Convert data rows
	const data = productSalesData.map(item => ( {
		"Product ID": item.productId,
		"Product Name": item.productName,
		"Product Category": item.productCategory,
		"Quantity Sold": item.quantitySold,
		"Revenue": formatCurrency(item.revenue),
	} ))

	// Create worksheet without headers
	// @ts-error
	const ws = XLSX.utils.json_to_sheet(data, { origin: "A2", skipHeader: true })

	// === Column Headers (Row 1) ===
	const headers = [
		"Product ID",
		"Product Name",
		"Product Category",
		"Quantity Sold",
		"Revenue",
	]

	headers.forEach((header, i) => {
		const cellRef = XLSX.utils.encode_cell({ r: 0, c: i })
		ws[cellRef] = { v: header, s: { font: { bold: true } } }
	})

	headers.forEach((header, i) => {
		const cellRef = XLSX.utils.encode_cell({ r: 0, c: i })
		ws[cellRef] = { v: header, s: { font: { bold: true } } }
	})

	// === Column Widths ===
	ws["!cols"] = [
		{ wch: 15 }, // Product ID
		{ wch: 30 }, // Product Name
		{ wch: 20 }, // Product Category
		{ wch: 15 }, // Quantity Sold
		{ wch: 20 }, // Revenue
	]

	// Create workbook
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Product Sales Report")

	// Save file
	XLSX.writeFile(wb, `Product_Sales_Report_${ formatDate(new Date()) }.xlsx`)
}

export function handleExportExcelTransactions(transactions: Transaction[]) {
	// Convert to worksheet without headers
	const data = transactions.flatMap(tx =>
		tx.items.map((item, idx) => {
			const isLastItem = idx === tx.items.length - 1
			return {
				"Transaction ID": idx === 0 ? tx.id : "", // only first row
				"Date": idx === 0 ? new Date(tx.date).toLocaleDateString("id-ID") : "",
				"Cashier Name": idx === 0 ? tx.cashierName : "",
				"Payment Method": idx === 0 ? tx.paymentMethod : "",
				"Product ID": item.productId,
				"Product Name": item.productName,
				"Product Category": item.productCategory,
				"Quantity": item.quantity,
				"Product Price": formatCurrency(item.price),
				"Total": formatCurrency(item.total),
				"Tax": isLastItem ? formatCurrency(tx.tax) : '',
				"Transaction Total": isLastItem ? formatCurrency(tx.total) : "", // show only on last row
			}
		})
	)

	// @ts-error
	const ws = XLSX.utils.json_to_sheet(data, { origin: "A2", skipHeader: true })

	// === Column Headers (Row 1) ===
	const headers = [
		"Transaction ID",
		"Date",
		"Cashier Name",
		"Payment Method",
		"Product ID",
		"Product Name",
		"Product Category",
		"Quantity",
		"Price",
		"Total",
		"Tax",
		"Transaction Total",
	]

	headers.forEach((header, i) => {
		const cellRef = XLSX.utils.encode_cell({ r: 0, c: i })
		ws[cellRef] = { v: header, s: { font: { bold: true } } }
	})

	// === Column Widths ===
	ws["!cols"] = [
		{ wch: 15 }, // Transaction ID
		{ wch: 12 }, // Date
		{ wch: 20 }, // Cashier
		{ wch: 15 }, // Payment Method
		{ wch: 12 }, // Product ID
		{ wch: 30 }, // Product Name
		{ wch: 20 }, // Product Category
		{ wch: 10 }, // Quantity
		{ wch: 15 }, // Price
		{ wch: 15 }, // Total
		{ wch: 10 }, // Tax
		{ wch: 20 }, // Transaction Total
	]

	// Create workbook
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Transactions")

	// Save file
	XLSX.writeFile(wb, `Transactions_Report_${ formatDate(new Date()) }.xlsx`)
}
