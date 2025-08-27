'use client'

import {
	AlertTriangle,
	CircleDollarSign,
	CreditCard,
	DollarSign,
	Download,
	LucideIcon,
	Package,
	ShoppingCart,
	SquareStackIcon,
	TrendingUp,
	Users
} from 'lucide-react'
import React, { ReactNode, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
	getAverageTransactionValue,
	getDailySalesReport,
	getPaymentMethodBreakdown,
	getProductSalesReport,
	getTotalRevenue,
	getTotalTransactions,
} from '@/app/reports/reports'
import { formatCurrency } from '@/store/cart-store'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { products } from '../products/product-assets'
import { categories } from '../products/product-utils'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/lib/color";
import { useTransactionStore } from "@/store/transaction-store";
import { useProductStore } from "@/store/product-store";

export default function ReportsPage() {

	const { transactions: dataTransactions } = useTransactionStore()
	const { products: dataProducts } = useProductStore()

	const router = useRouter()
	const searchParams = useSearchParams()
	const selectedPeriod = searchParams.get("period") || "7"

	const dailySalesData = getDailySalesReport(Number.parseInt(selectedPeriod ?? '7'),
		dataTransactions)
	const productSalesData = getProductSalesReport(dataTransactions)
	const paymentMethodData = getPaymentMethodBreakdown(dataTransactions)

	const totalRevenue = getTotalRevenue(dataTransactions)
	const totalTransactions = getTotalTransactions(dataTransactions)
	const averageTransaction = getAverageTransactionValue(dataTransactions)

	const [ selectedTab, setSelectedTab ] = useState('overview')

// const [dataProducts, _setProductList] = useState<Product[]>(products)

	// Mock statistics for dashboard
	const stats = {
		todaySales: 2450000,
		totalProducts: products.length,
		lowStock: products().filter((p) => p.stock < 10).length,
		totalCustomers: 156,
	}

	// Calculate growth (mock data for demonstration)
	const revenueGrowth = 12.5
	const transactionGrowth = 8.3

	const handleExportReport = (type: string) => {
		// Mock export functionality
		alert(`Mengekspor laporan ${ type }... (Fitur akan diimplementasi)`)
	}

	const lowStockProducts = dataProducts.filter((product) => product.stock <= 10)

	const handleSelect = (value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set("period", value)
		router.push(`?${ params.toString() }`)
	}
	return (
		<>

			<div className='mb-6'>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold text-foreground mb-2'>
							Laporan Penjualan
						</h1>
						<p className='text-muted-foreground'>
							Analisis performa bisnis dan tren penjualan
						</p>
					</div>
					<div className='flex gap-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-40 justify-between">
									{ selectedPeriod } Hari Terakhir
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-40">
								<DropdownMenuItem onClick={ () => handleSelect("7") }>
									7 Hari Terakhir
								</DropdownMenuItem>
								<DropdownMenuItem onClick={ () => handleSelect("14") }>
									14 Hari Terakhir
								</DropdownMenuItem>
								<DropdownMenuItem onClick={ () => handleSelect("30") }>
									30 Hari Terakhir
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant='outline'
							onClick={ () => handleExportReport('PDF') }
						>
							<Download className='h-4 w-4 mr-2' />
							Export PDF
						</Button>
					</div>
				</div>
			</div>

			<Tabs
				value={ selectedTab }
				onValueChange={ setSelectedTab }
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='sales'>Penjualan</TabsTrigger>
					<TabsTrigger value='products'>Produk</TabsTrigger>
					<TabsTrigger value='transactions'>Transaksi</TabsTrigger>
				</TabsList>

				<TabsContent
					value='overview'
					className='space-y-6'
				>
					{/* Stats Cards */ }
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>

						<ReportCard
							title={ 'Total Nilai Stok' }
							icon={ CircleDollarSign }
							value={ formatCurrency(
								dataProducts.reduce(
									(total, product) =>
										total + product.price * product.stock,
									0,
								),
							) }
							description={ <>
								{/*<TrendingUp className='h-4 w-4 text-green-500 mr-1 inline' />*/ }
								{/*<span className='text-sm text-green-500'>+{ revenueGrowth }%</span>*/ }
							</>
							}
						/>

						<ReportCard
							title={ 'Penjualan Hari Ini' }
							value={ formatCurrency(stats.todaySales) }
							icon={ DollarSign }
							description={ <>
								<TrendingUp className='inline w-3 h-3 mr-1' />
								+12% dari kemarin
							</>
							}
						/>

						<ReportCard
							title={ 'Rata-rata Transaksi' }
							icon={ CreditCard }
							value={ formatCurrency(averageTransaction) }
							description={
								<>
									<span className='text-sm text-muted-foreground'>Per transaksi</span>
								</>
							}
						/>

						<ReportCard
							title={ 'Total Pendapatan' }
							icon={ DollarSign }
							value={ formatCurrency(totalRevenue) }
							description={ <>
								<TrendingUp className='h-4 w-4 text-green-500 mr-1 inline' />
								<span className='text-sm text-green-500'>+{ revenueGrowth }%</span>
							</>
							}
						/>

						<ReportCard
							title={ 'Stok Rendah' }
							icon={ AlertTriangle }
							value={ lowStockProducts.length }
							description={ <>
								{/*<TrendingUp className='h-4 w-4 text-green-500 mr-1 inline' />*/ }
								{/*<span className='text-sm text-green-500'>+{ revenueGrowth }%</span>*/ }
							</>
							}
						/>

						<ReportCard
							title={ 'Kategori' }
							icon={ SquareStackIcon }
							value={ categories.length }
							description={ <>
								{/*<TrendingUp className='h-4 w-4 text-green-500 mr-1 inline' />*/ }
								{/*<span className='text-sm text-green-500'>+{ revenueGrowth }%</span>*/ }
							</>
							}
						/>

						{/* Key Metrics */ }

						<ReportCard
							title={ 'Total Transaksi' }
							icon={ ShoppingCart }
							value={ totalTransactions }
							description={ <>
								<TrendingUp className='h-4 w-4 text-green-500 mr-1 inline' />
								<span className='text-sm text-green-500'>+{ transactionGrowth }%</span>
							</>
							}
						/>

						<ReportCard
							title={ 'Produk Terjual' }
							icon={ Package }
							value={ dataTransactions.reduce(
								(sum, t) =>
									sum +
									t.items.reduce(
										(itemSum, item) => itemSum + item.quantity,
										0,
									),
								0,
							) }
							description={
								<>
									<span className='text-sm text-muted-foreground'>Total unit</span>
								</>
							}
						/>

						{/* Statistics Cards */ }

						<ReportCard
							title={ 'Total Produk' }
							icon={ Package }
							value={ stats.totalProducts }
							description={ <>
								{ stats.lowStock } stok menipis
							</>
							}
						/>

						<ReportCard
							title={ 'Pelanggan' }
							icon={ Users }
							value={ stats.totalCustomers }
							description={ <>
								+8 pelanggan baru
							</>
							}
						/>

					</div>

					{/* Charts */ }
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						<Card>
							<CardHeader>
								<CardTitle>Tren Penjualan Harian</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer
									width='100%'
									height={ 300 }
								>
									<LineChart data={ dailySalesData }>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis
											dataKey='date'
											tickFormatter={ (date) =>
												new Date(date).toLocaleDateString('id-ID', {
													month: 'short',
													day: 'numeric',
												})
											}
										/>
										<YAxis
											tickFormatter={ (value) =>
												`${ ( value / 1000 ).toFixed(0) }K`
											}
										/>
										<Tooltip
											formatter={ (value: number) => [
												formatCurrency(value),
												'Penjualan',
											] }
											labelFormatter={ (date) =>
												new Date(date).toLocaleDateString('id-ID')
											}
										/>
										<Line
											type='monotone'
											dataKey='totalSales'
											stroke='#8884d8'
											strokeWidth={ 2 }
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Metode Pembayaran</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer
									width='100%'
									height={ 300 }
								>
									<PieChart>
										<Pie
											data={ paymentMethodData }
											cx='50%'
											cy='50%'
											labelLine={ false }
											label={ ({ method, percentage }) =>
												`${ method } (${ percentage.toFixed(1) }%)`
											}
											outerRadius={ 80 }
											fill='#8884d8'
											dataKey='count'
										>
											{ paymentMethodData.map((_, index) => (
												<Cell
													key={ `cell-${ index }` }
													fill={ COLORS[index % COLORS.length] }
												/>
											)) }
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent
					value='sales'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Laporan Penjualan Detail</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer
								width='100%'
								height={ 400 }
							>
								<BarChart data={ dailySalesData }>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='date'
										tickFormatter={ (date) =>
											new Date(date).toLocaleDateString('id-ID', {
												month: 'short',
												day: 'numeric',
											})
										}
									/>
									<YAxis
										tickFormatter={ (value) => `${ ( value / 1000 ).toFixed(0) }K` }
									/>
									<Tooltip
										formatter={ (value: number) => [
											formatCurrency(value),
											'Penjualan',
										] }
										labelFormatter={ (date) =>
											new Date(date).toLocaleDateString('id-ID')
										}
									/>
									<Bar
										dataKey='totalSales'
										fill='#8884d8'
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{ dailySalesData.slice(0, 7).map((day, index) => (
							<Card key={ day.date }>
								<CardContent className='p-4'>
									<div className='flex items-center justify-between mb-2'>
										<p className='text-sm font-medium'>
											{ new Date(day.date).toLocaleDateString('id-ID', {
												weekday: 'long',
												month: 'short',
												day: 'numeric',
											}) }
										</p>
										<Badge variant={ index === 0 ? 'default' : 'secondary' }>
											{ index === 0 ? 'Hari Ini' : `${ index + 1 } hari lalu` }
										</Badge>
									</div>
									<p className='text-2xl font-bold mb-1'>
										{ formatCurrency(day.totalSales) }
									</p>
									<p className='text-sm text-muted-foreground'>
										{ day.totalTransactions } transaksi
									</p>
									<p className='text-sm text-muted-foreground'>
										Rata-rata: { formatCurrency(day.averageTransaction) }
									</p>
								</CardContent>
							</Card>
						)) }
					</div>
				</TabsContent>

				<TabsContent
					value='products'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Produk Terlaris</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{ productSalesData.slice(0, 10).map((product, index) => (
									<div
										key={ product.productId }
										className='flex items-center justify-between p-4 border rounded-lg'
									>
										<div className='flex items-center gap-4'>
											<div
												className='flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold'
											>
												{ index + 1 }
											</div>
											<div>
												<p className='font-medium'>{ product.productName }</p>
												<p className='text-sm text-muted-foreground'>
													{ product.category }
												</p>
											</div>
										</div>
										<div className='text-right'>
											<p className='font-bold'>
												{ formatCurrency(product.revenue) }
											</p>
											<p className='text-sm text-muted-foreground'>
												{ product.quantitySold } unit terjual
											</p>
										</div>
									</div>
								)) }
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='transactions'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Riwayat Transaksi Terbaru</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{ dataTransactions.map((transaction) => (
									<div
										key={ transaction.id }
										className='flex items-center justify-between p-4 border rounded-lg'
									>
										<div>
											<p className='font-medium'>{ transaction.id }</p>
											<p className='text-sm text-muted-foreground'>
												{ new Date(transaction.date).toLocaleDateString(
													'id-ID',
												) }{ ' ' }
												• { transaction.items.length } item(s)
											</p>
											<p className='text-sm text-muted-foreground'>
												Kasir: { transaction.cashierName }
											</p>
										</div>
										<div className='text-right'>
											<p className='font-bold'>
												{ formatCurrency(transaction.total) }
											</p>
											<Badge
												variant={
													transaction.paymentMethod === 'cash'
														? 'default'
														: transaction.paymentMethod === 'card'
															? 'secondary'
															: 'outline'
												}
											>
												{ transaction.paymentMethod === 'cash'
													? 'Tunai'
													: transaction.paymentMethod === 'card'
														? 'Kartu'
														: 'Digital' }
											</Badge>
										</div>
									</div>
								)) }
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</>
	)
}

export function ReportCard(props: {
	icon: LucideIcon
	title: string,
	value: string | number,
	description: ReactNode,
}) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{ props.title }</CardTitle>
				<props.icon className={ 'h-8 w-8 text-primary' } />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{ props.value }</div>
				<p className='text-xs text-muted-foreground'>{ props.description }</p>
			</CardContent>
		</Card>
	);
}
