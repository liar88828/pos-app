"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Package, Barcode, Minus, Plus } from "lucide-react"
import { getProductById } from "@/lib/products"
import { formatCurrency } from "@/lib/cart"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const product = getProductById(params.id as string)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h2>
              <p className="text-muted-foreground mb-4">Produk yang Anda cari tidak tersedia.</p>
              <Button asChild>
                <Link href="/">Kembali ke Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToTransaction = () => {
    // Navigate to transaction page with product data
    const searchParams = new URLSearchParams({
      productId: product.id,
      quantity: quantity.toString(),
    })
    router.push(`/transaction?${searchParams.toString()}`)
  }

  const breadcrumbItems = [{ label: "Produk", href: "/" }, { label: product.name }]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Additional product images could go here */}
                <div className="aspect-square bg-muted rounded-md opacity-50"></div>
                <div className="aspect-square bg-muted rounded-md opacity-50"></div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription className="text-lg mt-1">{product.category}</CardDescription>
                  </div>
                  <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>Stok: {product.stock}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Deskripsi</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Barcode</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Barcode className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{product.barcode}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Kategori</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Transaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tambah ke Transaksi</CardTitle>
                <CardDescription>Pilih jumlah dan tambahkan ke keranjang</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Jumlah</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min="1"
                      max={product.stock}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">Max: {product.stock}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(product.price * quantity)}</span>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddToTransaction} className="flex-1" disabled={product.stock === 0}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.stock === 0 ? "Stok Habis" : "Tambah ke Transaksi"}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/transaction">Lihat Keranjang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stock Warning */}
            {product.stock < 10 && product.stock > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">Peringatan Stok Rendah</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stok produk ini tinggal {product.stock} unit. Segera lakukan restok.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products or Additional Info */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Stok Terpantau</h3>
                  <p className="text-sm text-muted-foreground">Stok produk dipantau secara real-time</p>
                </div>
                <div className="text-center p-4">
                  <Barcode className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Barcode Scanner</h3>
                  <p className="text-sm text-muted-foreground">Dapat dipindai dengan barcode scanner</p>
                </div>
                <div className="text-center p-4">
                  <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Transaksi Cepat</h3>
                  <p className="text-sm text-muted-foreground">Proses transaksi yang cepat dan mudah</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
