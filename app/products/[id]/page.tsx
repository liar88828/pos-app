import React from 'react'
import ProductDetailPage from '../product-detail'
import { getProductById } from "@/app/products/product-utils";
import ErrorComponent from "@/components/mini/error-component";
import { getContextParams, TContext } from "@/lib/context";

export default async function page(context: TContext) {
	const id = await getContextParams(context, 'id')
	const product = getProductById(id)
	if (!product) return <ErrorComponent />
	else return <ProductDetailPage product={ product } />
}
