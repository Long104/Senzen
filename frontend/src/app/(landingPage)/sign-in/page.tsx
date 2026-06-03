"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Github } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import useAuthStore from "@/zustand/auth";

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const router = useRouter();
	const [data, setData] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const logins = useAuthStore((state) => state.login);

	const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND + "/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
				credentials: "include",
				cache: "no-store",
			});

			setPassword("");
			setEmail("");

			if (response.ok) {
				const data = await response.json();
				console.log("Login successful:", data);
				// const token = data.token || Cookies.get("jwt");
				const token = data.token;
				if (!token) {
					console.error("Token is missing or undefined");
					return;
				}
				logins(String(token));
				// (event.currentTarget as HTMLFormElement)?.reset();
				router.push("/home");
				// router.refresh();
			} else {
				setData(true);
				return;
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsSubmitting(false); // Reset submitting state
		}
	};
	// const google_login = process.env.NEXT_PUBLIC_BACKEND + `/google_login`;
	// const github_login = process.env.NEXT_PUBLIC_BACKEND + `/github_login`;

	return (
		<div className="flex items-center justify-center min-h-screen bg-primary">
			<Card className="w-full max-w-md">
				<CardHeader className="flex flex-col gap-1">
					<CardTitle className="text-2xl font-bold text-center">
						Login
					</CardTitle>
					<CardDescription className="text-center">
						Choose your preferred login method
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Link
							href={process.env.NEXT_PUBLIC_BACKEND + "/google_login"}
						>
							<Button variant="outline" className="w-full">
								<svg
									className="w-5 h-5 mr-2"
									viewBox="0 0 21 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_13183_10121)">
										<path
											d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
											fill="#3F83F8"
										></path>
										<path
											d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
											fill="#34A853"
										></path>
										<path
											d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
											fill="#FBBC04"
										></path>
										<path
											d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
											fill="#EA4335"
										></path>
									</g>
									<defs>
										<clipPath id="clip0_13183_10121">
											<rect
												width="20"
												height="20"
												fill="white"
												transform="translate(0.5)"
											></rect>
										</clipPath>
									</defs>
								</svg>
								Login with Google
							</Button>
						</Link>

						<Link
							href={process.env.NEXT_PUBLIC_BACKEND + "/github_login"}
						>
							<Button variant="outline" className="w-full">
								<Github className="w-5 h-5 mr-2" />
								Login with GitHub
							</Button>
						</Link>
					</div>
					<div className="flex items-center flex-col">
						<Separator className="flex-grow" />
						<span className="mx-4 text-sm text-gray-400 py-2">or</span>
						<Separator className="flex-grow" />
					</div>
					<form onSubmit={handleSubmitLogin}>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col gap-2 mt-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="123!@#$%"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button className="w-full mt-4 " variant="outline" type="submit">
							Login
						</Button>
					</form>

					{data && (
						<p className="text-sm text-red-500">
							check your email and password again
						</p>
					)}
				</CardContent>
				<CardFooter className="flex flex-col">
					<p className="mt-2 text-xs text-center text-gray-700">
						Don&apos;t have an account?{" "}
						<Link href="/sign-up" className="text-blue-600 hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
