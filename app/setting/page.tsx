"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingStore } from "@/store/setting-store";

export default function SettingsPage() {
	const { setSetting, resetSettings, storeName, tax, cashierName } = useSettingStore()

	const handleSave = () => {
		// here you can trigger toast or persist, zustand already saves to localStorage
		console.log("Settings saved")
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

			</CardContent>
			<CardFooter className="flex-col gap-2">
				{/*<Button className="w-full mt-4" onClick={ handleSave }>*/ }
				{/*	Save Settings*/ }
				{/*</Button>*/ }

				<Button onClick={ resetSettings } className={ 'w-full' }>
					Reset
				</Button>
			</CardFooter>
		</Card>
	)
}
