import React from 'react'
import ReportsPage from './report-page'
import { TContext } from "@/lib/context";

export default async function page(_context: TContext) {
	// const period = await getContextParams(context, 'period')

	return <ReportsPage
		// dataTransactions={ transactionData() }
		// dataProducts={ products() }
		// dailySalesData={ dailySalesData }
		//
		// productSalesData={ productSalesData }
		// paymentMethodData={ paymentMethodData }
		//
		// totalRevenue={ totalRevenue }
		// totalTransactions={ totalTransactions }
		// averageTransaction={ averageTransaction }
	/>
}
