import React from "react";
import Link from "next/link";

export const Footer = () => {
	return (
		<footer className="w-full bg-[#0A0A0A] text-[#EEEEEE]">
			<div
				aria-hidden="true"
				className="h-6 w-full"
				style={{
					backgroundImage:
						"radial-gradient(circle, rgba(238,238,238,0.18) 2px, transparent 2px)",
					backgroundSize: "14px 14px",
				}}
			/>
			<div className="max-w-7xl mx-auto flex items-center justify-between py-8 px-6 md:px-10">
				{/* Left: bear + brand + tagline */}
				<div className="flex items-center gap-2.5">
					<img
						src="/mascot/bear-sleep-peaceful.png"
						alt=""
						aria-hidden="true"
						className="w-6 h-6 object-contain opacity-85"
					/>
					<span className="font-sans text-sm font-bold text-[#EEEEEE]">
						senzen
					</span>
					<span className="font-sans text-[13px] text-[#888888]">
						· your money, remembered.
					</span>
				</div>

				{/* Right: nav links + copyright */}
				<div className="flex items-center gap-5">
					<Link
						href="/sign-in"
						className="text-xs text-[#AAAAAA] hover:text-[#EEEEEE] transition-colors"
					>
						sign in
					</Link>
					<Link
						href="/sign-up"
						className="text-xs text-[#AAAAAA] hover:text-[#EEEEEE] transition-colors"
					>
						sign up
					</Link>
					<span className="text-xs text-[#666666]">
						© {new Date().getFullYear()} senzen. all rights reserved.
					</span>
				</div>
			</div>
		</footer>
	);
};
