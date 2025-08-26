"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ShoppingCart,
  Search,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  Scan,
} from "lucide-react"
import { products, searchProducts, getProductById } from "@/lib/products"
import { formatCurrency } from "@/lib/cart"
import { useCart } from "@/contexts/cart-context"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"

export default function TransactionPage() {
  const searchParams = useSearchParams()
  const { cart, addProduct, removeProduct, updateProductQuantity, clearAllItems } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(products.slice(0, 8))
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cashAmount, setCashAmount] = useState("")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [customerNotes, setCustomerNotes] = useState("")

  // Handle product from URL params (from product detail page)
  useEffect(() => {
    const productId = searchParams.get("productId")
    const quantity = searchParams.get("quantity")

    if (productId) {
      const product = getProductById(productId)
      if (product) {
        addProduct(product, quantity ? Number.parseInt(quantity) : 1)
      }
    }
  }, [searchParams, addProduct])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchProducts(searchQuery))
    } else {
      setSearchResults(products.slice(0, 8))
    }
  }, [searchQuery])

  const handleAddToCart = (product: any) => {
    addProduct(product, 1)
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId)
    } else {
      updateProductQuantity(productId, newQuantity)
    }
  }

  const calculateChange = () => {
    const cash = Number.parseFloat(cashAmount) || 0
    return cash - cart.total
  }

  const handleCheckout = () => {
    // Simulate transaction processing
    alert(
      `Transaksi berhasil!\nTotal: ${formatCurrency(cart.total)}\nMetode: ${paymentMethod}\n${paymentMethod === "cash" ? `Kembalian: ${formatCurrency(calculateChange())}` : ""}`,
    )
    clearAllItems()
    setIsCheckoutOpen(false)
    setPaymentMethod("")
    setCashAmount("")
    setCustomerNotes("")
  }

  const isCheckoutValid = () => {
    if (cart.items.length === 0) return false
    if (!paymentMethod) return false
    if (paymentMethod === "cash") {
      const cash = Number.parseFloat(cashAmount) || 0
      return cash >= cart.total
    }
    return true
  }

  const breadcrumbItems = [{ label: "Transaksi" }]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Grid layout for product search & selection and shopping cart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search & Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Cari Produk
                </CardTitle>
                <CardDescription>Scan barcode atau cari nama produk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Scan barcode atau ketik nama produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Scan className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Pilih Produk</CardTitle>
                <CardDescription>Klik produk untuk menambah ke keranjang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {searchResults.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square bg-muted rounded-md mb-2 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium text-xs leading-tight">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">{formatCurrency(product.price)}</span>
                            <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="text-xs">
                              {product.stock}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Keranjang
                  </span>
                  {cart.items.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllItems}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>{cart.itemCount} item dalam keranjang</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Keranjang masih kosong</p>
                    <p className="text-sm text-muted-foreground">Pilih produk untuk memulai transaksi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.subtotal)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(item.product.id)}
                            className="h-auto p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total & Checkout */}
            {cart.items.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(cart.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak (0%):</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(cart.total)}</span>
                    </div>
                  </div>

                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4" size="lg">
                        <Receipt className="w-4 h-4 mr-2" />
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Proses Pembayaran</DialogTitle>
                        <DialogDescription>Pilih metode pembayaran dan selesaikan transaksi</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Metode Pembayaran</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih metode pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">
                                <div className="flex items-center gap-2">
                                  <Banknote className="w-4 h-4" />
                                  Tunai
                                </div>
                              </SelectItem>
                              <SelectItem value="card">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  Kartu Debit/Kredit
                                </div>
                              </SelectItem>
                              <SelectItem value="digital">
                                <div className="flex items-center gap-2">
                                  <Calculator className="w-4 h-4" />
                                  E-Wallet
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentMethod === "cash" && (
                          <div>
                            <Label>Jumlah Uang Tunai</Label>
                            <Input
                              type="number"
                              placeholder="Masukkan jumlah uang"
                              value={cashAmount}
                              onChange={(e) => setCashAmount(e.target.value)}
                            />
                            {cashAmount && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <div className="flex justify-between text-sm">
                                  <span>Total:</span>
                                  <span>{formatCurrency(cart.total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Dibayar:</span>
                                  <span>{formatCurrency(Number.parseFloat(cashAmount) || 0)}</span>
                                </div>
                                <Separator className="my-1" />
                                <div className="flex justify-between font-medium">
                                  <span>Kembalian:</span>
                                  <span className={calculateChange() < 0 ? "text-destructive" : "text-primary"}>
                                    {formatCurrency(Math.max(0, calculateChange()))}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <Label>Catatan (Opsional)</Label>
                          <Textarea
                            placeholder="Catatan untuk transaksi ini..."
                            value={customerNotes}
                            onChange={(e) => setCustomerNotes(e.target.value)}
                            rows={2}
                          />
                        </div>

                        <Button onClick={handleCheckout} disabled={!isCheckoutValid()} className="w-full" size="lg">
                          <Receipt className="w-4 h-4 mr-2" />
                          Selesaikan Transaksi
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
