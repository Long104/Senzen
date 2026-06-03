"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex items-center justify-center min-h-[50vh] p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>
						An unexpected error occurred while loading this page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{error.message || "Please try again."}
					</p>
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button onClick={() => reset()}>Try Again</Button>
					<Button variant="outline" onClick={() => (window.location.href = "/home")}>
						Go Home
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
