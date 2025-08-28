'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
	Banknote,
	Calculator,
	CreditCard,
	Minus,
	Plus,
	PlusIcon,
	Receipt,
	Search,
	ShoppingCart,
	Trash2,
	XIcon,
} from 'lucide-react'

import { formatCurrency, useCartStore } from '@/store/cart-store'
import { getProductById, getProductsByCategory, searchProducts, } from '../products/product-utils'
import { Product } from "@/app/products/product-assets";
import { useTransactionStore } from "@/store/transaction-store";
import { useProductStore } from "@/store/product-store";
import { useSettingStore } from "@/store/setting-store";

export default function TransactionPage(
	// { products }: { products: Product[] }
) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const today = new Date().toISOString().slice(0, 16)

	const { categoryProduct } = useSettingStore()
	const { products, updateProduct } = useProductStore()
	const { tax, cashierName, lowStock } = useSettingStore()
	const { cart, addToCart, removeFromCart, updateQuantity, clearCart, } = useCartStore()
	const { addTransaction } = useTransactionStore()

	const [ searchQuery, setSearchQuery ] = useState('')
	const [ searchResults, setSearchResults ] = useState(products)
	const [ paymentMethod, setPaymentMethod ] = useState('')
	const [ cashAmount, setCashAmount ] = useState('')
	const [ isCheckoutOpen, setIsCheckoutOpen ] = useState(false)
	const [ customerNotes, setCustomerNotes ] = useState('')
	const [ selectedCategory, setSelectedCategory ] = useState('Semua')
	const [ date, setDate ] = useState<string>(today)

	// Handle product from URL params (from product detail page)
	useEffect(() => {
		const productId = searchParams.get('productId')
		const quantity = searchParams.get('quantity')

		if (productId) {
			const product = getProductById(productId, products)
			if (product) {
				addToCart(product, quantity ? Number.parseInt(quantity) : 1)
			}
		}
	}, [ searchParams, addToCart, products ])

	// Handle search
	useEffect(() => {
		if (searchQuery.trim() || selectedCategory) {
			setSearchResults(
				searchQuery
					? searchProducts(searchQuery, products)
					: getProductsByCategory(selectedCategory, products),
			)
		} else {
			setSearchResults(products)
		}
	}, [ searchQuery, selectedCategory, products ])

	const handleAddToCart = (product: Product) => {
		addToCart(product, 1)
	}

	const handleQuantityChange = (productId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			// removeFromCart(productId)
		} else {
			updateQuantity(productId, newQuantity)
		}
	}

	const calculateChange = () => {
		const cash = Number.parseFloat(cashAmount) || 0
		return cash - cart.total
	}

	const handleCheckout = () => {
		// Simulate transaction processing

		alert(
			`Transaksi berhasil!
			\nTotal: ${ formatCurrency(cart.total,) }
			\nMetode: ${ paymentMethod }
			\n${ paymentMethod === 'cash'
				? `Kembalian: ${ formatCurrency(calculateChange()) }`
				: ''
			}`,
		)
		const subTotal = cart.items.reduce((a, b) => a + b.subtotal, 0)

		addTransaction({
			items: cart.items.map(i => {
				updateProduct(i.product.id, {
					stock: i.product.stock - i.quantity,
				})
				return {
					total: i.subtotal,
					quantity: i.quantity,
					price: i.product.price,
					productId: i.product.id,
					productName: i.product.name
				}
			}),
			date: new Date(date),
			cashierName: cashierName,
			paymentMethod: paymentMethod,
			subtotal: subTotal,
			tax: tax,
			total: cart.total,
			actualPrice: Number(cashAmount)
		})

		clearCart()
		setIsCheckoutOpen(false)
		setPaymentMethod('')
		setCashAmount('')
		setCustomerNotes('')
	}

	const isCheckoutValid = () => {
		if (cart.items.length === 0) return false
		if (!paymentMethod) return false
		if (paymentMethod === 'cash') {
			const cash = Number.parseFloat(cashAmount) || 0
			return cash >= cart.total
		}
		return true
	}

	return (
		<>
			{/* Grid layout for product search & selection and shopping cart */ }
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Product Search & Selection */ }
				<div className='lg:col-span-2 space-y-6'>
					{/* Search Bar */ }
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Search className='w-5 h-5' />
								Cari Produk
							</CardTitle>
							<div className='space-y-4'>
								<Input
									placeholder='Ketik nama produk...'
									value={ searchQuery }
									onChange={ (e) => setSearchQuery(e.target.value) }
								/>

								<div className='flex gap-2 flex-wrap'>
									{ categoryProduct.map((category) => (
										<Button
											key={ category }
											variant={
												selectedCategory === category ? 'default' : 'outline'
											}
											size='sm'
											onClick={ () => {
												setSelectedCategory(category)
												setSearchQuery('')
											} }
										>
											{ category }
										</Button>
									)) }
								</div>
							</div>
						</CardHeader>
					</Card>

					{/* Product Grid */ }
					<Card>
						<CardHeader>
							<CardTitle>Pilih Produk</CardTitle>
							<CardDescription>
								Klik produk untuk menambah ke keranjang
							</CardDescription>
						</CardHeader>
						<CardContent className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:px-6 px-3'>
							{ searchResults.map((product) => (
								<Card
									key={ product.id }
									className='cursor-pointer hover:shadow-md transition-shadow p-1'
								>
									<CardContent className='p-2'>
										<div
											className='aspect-square bg-muted rounded-md mb-2 overflow-hidden'
											onClick={ () => {
												router.push(`/products/${ product.id }`)
											} }
										>
											<img
												src={ product.image || '/placeholder.svg' }
												alt={ product.name }
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='space-y-1'>
											<h3 className='font-medium text-xs leading-tight truncate w-40'>
												{ product.name }
											</h3>
											<div className='flex items-center justify-between'>
													<span className='text-xs font-bold text-primary'>
														{ formatCurrency(product.price) }
													</span>
											</div>
											<div className='flex justify-between'>
												<div className=' flex gap-2 items-center'>
													<p className='text-xs text-muted-foreground'>
														Stock
													</p>
													<Badge
														variant={ product.stock < lowStock ? 'destructive' : 'secondary' }
														className='text-xs'
													>{ product.stock }
													</Badge>
												</div>
												<Button
													onClick={ () => handleAddToCart(product) }
													variant='outline'
													size='icon'
												>
													<PlusIcon />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)) }
						</CardContent>
					</Card>
				</div>

				{/* Shopping Cart */ }
				<div
					className='space-y-6'
					id='cart-section-container'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
									<span className='flex items-center gap-2'>
										<ShoppingCart className='w-5 h-5' />
										Keranjang
									</span>
								{ cart.items.length > 0 && (
									<Button
										variant='destructive'
										size='icon'
										onClick={ clearCart }
									>
										<Trash2 className='w-4 h-4' />
									</Button>
								) }
							</CardTitle>
							<CardDescription>
								{ cart.itemCount } item dalam keranjang
							</CardDescription>
						</CardHeader>
						<CardContent>
							{ cart.items.length === 0 ? (
								<div className='text-center py-8'>
									<ShoppingCart className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
									<p className='text-muted-foreground'>
										Keranjang masih kosong
									</p>
									<p className='text-sm text-muted-foreground'>
										Pilih produk untuk memulai transaksi
									</p>
								</div>
							) : (
								<div className='space-y-3 w-full'>
									{ cart.items.map((item) => (
										<div
											key={ item.product.id }
											className='flex items-center gap-3 p-2 border rounded-lg justify-between'
										>
											<div className='flex gap-3 w-full'>
												<div
													className='size-16 bg-muted rounded-md overflow-hidden flex-shrink-0'
												>
													<img
														onClick={ () => {
															router.push(`/products/${ item.product.id }`)
														} }
														src={ item.product.image || '/placeholder.svg' }
														alt={ item.product.name }
														className='w-full h-full object-cover'
													/>
												</div>

												<div className='w-full '>
													<div className="justify-between flex w-full ">

														<div className='mb-1'>
															<h4 className='font-medium text-sm truncate w-40'>
																{ item.product.name }
															</h4>
															{/* <p className='text-xs text-muted-foreground'>
																{formatCurrency(item.product.price)}
															</p> */ }
														</div>
														<Button
															variant='ghost'
															size='icon'
															className={ 'w-7 h-7' }
															onClick={ () => removeFromCart(item.product.id) }
														>
															<XIcon />
														</Button>
													</div>
													<div className='flex items-center gap-3 text-xs sm:text-sm  '>
														<div className='flex items-center gap-2'>
															<Button
																variant='outline'
																size='icon'
																onClick={ () =>
																	handleQuantityChange(
																		item.product.id,
																		item.quantity - 1,
																	)
																}
															>
																<Minus className='w-3 h-3' />
															</Button>
															<span>{ item.quantity }</span>
															<Button
																variant='outline'
																size='icon'
																onClick={ () =>
																	handleQuantityChange(
																		item.product.id,
																		item.quantity + 1,
																	)
																}
																disabled={
																	item.quantity >= item.product.stock
																}
															>
																<Plus className='w-3 h-3' />
															</Button>
														</div>
														<p className='font-medium '>
															{ formatCurrency(item.subtotal) }
														</p>
													</div>
												</div>
											</div>

											{/*<div >*/ }
											{/*	<Button*/ }
											{/*		variant='ghost'*/ }
											{/*		size='icon'*/ }
											{/*		onClick={ () => removeFromCart(item.product.id) }*/ }
											{/*	>*/ }
											{/*		<Trash2 className='w-3 h-3' />*/ }
											{/*	</Button>*/ }
											{/*</div>*/ }
										</div>
									)) }
								</div>
							) }
						</CardContent>
					</Card>

					{/* Total & Checkout */ }
					{ cart.items.length > 0 && (
						<Card>
							<CardContent className='p-6'>
								<div className='space-y-3'>
									<div className='flex justify-between'>
										<span>Subtotal:</span>
										<span>{ formatCurrency(cart.total) }</span>
									</div>
									<div className='flex justify-between'>
										<span>Pajak ({ tax }%):</span>
										<span>{ formatCurrency(cart.total * ( tax / 100 )) }</span>
									</div>
									<Separator />
									<div className='flex justify-between text-lg font-bold'>
										<span>Total:</span>
										<span className='text-primary'>
												{ formatCurrency(cart.total + cart.total * ( tax / 100 )) }
											</span>
									</div>
								</div>

								<Dialog
									open={ isCheckoutOpen }
									onOpenChange={ setIsCheckoutOpen }
								>
									<DialogTrigger asChild>
										<Button
											className='w-full mt-4'
											size='lg'
										>
											<Receipt className='w-4 h-4 mr-2' />
											Checkout
										</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-md'>
										<DialogHeader>
											<DialogTitle>Proses Pembayaran</DialogTitle>
											<DialogDescription>
												Pilih metode pembayaran dan selesaikan transaksi
											</DialogDescription>
										</DialogHeader>
										<div className='space-y-4'>
											<div>
												<Label>Metode Pembayaran</Label>
												<Select
													value={ paymentMethod }
													onValueChange={ setPaymentMethod }
												>
													<SelectTrigger className={ 'w-full' }>
														<SelectValue placeholder='Pilih metode pembayaran' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='cash'>
															<div className='flex items-center gap-2'>
																<Banknote className='w-4 h-4' />
																Tunai
															</div>
														</SelectItem>
														<SelectItem value='card'>
															<div className='flex items-center gap-2'>
																<CreditCard className='w-4 h-4' />
																Kartu Debit/Kredit
															</div>
														</SelectItem>
														<SelectItem value='digital'>
															<div className='flex items-center gap-2'>
																<Calculator className='w-4 h-4' />
																E-Wallet
															</div>
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="date">Tanggal & Waktu Transaksi</Label>
												<Input
													className="w-full"
													id="date"
													type="datetime-local"
													value={ date }
													onChange={ (e) => setDate(e.target.value) }
												/>
											</div>

											{/*<div>*/ }
											{/*	<Label htmlFor="tax">Pajak (%)</Label>*/ }
											{/*	<Input*/ }
											{/*		id="tax"*/ }
											{/*		type="number"*/ }
											{/*		min="0"*/ }
											{/*		value={ tax }*/ }
											{/*		onChange={ (e) => setTax(Number(e.target.value)) }*/ }
											{/*	/>*/ }
											{/*</div>*/ }

											{ paymentMethod === 'cash' && (
												<div>
													<Label>Jumlah Uang Tunai</Label>
													<Input
														type='number'
														placeholder='Masukkan jumlah uang'
														value={ cashAmount }
														onChange={ (e) => setCashAmount(e.target.value) }
													/>
													{ cashAmount && (
														<div className='mt-2 p-2 bg-muted rounded'>
															<div className='flex justify-between text-sm'>
																<span>Total:</span>
																<span>{ formatCurrency(cart.total) }</span>
															</div>
															<div className='flex justify-between text-sm'>
																<span>Dibayar:</span>
																<span>
																		{ formatCurrency(
																			Number.parseFloat(cashAmount) || 0,
																		) }
																	</span>
															</div>
															<Separator className='my-1' />
															<div className='flex justify-between font-medium'>
																<span>Kembalian:</span>
																<span
																	className={
																		calculateChange() < 0
																			? 'text-destructive'
																			: 'text-primary'
																	}
																>
																		{ formatCurrency(
																			Math.max(0, calculateChange()),
																		) }
																	</span>
															</div>
														</div>
													) }
												</div>
											) }

											<div>
												<Label>Catatan (Opsional)</Label>
												<Textarea
													placeholder='Catatan untuk transaksi ini...'
													value={ customerNotes }
													onChange={ (e) => setCustomerNotes(e.target.value) }
													rows={ 2 }
												/>
											</div>

											<Button
												onClick={ handleCheckout }
												disabled={ !isCheckoutValid() }
												className='w-full'
												size='lg'
											>
												<Receipt className='w-4 h-4 mr-2' />
												Selesaikan Transaksi
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
					) }
				</div>
			</div>
		</>
	)
}
