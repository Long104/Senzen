"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";

export default function SignUpPage() {
	const router = useRouter();
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setServerError(null);

		const formData = new FormData(event.currentTarget);
		const { email, password, name, confirmPassword } =
			Object.fromEntries(formData);

		if (password !== confirmPassword) {
			setPasswordMatch(false);
			return;
		}

		setPasswordMatch(true);
		if (isSubmitting) return;
		setIsSubmitting(true);

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
				if (data.success) {
					(event.currentTarget as HTMLFormElement)?.reset();
					router.push("/sign-in");
				} else {
					setServerError(data.message || "signup failed. please try again.");
				}
			} else {
				setServerError("signup failed. please try again.");
			}
		} catch (err) {
			console.error("Error:", err);
			setServerError("something went wrong. please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-1 items-center justify-center bg-[#EEEEEE] relative">
			{/* Paper grid canvas */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px)",
					backgroundSize: "4rem 4rem",
					opacity: 0.5,
				}}
			/>

			<div className="relative z-10 w-full max-w-[440px] mx-auto px-4">
				{/* Bear cameo */}
				<div className="flex justify-center -mb-2">
					<img
						src="/mascot/bear-mini-peeking.png"
						alt=""
						aria-hidden="true"
						className="w-8 h-8 object-contain"
					/>
				</div>

				{/* Auth card */}
				<div className="bg-white border border-[#E2E2E2] rounded-2xl p-8 shadow-[0_1px_3px_rgba(10,10,10,0.04),0_8px_24px_rgba(10,10,10,0.03)]">
					{/* Card header */}
					<div className="text-center mb-6">
						<h1 className="font-['Plus_Jakarta_Sans',-apple-system,sans-serif] text-2xl font-bold tracking-tight text-[#0A0A0A]">
							create your account
						</h1>
						<p className="mt-1 text-sm text-[#555555]">
							start tracking your expenses with calm clarity
						</p>
					</div>

					{/* OAuth buttons */}
					<div className="flex flex-col gap-2 mb-4">
						<a href={process.env.NEXT_PUBLIC_BACKEND + "/google_login"}>
							<button
								type="button"
								className="w-full flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white text-[#0A0A0A] text-sm font-medium rounded-md px-4 py-2.5 hover:bg-[#F7F7F7] transition-colors duration-150"
							>
								<svg className="w-5 h-5" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clipPath="url(#clip0_signup)">
										<path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
										<path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853" />
										<path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04" />
										<path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335" />
									</g>
									<defs>
										<clipPath id="clip0_signup">
											<rect width="20" height="20" fill="white" transform="translate(0.5)" />
										</clipPath>
									</defs>
								</svg>
								Continue with Google
							</button>
						</a>

						<a href={process.env.NEXT_PUBLIC_BACKEND + "/github_login"}>
							<button
								type="button"
								className="w-full flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white text-[#0A0A0A] text-sm font-medium rounded-md px-4 py-2.5 hover:bg-[#F7F7F7] transition-colors duration-150"
							>
								<Github className="w-5 h-5" />
								Continue with GitHub
							</button>
						</a>
					</div>

					{/* Divider */}
					<div className="relative my-5">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-[#E5E5E5]" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-white px-3 font-mono text-[12px] text-[#888888]">
								or with email
							</span>
						</div>
					</div>

					{/* 4-field registration form */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="name"
								className="font-['Plus_Jakarta_Sans',-apple-system,sans-serif] text-[13px] font-semibold text-[#0A0A0A] tracking-tight"
							>
								username
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className="w-full bg-white border border-[#E5E5E5] rounded-md px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1EC072] focus:ring-offset-2 transition-colors duration-150"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="email"
								className="font-['Plus_Jakarta_Sans',-apple-system,sans-serif] text-[13px] font-semibold text-[#0A0A0A] tracking-tight"
							>
								email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="w-full bg-white border border-[#E5E5E5] rounded-md px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1EC072] focus:ring-offset-2 transition-colors duration-150"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="password"
								className="font-['Plus_Jakarta_Sans',-apple-system,sans-serif] text-[13px] font-semibold text-[#0A0A0A] tracking-tight"
							>
								password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								minLength={6}
								required
								className="w-full bg-white border border-[#E5E5E5] rounded-md px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1EC072] focus:ring-offset-2 transition-colors duration-150"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="confirmPassword"
								className="font-['Plus_Jakarta_Sans',-apple-system,sans-serif] text-[13px] font-semibold text-[#0A0A0A] tracking-tight"
							>
								confirm password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								className="w-full bg-white border border-[#E5E5E5] rounded-md px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1EC072] focus:ring-offset-2 transition-colors duration-150"
							/>
						</div>

						{!passwordMatch && (
							<p className="font-mono text-xs text-[#DC2626]">
								passwords do not match
							</p>
						)}

						{serverError && (
							<p className="font-mono text-xs text-[#DC2626]">
								{serverError}
							</p>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-2 w-full bg-[#0A0A0A] text-white font-semibold text-sm rounded-full px-5 py-2.5 hover:bg-[#262626] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1EC072] focus-visible:ring-offset-2 transition-all duration-150 disabled:opacity-85 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "creating account..." : "create account"}
						</button>
					</form>

					{/* Footer link */}
					<p className="mt-5 text-center text-[13px] text-[#555555]">
						already have an account?{" "}
						<Link
							href="/sign-in"
							className="text-[#0A0A0A] font-semibold underline underline-offset-4 hover:text-[#1EC072] transition-colors duration-150"
						>
							log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
