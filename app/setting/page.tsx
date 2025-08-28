"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingStore } from "@/store/setting-store"
import { Plus } from "lucide-react"
import { useState } from "react";

export default function SettingsPage() {
	const { setSetting, resetSettings, storeName, tax, cashierName, categoryProduct, lowStock } = useSettingStore()
	const [ inputValue, setInputValue ] = useState("")

	const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim() !== "") {
			e.preventDefault()
			setSetting("categoryProduct", [ ...categoryProduct, inputValue.trim() ])
			setInputValue("")
		}
	}

	const handleClickAdd = () => {
		if (inputValue.trim() !== "") {
			setSetting("categoryProduct", [ ...categoryProduct, inputValue.trim() ])
			setInputValue("")
		}
	}

	return (
		<Card className="max-w-lg mx-auto w-full">
			<CardHeader>
				<CardTitle>Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">

				<div className="space-y-2">
					<Label htmlFor="storeName">Store Name</Label>
					<Input
						id="storeName"
						value={ storeName }
						onChange={ (e) => setSetting("storeName", e.target.value) }
						placeholder="Enter store name"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="cashierName">Cashier Name</Label>
					<Input
						id="cashierName"
						value={ cashierName }
						onChange={ (e) => setSetting("cashierName", e.target.value) }
						placeholder="Enter cashier name"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="tax">Tax (%)</Label>
					<Input
						id="tax"
						type="number"
						value={ tax }
						onChange={ (e) => setSetting("tax", Number(e.target.value)) }
						placeholder="Tax percentage"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="tax">Low Stock</Label>
					<Input
						id="lowStock"
						type="number"
						value={ lowStock }
						onChange={ (e) => setSetting("lowStock", Number(e.target.value)) }
						placeholder="Low Stock"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="categoryProduct">Category Product</Label>
					<div className="flex items-center gap-2">
						<Input
							id="categoryProduct"
							placeholder="Type and press Enter"
							value={ inputValue }
							onChange={ (e) => setInputValue(e.target.value) }
							onKeyDown={ handleAddCategory }
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={ handleClickAdd }
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-wrap gap-2 mt-2">
						{ categoryProduct.map((cat, i) => (
							<span
								key={ i }
								className="px-2 py-1 bg-muted rounded-lg text-sm cursor-pointer hover:bg-destructive hover:text-white"
								onClick={ () =>
									setSetting(
										"categoryProduct",
										categoryProduct.filter((c) => c !== cat)
									)
								}
							>{ cat } ✕</span>
						)) }
					</div>
				</div>

			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button onClick={ resetSettings } className="w-full">
					Reset
				</Button>
			</CardFooter>
		</Card>
	)
}
