// store/useTransactionStore.ts
import { create } from "zustand"
import { nanoid } from "nanoid"
import { persist } from 'zustand/middleware';


export interface Transaction {
	id: string
	date: Date
	items: {
		productId: string
		productName: string
		quantity: number
		price: number
		total: number,
		productCategory: string
	}[]
	subtotal: number
	tax: number
	total: number
	paymentMethod: "cash" | "card" | "digital" | string
	cashierName: string,
	actualPrice: number
}


interface TransactionState {
	transactions: Transaction[]
	addTransaction: (transaction: Omit<Transaction, "id">) => void
	updateTransaction: (id: string, updated: Partial<Transaction>) => void
	deleteTransaction: (id: string) => void
	getTransaction: (id: string) => Transaction | undefined
}


export const useTransactionStore = create<TransactionState>()(
	persist(
		(set, get) => ( {
			transactions: [],

			addTransaction: (transaction) => {
				const newTransaction: Transaction = {
					id: nanoid(),
					...transaction,
				}
				set((state) => ( {
					transactions: [ ...state.transactions, newTransaction ],
				} ))
			},

			updateTransaction: (id, updated) =>
				set((state) => ( {
					transactions: state.transactions.map((t) =>
						t.id === id ? { ...t, ...updated } : t
					),
				} )),

			deleteTransaction: (id) =>
				set((state) => ( {
					transactions: state.transactions.filter((t) => t.id !== id),
				} )),

			getTransaction: (id) => {
				return get().transactions.find((t) => t.id === id)
			},
		} ),
		{
			name: "transaction-storage", // key in localStorage
		}
	)
)
