import { create } from "zustand"
import { persist } from "zustand/middleware"


export interface FormDataProduct {
	name: string
	price: string
	category: string
	stock: string
	description: string
	barcode: string
	image: string
}


interface FormStore {
	formData: FormDataProduct
	setField: (key: keyof FormDataProduct, value: string) => void
	resetForm: () => void,
	setFormData: (data: FormDataProduct) => void
}


export const useProductFormStore = create<FormStore>()(
	persist(
		(set) => ( {
			formData: {
				name: "",
				price: "",
				category: "",
				stock: "",
				description: "",
				barcode: "",
				image: "",
			},
			setFormData: (data) =>
				set(() => ( {
					formData: data,
				} )),
			setField: (key, value) =>
				set((state) => ( {
					formData: {
						...state.formData,
						[key]: value,
					},
				} )),
			resetForm: () =>
				set({
					formData: {
						name: "",
						price: "",
						category: "",
						stock: "",
						description: "",
						barcode: "",
						image: "",
					},
				}),
		} ),
		{
			name: "form-storage", // key name in localStorage
		}
	)
)
