import React from "react";
import Link from "next/link";
import { Spotlight } from "../ui/spotlight";

export function SpotlightPreview() {
	return (
		<div className="h-[40rem] w-full flex md:items-center md:justify-center bg-primary antialiased bg-grid-white/[0.02] relative overflow-hidden select-none">
			{/* <div className="h-[40rem] w-full flex md:items-center md:justify-center bg-primary antialiased bg-grid-white/[0.02] relative "> */}
			<Spotlight
				className="-top-40 left-0 md:left-60 md:-top-20"
				fill="white"
			/>
			<div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
				<h1 className="p-2 text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
					Senzen <br /> Money Management.
				</h1>
				<p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
					Application that help you to manage your money, track your expenses
					and income, and plan your budget.
				</p>
				<p className="mt-10 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
					<button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
						<Link href="/sign-in" className="text-white">
							Start Planing
						</Link>
					</button>
				</p>
			</div>
		</div>
	);
}
