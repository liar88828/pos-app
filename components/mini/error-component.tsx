'use client'
import React from 'react';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


function ErrorComponent(
	{
		text = 'Data is Not found',
		description = 'Please create data or Refresh'
	}:
	{ text?: string, description?: string, }
) {
	const router = useRouter()
	return (
		<Card>
			<CardHeader>
				<CardTitle>{ text }</CardTitle>
				<CardDescription>{ description }</CardDescription>
			</CardHeader>
			<CardAction>
				<Button variant={ 'default' } asChild
				        onClick={ () => {
					        router.refresh()
				        } }
				>
					Refresh
				</Button>

				<Button variant={ 'outline' } asChild
				        onClick={ () => {
					        router.push('/')
				        } }
				>
					Back Home
				</Button>

			</CardAction>
		</Card>
	);
}

export default ErrorComponent;
