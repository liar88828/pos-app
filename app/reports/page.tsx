"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  getDailySalesReport,
  getProductSalesReport,
  getTotalRevenue,
  getTotalTransactions,
  getAverageTransactionValue,
  getPaymentMethodBreakdown,
  mockTransactions,
} from "@/lib/reports"
import { formatCurrency } from "@/lib/cart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, CreditCard, Download, Package } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7")
  const [selectedTab, setSelectedTab] = useState("overview")

  const dailySalesData = getDailySalesReport(Number.parseInt(selectedPeriod))
  const productSalesData = getProductSalesReport()
  const paymentMethodData = getPaymentMethodBreakdown()

  const totalRevenue = getTotalRevenue()
  const totalTransactions = getTotalTransactions()
  const averageTransaction = getAverageTransactionValue()

  // Calculate growth (mock data for demonstration)
  const revenueGrowth = 12.5
  const transactionGrowth = 8.3

  const handleExportReport = (type: string) => {
    // Mock export functionality
    alert(`Mengekspor laporan ${type}... (Fitur akan diimplementasi)`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Laporan Penjualan</h1>
              <p className="text-muted-foreground">Analisis performa bisnis dan tren penjualan</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="14">14 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExportReport("PDF")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Penjualan</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Pendapatan</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">+{revenueGrowth}%</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
                      <p className="text-2xl font-bold">{totalTransactions}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">+{transactionGrowth}%</span>
                      </div>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rata-rata Transaksi</p>
                      <p className="text-2xl font-bold">{formatCurrency(averageTransaction)}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-muted-foreground">Per transaksi</span>
                      </div>
                    </div>
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Produk Terjual</p>
                      <p className="text-2xl font-bold">
                        {mockTransactions.reduce(
                          (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
                          0,
                        )}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-muted-foreground">Total unit</span>
                      </div>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tren Penjualan Harian</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("id-ID", { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Penjualan"]}
                        labelFormatter={(date) => new Date(date).toLocaleDateString("id-ID")}
                      />
                      <Line type="monotone" dataKey="totalSales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ method, percentage }) => `${method} (${percentage.toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Penjualan Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Penjualan"]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString("id-ID")}
                    />
                    <Bar dataKey="totalSales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailySalesData.slice(0, 7).map((day, index) => (
                <Card key={day.date}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Hari Ini" : `${index + 1} hari lalu`}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-1">{formatCurrency(day.totalSales)}</p>
                    <p className="text-sm text-muted-foreground">{day.totalTransactions} transaksi</p>
                    <p className="text-sm text-muted-foreground">Rata-rata: {formatCurrency(day.averageTransaction)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSalesData.slice(0, 10).map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-muted-foreground">{product.quantitySold} unit terjual</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("id-ID")} • {transaction.items.length} item(s)
                        </p>
                        <p className="text-sm text-muted-foreground">Kasir: {transaction.cashierName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(transaction.total)}</p>
                        <Badge
                          variant={
                            transaction.paymentMethod === "cash"
                              ? "default"
                              : transaction.paymentMethod === "card"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {transaction.paymentMethod === "cash"
                            ? "Tunai"
                            : transaction.paymentMethod === "card"
                              ? "Kartu"
                              : "Digital"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
