"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"; import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Component() {
	const router = useRouter();
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [data, setData] = useState<{ message: string; success: boolean }>();

	// const [password, setPassword] = useState("");
	// const [email, setEmail] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const { email, password, name, confirmPassword } =
			Object.fromEntries(formData);
		// const password = formData.get("password") as string;
		// const confirmPassword = formData.get("confirmPassword") as string;
		// const email = formData.get("email") as string;
		// const name = formData.get("username") as string;

		if (password !== confirmPassword) {
			setPasswordMatch(false);
			return;
		}

		setPasswordMatch(true);
		// Here you would typically send the form data to your backend
		// console.log("Form submitted", Object.fromEntries(formData));
		// console.log(email,password,name)

		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND + "/signup",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},

					body: JSON.stringify({ name, email, password }),
				},
			);

			if (response.ok) {
				const data = await response.json();
				setData(data);
				console.log("Signup successful:", data);
				if (data.success) {
					(event.currentTarget as HTMLFormElement)?.reset();
					router.push("/sign-in");
				}
			} else {
				console.error("Signup failed");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-primary">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Sign Up
					</CardTitle>
					<CardDescription className="text-center">
						Create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Username</Label>
							<Input id="name" name="name" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" name="password" type="password" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
							/>
						</div>
						{!passwordMatch && (
							<p className="text-sm text-red-500">Passwords do not match</p>
						)}
						{!data?.success && (
							<p className="text-sm text-red-500">{data?.message}</p>
						)}
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
					</form>
				</CardContent>
				<CardFooter className="text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-blue-600 hover:underline">
						Log in
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
