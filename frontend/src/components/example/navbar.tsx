import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar() {
	return (
		<div className="w-full bg-[#EEEEEE] text-[#0A0A0A]">
			{/* Top Announcement Bar */}
			<div className="w-full bg-black text-white h-10 flex items-center justify-center px-4 text-xs sm:text-sm font-medium tracking-tight">
				<Link
					href="/#plans"
					className="group inline-flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
				>
					<span>senzen · manual expense tracking · no bank sync · no notifications</span>
					<ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
				</Link>
			</div>

			{/* Main Navbar */}
			<header className="sticky top-0 z-50 w-full bg-[#EEEEEE]/90 backdrop-blur-md transition-colors border-b border-[#E5E5E5]/60">
				<div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-10">
					{/* Left: Senzen Logo with green icon */}
					<div className="flex items-center gap-8">
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="w-7 h-7 rounded-lg bg-[#1EC072] flex items-center justify-center shadow-sm">
								<img src="/logo.png" alt="Senzen" className="h-[84%] w-[84%] rounded-[5px] object-cover" />
							</div>
							<span className="font-sans text-xl font-extrabold tracking-tight text-[#0A0A0A] group-hover:opacity-90 transition-opacity">
								Senzen
							</span>
						</Link>
					</div>

					{/* Center: Text links */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/#features"
							className="text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
						>
							Features
						</Link>
						<Link
							href="/#strategies"
							className="text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
						>
							Strategies
						</Link>
						<Link
							href="/pricing"
							className="text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
						>
							Pricing
						</Link>
						<Link
							href="/createPlan"
							className="text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
						>
							Docs
						</Link>
					</nav>

					{/* Right: Login + Black pill button */}
					<div className="flex items-center gap-4">
						<Link
							href="/sign-in"
							className="text-sm font-semibold text-[#0A0A0A] hover:text-[#0A0A0A]/70 transition-colors px-2 py-1"
						>
							Login
						</Link>
						<Link
							href="/sign-up"
							className="inline-flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold px-5 py-2 hover:bg-neutral-800 transition-all active:scale-[0.98]"
						>
							Get Started
						</Link>
					</div>
				</div>
			</header>
		</div>
	);
}
