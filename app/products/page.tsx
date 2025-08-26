"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import { products, categories, type Product } from "@/lib/products"
import { formatCurrency } from "@/lib/cart"
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>(products)

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    barcode: "",
    image: "",
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = productList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return a.price - b.price
        case "stock":
          return a.stock - b.stock
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  }, [productList, searchTerm, selectedCategory, sortBy])

  // Low stock products
  const lowStockProducts = productList.filter((product) => product.stock <= 10)

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) return

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock) || 0,
      description: formData.description,
      barcode: formData.barcode || `${Date.now()}`,
      image: formData.image || "/diverse-products-still-life.png",
    }

    setProductList([...productList, newProduct])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (!editingProduct || !formData.name || !formData.price || !formData.category) return

    const updatedProducts = productList.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: formData.name,
            price: Number.parseFloat(formData.price),
            category: formData.category,
            stock: Number.parseInt(formData.stock) || 0,
            description: formData.description,
            barcode: formData.barcode || product.barcode,
            image: formData.image || product.image,
          }
        : product,
    )

    setProductList(updatedProducts)
    resetForm()
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProductList(productList.filter((product) => product.id !== productId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      barcode: "",
      image: "",
    })
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      description: product.description || "",
      barcode: product.barcode,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola semua produk dalam sistem POS Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Produk</p>
                  <p className="text-2xl font-bold">{productList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Stok Rendah</p>
                  <p className="text-2xl font-bold">{lowStockProducts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Nilai Stok</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(productList.reduce((total, product) => total + product.price * product.stock, 0))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari produk atau barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nama</SelectItem>
              <SelectItem value="price">Harga</SelectItem>
              <SelectItem value="stock">Stok</SelectItem>
              <SelectItem value="category">Kategori</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Produk Baru</DialogTitle>
              </DialogHeader>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddProduct}
                onCancel={() => setIsAddDialogOpen(false)}
                submitLabel="Tambah Produk"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Peringatan Stok Rendah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map((product) => (
                  <Badge key={product.id} variant="destructive">
                    {product.name} ({product.stock} tersisa)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                {product.stock <= 10 && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    Stok Rendah
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <p className="text-xl font-bold text-primary mb-2">{formatCurrency(product.price)}</p>
                <p className="text-sm text-muted-foreground mb-3">Stok: {product.stock}</p>
                <p className="text-xs text-muted-foreground mb-3">Barcode: {product.barcode}</p>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Produk</DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleEditProduct}
                        onCancel={() => setEditingProduct(null)}
                        submitLabel="Update Produk"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah filter pencarian atau tambah produk baru</p>
          </Card>
        )}
      </div>
    </div>
  )
}

// Product Form Component
function ProductForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nama Produk *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama produk"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Harga *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stok</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Kategori *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="barcode">Barcode</Label>
        <Input
          id="barcode"
          value={formData.barcode}
          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          placeholder="Akan dibuat otomatis jika kosong"
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi produk (opsional)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">URL Gambar</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSubmit} className="flex-1">
          {submitLabel}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Batal
        </Button>
      </div>
    </div>
  )
}
