import { create } from "zustand"
import { persist } from "zustand/middleware"


export interface SettingState {
	storeName: string
	cashierName: string
	tax: number
	lowStock: number
	categoryProduct: string[] // 👈 tambahin ini
}

interface SettingStore extends SettingState {
	setSetting: <K extends keyof SettingState>(key: K, value: SettingState[K]) => void
	resetSettings: () => void
}

export const useSettingStore = create<SettingStore>()(
	persist(
		(set) => ( {
			storeName: "My Store",
			cashierName: "Cashier",
			tax: 10,
			lowStock: 10,
			categoryProduct: [ "Food", "Drink", "Accessories" ], // 👈 default

			setSetting: (key, value) =>
				set((state) => ( {
					...state,
					[key]: value, // lebih ringkas, bisa handle semua key termasuk array
				} )),

			resetSettings: () =>
				set(() => ( {
					storeName: "My Store",
					cashierName: "Cashier",
					tax: 10,
					categoryProduct: [ "Food", "Drink", "Accessories" ], // 👈 reset ke default
				} )),
		} ),
		{
			name: "settings-storage", // key in localStorage
		}
	)
)
