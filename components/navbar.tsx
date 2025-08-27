'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from '@/components/ui/sheet'
import { BarChart3, LogOut, Menu, Package, Receipt, Settings, ShoppingCart, } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { useSettingStore } from "@/store/setting-store";

const navigationItems = [
	// {
	//   title: "Dashboard",
	//   href: "/",
	//   icon: Home,
	// },
	{
		title: 'Transaksi',
		href: '/transaction',
		icon: ShoppingCart,
	},
	{
		title: 'Produk',
		href: '/products',
		icon: Package,
	},
	{
		title: 'Laporan',
		href: '/reports',
		icon: BarChart3,
	},
]

export function Navbar() {
	const { cart } = useCartStore()
	const { storeName } = useSettingStore()
	const pathname = usePathname()
	const currentPage =
		pathname === '/transaction' ? '#cart-section-container' : '/transaction'
	const [ isOpen, setIsOpen ] = useState(false)

	return (
		<header
			className='sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60'
		>
			<div className='container mx-auto px-4'>
				<div className='flex h-16 items-center justify-between'>
					{/* Logo and Brand */ }
					<div className='flex items-center gap-4'>
						{/* {currentPage} */ }
						<Sheet
							open={ isOpen }
							onOpenChange={ setIsOpen }
						>
							<SheetTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									className='md:hidden'
								>
									<Menu className='h-5 w-5' />
								</Button>
							</SheetTrigger>
							<SheetContent
								side='left'
								className='w-64 flex flex-col gap-4 py-4'
							>
								<SheetHeader>
									<SheetTitle>{ storeName }</SheetTitle>
									<SheetDescription>Point of Sale</SheetDescription>
								</SheetHeader>
								<nav className='flex flex-col gap-2 px-4'>
									{ navigationItems.map((item) => {
										const Icon = item.icon
										const isActive = pathname === item.href
										return (
											<Link
												key={ item.href }
												href={ item.href }
												onClick={ () => setIsOpen(false) }
												className={ `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
													isActive
														? 'bg-primary text-primary-foreground'
														: 'hover:bg-accent hover:text-accent-foreground'
												}` }
											>
												<Icon className='h-4 w-4' />
												{ item.title }
												{ item.href === '/transaction' && cart.itemCount > 0 && (
													<Badge
														variant='secondary'
														className='ml-auto'
													>
														{ cart.itemCount }
													</Badge>
												) }
											</Link>
										)
									}) }
								</nav>
							</SheetContent>
						</Sheet>

						<Link
							href='/'
							className='flex items-center gap-2'
						>
							<div
								className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'
							>
								<Receipt className='h-4 w-4' />
							</div>
							<div className='hidden sm:block'>
								<h1 className='text-lg font-semibold'>{ storeName }</h1>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation */ }
					<nav className='hidden md:flex items-center gap-1'>
						{ navigationItems.map((item) => {
							const Icon = item.icon
							const isActive = pathname === item.href
							return (
								<Button
									key={ item.href }
									variant={ isActive ? 'default' : 'ghost' }
									size='sm'
									asChild
									className='relative'
								>
									<Link href={ item.href }>
										<Icon className='h-4 w-4 mr-2' />
										{ item.title }
										{/* {item.href === '/transaction' && cart.itemCount > 0 && (
											<Badge
												variant='secondary'
												className='ml-2'>
												{cart.itemCount}
											</Badge>
										)} */ }
									</Link>
								</Button>
							)
						}) }
					</nav>

					{/* User Menu and Cart */ }
					<div className='flex items-center gap-2'>
						{/* Cart Quick Access */ }
						<Button
							variant='outline'
							size='sm'
							asChild
							className='relative bg-transparent'
						>
							<Link href={ currentPage }>
								<ShoppingCart className='h-4 w-4' />
								{ cart.itemCount > 0 && (
									<Badge
										variant='destructive'
										className='absolute -top-2 -right-2 h-5 w-5 p-0 text-xs'
									>
										{ cart.itemCount }
									</Badge>
								) }
							</Link>
						</Button>

						{/* User Menu */ }
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
								>
									<Settings className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-48'
							>
								{/*<DropdownMenuItem>*/ }
								{/*	<User className='mr-2 h-4 w-4' />*/ }
								{/*	Profil Kasir*/ }
								{/*</DropdownMenuItem>*/ }

								<DropdownMenuItem asChild>
									<Link href={ '/setting' }>
										<Settings className='mr-2 h-4 w-4' />
										Pengaturan
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />

								<DropdownMenuItem className='text-destructive'>
									<LogOut className='mr-2 h-4 w-4' />
									Keluar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	)
}
