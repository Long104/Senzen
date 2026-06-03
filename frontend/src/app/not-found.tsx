import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle className="text-6xl font-bold">404</CardTitle>
					<CardDescription className="text-lg">
						Page not found
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						The page you&apos;re looking for doesn&apos;t exist or has been moved.
					</p>
				</CardContent>
				<CardFooter className="justify-center">
					<Button asChild>
						<Link href="/">Go Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
