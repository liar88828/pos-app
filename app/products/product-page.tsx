'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { formatCurrency } from '@/store/cart-store'
import { AlertTriangle, Edit, Package, Plus, Search, Trash2, } from 'lucide-react'
import { useProductFormStore } from "@/store/productForm-store";
import { Product, productSanitizer, useProductStore } from "@/store/product-store";
import { useSettingStore } from "@/store/setting-store";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
	const router = useRouter()

	const { categoryProduct, lowStock } = useSettingStore()
	const { formData, resetForm, setFormData } = useProductFormStore()
	const { products, deleteProduct, updateProduct, addProduct } = useProductStore()

	const [ searchTerm, setSearchTerm ] = useState('')
	const [ selectedCategory, setSelectedCategory ] = useState('Semua')
	const [ sortBy, setSortBy ] = useState('name')
	const [ isAddDialogOpen, setIsAddDialogOpen ] = useState(false)
	const [ editingProduct, setEditingProduct ] = useState(false)
	const [ idProduct, setIdProduct ] = useState<string | null>(null)

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		const filtered = products.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.barcode.includes(searchTerm)
			const matchesCategory =
				selectedCategory === 'Semua' || product.category === selectedCategory
			return matchesSearch && matchesCategory
		})

		// Sort products
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name)
				case 'price':
					return a.price - b.price
				case 'stock':
					return a.stock - b.stock
				case 'category':
					return a.category.localeCompare(b.category)
				default:
					return 0
			}
		})

		return filtered
	}, [ products, searchTerm, selectedCategory, sortBy ])

	// Low stock products
	const lowStockProducts = products.filter((product) => product.stock <= lowStock)

	const handleAddProduct = () => {
		if (!formData.name || !formData.price || !formData.category) return
		addProduct(productSanitizer(formData))
		resetForm()
		setIsAddDialogOpen(false)
	}

	const handleEditProduct = (id: string) => {
		if (
			!formData.name ||
			!formData.price ||
			!formData.category
		) return

		updateProduct(id, productSanitizer(formData))
		resetForm()
		setEditingProduct(false)
		setIdProduct(null)

	}

	const openEditDialog = (product: Product) => {
		setFormData({
			name: product.name,
			price: product.price.toString(),
			category: product.category,
			stock: product.stock.toString(),
			description: product.description || '',
			barcode: product.barcode,
			image: product.image,
		})
		setEditingProduct(true)
		setIdProduct(product.id)
	}

	const handleDeleteProduct = (productId: string) => {
		if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
			deleteProduct(productId)
		}
	}

	return ( <>
			{/* Dialog Update product*/ }
			{ idProduct &&
				<Dialog
					open={ editingProduct }
					onOpenChange={ setEditingProduct }
				>
					<DialogContent className='max-w-md'>
						<DialogHeader>
							<DialogTitle>Edit Produk</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						<ProductForm
							onSubmit={ () => handleEditProduct(idProduct) }
							onCancel={ () => setEditingProduct(false) }
							submitLabel='Update Produk'
						/>
					</DialogContent>
				</Dialog>
			}

			{/*Search Product */ }
			<Card>
				<CardHeader>
					<CardTitle> Manajemen Produk </CardTitle>
					<CardDescription>
						Kelola semua produk dalam sistem POS Anda
					</CardDescription>
				</CardHeader>

				<CardContent>
					{/* Controls */ }
					<div className='flex flex-col md:flex-row gap-4 '>
						<div className='flex-1 relative'>
							<Search
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4'
							/>
							<Input
								type='search'
								placeholder='Cari produk ...'
								value={ searchTerm }
								onChange={ (e) => setSearchTerm(e.target.value) }
								className='pl-10 '
							/>
						</div>

						<Select
							value={ selectedCategory }
							onValueChange={ setSelectedCategory }
						>
							<SelectTrigger className='w-full md:w-48'>
								<SelectValue placeholder='Pilih kategori' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={ 'Semua' }>Semua</SelectItem>
								{ categoryProduct.map((category) => (
									<SelectItem key={ category } value={ category }>
										{ category }
									</SelectItem>
								)) }
							</SelectContent>
						</Select>

						<Select
							value={ sortBy }
							onValueChange={ setSortBy }
						>
							<SelectTrigger className='w-full md:w-48'>
								<SelectValue placeholder='Urutkan berdasarkan' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='name'>Nama</SelectItem>
								<SelectItem value='price'>Harga</SelectItem>
								<SelectItem value='stock'>Stok</SelectItem>
								<SelectItem value='category'>Kategori</SelectItem>
							</SelectContent>
						</Select>

						<Dialog
							open={ isAddDialogOpen }
							onOpenChange={ setIsAddDialogOpen }
						>
							<DialogTrigger asChild>
								<Button onClick={ () => resetForm() }>
									<Plus className='h-4 w-4 mr-2' />
									Tambah Produk
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-md'>
								<DialogHeader>
									<DialogTitle>Tambah Produk Baru</DialogTitle>
								</DialogHeader>
								<ProductForm
									// formData={ formData }
									onSubmit={ handleAddProduct }
									onCancel={ () => setIsAddDialogOpen(false) }
									submitLabel='Tambah Produk'
								/>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>

			{/* Low Stock Alert */ }
			{ lowStockProducts.length > 0 && (
				<Card className='mb-6 border-destructive'>
					<CardHeader>
						<CardTitle className='text-destructive flex items-center gap-2'>
							<AlertTriangle className='h-5 w-5' />
							Peringatan Stok Rendah
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex flex-wrap  gap-2'>
							{ lowStockProducts.map((product) => (
								<Button
									className='cursor-pointer'
									variant={ 'destructive' }
									size={ 'sm' }
									onClick={ () => setSearchTerm(product.name) } key={ product.id }
								>
									{ product.name } ({ product.stock } tersisa)
								</Button>
							)) }
						</div>
					</CardContent>
				</Card>
			) }

			{/* Products Grid */ }
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
				{ filteredProducts.map((product) => (
					<Card
						key={ product.id }
						className='cursor-pointer hover:shadow-md transition-shadow p-1'
					>
						<CardContent className='p-2'>
							<div className='aspect-square bg-muted rounded-md mb-2 overflow-hidden relative'>
								<img
									onClick={ () => {
										router.push(`/products/${ product.id }`)
									} }
									src={ product.image || '/placeholder.svg' }
									alt={ product.name }
									className='w-full h-full object-cover'
								/>
								{ product.stock <= 10 && (
									<Badge
										className='absolute top-2 right-2'
										variant='destructive'
									>
										Stok Rendah
									</Badge>
								) }
							</div>
							<div className='space-y-1 mb-3'>
								<h3 className='font-semibold text-lg '>{ product.name }</h3>
								<Badge> { product.category } </Badge>
								<p className='text-xl font-bold text-primary'>
									{ formatCurrency(product.price) }
								</p>
								<p className='text-sm text-muted-foreground '>
									Stok: { product.stock }
								</p>
								{/* <p className='text-xs text-muted-foreground mb-3'>
									Barcode: {product.barcode}
								</p> */ }
							</div>

							<div className='flex gap-2'>

								<Button
									variant='outline'
									size='sm'
									onClick={ () => openEditDialog(product) }
								>
									<Edit /> Edit</Button>

								<Button
									variant='outline'
									size='sm'
									onClick={ () => handleDeleteProduct(product.id) }
									className='text-destructive hover:text-destructive'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>
				)) }
			</div>

			{ filteredProducts.length === 0 && (
				<Card className='p-8 text-center'>
					<Package className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
					<h3 className='text-lg font-semibold mb-2'>
						Tidak ada produk ditemukan
					</h3>
					<p className='text-muted-foreground'>
						Coba ubah filter pencarian atau tambah produk baru
					</p>
				</Card>
			) }
		</>
	)
}

