import React from "react";
import Link from "next/link";

export function Navbar() {
	return (
		<div className="w-full bg-[#EEEEEE] text-[#0A0A0A]">
			<header className="sticky top-0 z-50 w-full bg-[#EEEEEE]/90 backdrop-blur-md transition-colors border-b border-[#E5E5E5]/60">
				<div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-10">
					{/* Left: Senzen Logo with green icon */}
					<Link href="/" className="flex items-center gap-2.5 group">
						<div className="w-7 h-7 rounded-lg bg-[#1EC072] flex items-center justify-center shadow-sm">
							<img src="/logo.png" alt="Senzen" className="h-[84%] w-[84%] rounded-[5px] object-cover" />
						</div>
						<span className="font-sans text-xl font-extrabold tracking-tight text-[#0A0A0A] group-hover:opacity-90 transition-opacity">
							Senzen
						</span>
					</Link>

					{/* Right: Sign in + Get started */}
					<div className="flex items-center gap-4">
						<Link
							href="/sign-in"
							className="text-sm font-semibold text-[#0A0A0A] hover:opacity-70 transition-opacity px-2 py-1"
						>
							sign in
						</Link>
						<Link
							href="/sign-up"
							className="inline-flex items-center justify-center rounded-full bg-[#0A0A0A] text-white text-sm font-semibold px-5 py-2 hover:bg-[#262626] transition-all active:scale-[0.98]"
						>
							get started
						</Link>
					</div>
				</div>
			</header>
		</div>
	);
}
