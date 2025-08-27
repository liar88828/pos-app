import { create } from "zustand"
import { persist } from "zustand/middleware"


export interface SettingState {
	storeName: string
	cashierName: string
	tax: number
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

			setSetting: (key, value) =>
				set((state) => ( {
					storeName: key === "storeName" ? ( value as string ) : state.storeName,
					cashierName: key === "cashierName" ? ( value as string ) : state.cashierName,
					tax: key === "tax" ? ( value as number ) : state.tax,
				} )),

			resetSettings: () =>
				set(() => ( {
					storeName: "My Store",
					cashierName: "Cashier",
					tax: 10,
				} )),
		} ),
		{
			name: "settings-storage", // key in localStorage
		}
	)
)