// Product Form Component
function ProductForm(
	{
		onSubmit,
		onCancel,
		submitLabel,
	}: {
		onSubmit: () => void
		onCancel: () => void
		submitLabel: string
	}) {
	const { formData, setField, } = useProductFormStore()
	const { categoryProduct } = useSettingStore()
	return (
		<div className='space-y-4'>
			<div>
				<Label htmlFor='name'>Nama Produk *</Label>
				<Input
					id='name'
					value={ formData.name }
					onChange={ (e) => setField('name', e.target.value) }
					placeholder='Masukkan nama produk'
				/>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div>
					<Label htmlFor='price'>Harga *</Label>
					<Input
						id="price"
						type="text" // <-- change here
						inputMode="numeric"
						value={
							formData.price
								? parseInt(formData.price).toLocaleString("id-ID") // formatted with dot
								: ""
						}
						onChange={ (e) => {
							const raw = e.target.value.replace(/\D/g, ""); // remove non-digits
							setField("price", raw === "" ? "0" : raw);
						} }
						placeholder="0"
					/>
				</div>
				<div>
					<Label htmlFor='stock'>Stok</Label>
					<Input
						id='stock'
						type='number'
						value={ formData.stock }
						onChange={ (e) =>
							setField('stock', e.target.value)
						}
						placeholder='0'
					/>
				</div>
			</div>

			<div>
				<Label htmlFor='category'>Kategori *</Label>
				<Select
					value={ formData.category }
					onValueChange={ (value) =>
						setField('category', value)
					}
				>
					<SelectTrigger className={ 'w-full' }>
						<SelectValue placeholder='Pilih kategori' />
					</SelectTrigger>
					<SelectContent>
						{ categoryProduct.map((category) => (
							<SelectItem
								key={ category }
								value={ category }
							>
								{ category }
							</SelectItem>
						)) }
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label htmlFor='barcode'>Barcode</Label>
				<Input
					id='barcode'
					value={ formData.barcode }
					onChange={ (e) =>
						setField('barcode', e.target.value)
					}
					placeholder='Akan dibuat otomatis jika kosong'
				/>
			</div>

			<div>
				<Label htmlFor='description'>Deskripsi</Label>
				<Textarea
					id='description'
					value={ formData.description }
					onChange={ (e) =>
						setField("description", e.target.value)
					}
					placeholder='Deskripsi produk (opsional)'
					rows={ 3 }
				/>
			</div>

			<div>
				<Label htmlFor='image'>URL Gambar</Label>
				<Input
					id='image'
					value={ formData.image }
					onChange={ (e) => setField('image', e.target.value) }
					placeholder='https://example.com/image.jpg'
				/>
			</div>

			<div className='flex gap-2 pt-4'>
				<Button
					onClick={ onSubmit }
					className='flex-1'
				>
					{ submitLabel }
				</Button>
				<Button
					variant='outline'
					onClick={ onCancel }
					className='flex-1 bg-transparent'
				>
					Batal
				</Button>
			</div>
		</div>
	)
}
