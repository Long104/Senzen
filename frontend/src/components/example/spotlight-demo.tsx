import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrowserFrame } from "@example/browser-frame";

export function HeroComposer() {
	return (
		<section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden bg-[#EEEEEE]">
			<div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />

			<div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center pb-[10vh] lg:pb-[14vh]">
				<div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center py-10 lg:py-0">
					{/* LEFT: eyebrow + headline + tagline + CTA */}
					<div className="w-full flex flex-col items-start text-left">
						{/* Eyebrow with inline bear */}
						<div className="flex items-center gap-2 mb-4">
							<img
								src="/mascot/bear-mini-peeking.png"
								alt=""
								aria-hidden="true"
								className="w-8 h-8 object-contain"
							/>
							<span className="font-mono text-sm text-[#555555]">
								hi, this is senzen
							</span>
						</div>

						<div aria-hidden="true" className="h-[2px] w-20 bg-[#0A0A0A] mb-6" />

						{/* Brand headline */}
						<h1 className="font-sans font-extrabold text-[#0A0A0A] leading-[0.85]">
							<span className="relative inline-block">
								<span
									aria-hidden="true"
									className="absolute right-[-1rem] md:right-[-2rem] bottom-[-0.5rem] z-0 block h-[52%] w-[72%] bg-[#1EC072]"
									style={{
										backgroundImage:
											"radial-gradient(circle, rgba(10,10,10,0.12) 2.5px, transparent 2.5px)",
										backgroundSize: "14px 14px",
									}}
								/>
								<span className="relative z-10 block text-[4.5rem] md:text-[8rem] lg:text-[9.5rem] font-extrabold tracking-tighter leading-[0.85]">
									Senzen
								</span>
							</span>
						</h1>

						{/* Tagline */}
						<p className="mt-6 text-xl md:text-2xl text-[#0A0A0A] font-medium">
							your money, remembered.
						</p>

						{/* Value sentence */}
						<p className="mt-3 text-base md:text-lg text-[#333333] max-w-lg leading-relaxed">
							Manual capture. No bank sync. No notifications. Just calm
							clarity on where your money went.
						</p>

						{/* CTA */}
						<div className="mt-10">
							<Link
								href="/sign-up"
								className="group inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white text-base md:text-lg px-8 py-3.5 hover:bg-[#262626] transition-all active:scale-[0.98] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEEEE]"
							>
								start tracking
								<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
							</Link>
						</div>
					</div>

					{/* RIGHT: hero screenshot frame */}
					<div className="relative w-full flex-1 min-h-[340px] lg:min-h-[480px]">
						{/* subtle emerald dot halo */}
						<div
							aria-hidden="true"
							className="absolute inset-0 z-0 opacity-[0.12]"
							style={{
								backgroundImage:
									"radial-gradient(circle, #1EC072 3px, transparent 3px)",
								backgroundSize: "18px 18px",
							}}
						/>
						<BrowserFrame
							src="/screenshots/home.png"
							alt="Senzen home view — active plans at a glance"
							label="senzen.app/home — active plans"
							className="relative z-10"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
