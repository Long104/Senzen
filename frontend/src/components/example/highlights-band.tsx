import React from "react";

const highlights = [
	{
		number: "01",
		title: "custom duration plans",
		body: "Set a 1-month or 6-month plan. You decide the timeline.",
		span: "md:col-span-3",
	},
	{
		number: "02",
		title: "category envelopes",
		body: "Groceries, transport, dining out — each bucket with a ceiling you set.",
		span: "md:col-span-2",
	},
	{
		number: "03",
		title: "intentional manual entry",
		body: "Type an amount, press enter. No bank connection, no automated import.",
		span: "md:col-span-2",
	},
	{
		number: "04",
		title: "clear progress without noise",
		body: "Progress bars show where you are. No guilt trips, no push alerts.",
		span: "md:col-span-3",
	},
];

const rowBorders = [
	"border-b border-[#E5E5E5]",
	"border-b border-[#E5E5E5]",
	"border-b border-[#E5E5E5] md:border-b-0",
	"",
];

export function HighlightsBand() {
	return (
		<section className="relative w-full overflow-hidden bg-[#EEEEEE]">
			<div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
				<p className="font-mono text-sm text-[#555555]">
					more from senzen
				</p>
				<div className="mt-10 grid grid-cols-1 md:grid-cols-5 md:gap-x-12">
					{highlights.map((item, i) => (
						<div
							key={item.number}
							className={`py-8 md:py-10 ${item.span} ${rowBorders[i]}`}
						>
							<div className="flex items-center gap-3">
								<span className="font-mono text-sm text-[#555555]">
									{item.number}
								</span>
								<span
									aria-hidden="true"
									className="h-2 w-2 rounded-full bg-[#1EC072] shrink-0"
								/>
								<h3 className="font-sans text-lg md:text-xl font-semibold tracking-tight text-[#0A0A0A]">
									{item.title}
								</h3>
							</div>
							<p className="mt-3 text-sm md:text-base leading-relaxed text-[#333333] md:pl-[3.75rem]">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
