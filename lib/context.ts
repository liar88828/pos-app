export type TContext = {
	params: Promise<{ id: string, period: string }>
	// params:Promise<{id:string}>
}
export const getContextParams = async (
	context: TContext,
	key: keyof Awaited<TContext['params']>) => {
	return ( await context.params )[key]
}
