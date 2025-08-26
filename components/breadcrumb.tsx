"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    let label = segment

    // Convert segment to readable label
    switch (segment) {
      case "transaction":
        label = "Transaksi"
        break
      case "product":
        label = "Produk"
        break
      case "products":
        label = "Daftar Produk"
        break
      case "reports":
        label = "Laporan"
        break
      default:
        // For dynamic routes like product IDs, keep as is
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    items.push({
      label,
      href: index < segments.length - 1 ? href : undefined,
    })
  })

  return items
}
