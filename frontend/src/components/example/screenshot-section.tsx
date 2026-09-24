import React from "react";
import { BrowserFrame } from "@example/browser-frame";

const screenshots = [
	{
		src: "/screenshots/home.png",
		alt: "Senzen home view — active plans at a glance",
		tag: "01 · home",
		caption:
			"type an amount and press enter. grouped by day, ready whenever you look.",
	},
	{
		src: "/screenshots/report.png",
		alt: "Senzen reports view — month, year, all-time breakdown",
		tag: "02 · reports",
		caption:
			"switch between month, year, and all-time totals to see where cash actually went.",
	},
	{
		src: "/screenshots/plans.png",
		alt: "Senzen plans view — category envelopes and budgets",
		tag: "03 · plans",
		caption:
			"set a monthly category ceiling if you want one, or leave it empty and just log.",
	},
];

export function AppScreenshotsSection() {
	return (
		<section className="relative w-full overflow-hidden bg-[#EEEEEE]">
			<div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
				{/* Section Header */}
				<div className="mb-12 md:mb-16">
					<p className="font-mono text-sm text-[#555555]">
						three views. no clutter.
					</p>
					<h2 className="mt-4 font-sans text-3xl md:text-5xl font-bold tracking-tight text-[#0A0A0A]">
						the app itself.
					</h2>
					<p className="mt-3 text-base md:text-lg text-[#333333] max-w-xl">
						every dollar accounted for by you.
					</p>
				</div>

				{/* Screenshot Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{screenshots.map((shot) => (
						<div key={shot.tag} className="flex flex-col gap-3">
							<BrowserFrame
								src={shot.src}
								alt={shot.alt}
								label={shot.tag}
							/>
							<p className="font-mono text-xs text-[#555555] leading-relaxed">
								{shot.caption}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
