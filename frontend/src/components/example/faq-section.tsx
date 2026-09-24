"use client";

import React, { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Plus } from "lucide-react";

const faqs = [
	{
		question: "do i need to connect my bank?",
		answer:
			"no. senzen never asks for bank logins or credentials. you type spending into the capture bar in a few seconds.",
	},
	{
		question: "what is a plan?",
		answer:
			"a plan is an optional budget ceiling for a month or category. if you only want to log daily expenses without targets, you can skip plans completely.",
	},
	{
		question: "will senzen send me notifications or reminders?",
		answer:
			"no. senzen has no push alerts, streaks, or guilt trips. it is ready when you open it and silent when you do not.",
	},
	{
		question: "how is this different from a spreadsheet?",
		answer:
			"faster entry on phone or desktop, instant day grouping, search, multi-currency support, and clean csv export whenever you want raw data.",
	},
];

export function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section className="relative w-full overflow-hidden bg-[#EEEEEE]">
			<div className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
				<h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0A0A0A] text-center">
					questions,{" "}
					<span className="relative inline-block">
						<span
							aria-hidden="true"
							className="absolute left-[-4%] bottom-[-0.35rem] z-0 block h-[44%] w-[108%] bg-[#1EC072]"
							style={{
								backgroundImage:
									"radial-gradient(circle, rgba(10,10,10,0.12) 2.5px, transparent 2.5px)",
								backgroundSize: "14px 14px",
							}}
						/>
						<span className="relative z-10">answered</span>
					</span>
				</h2>
				<div className="mt-12 md:mt-16 divide-y divide-[#E5E5E5] border-t border-[#E5E5E5]">
					{faqs.map((faq, index) => (
						<Collapsible
							key={faq.question}
							open={openIndex === index}
							onOpenChange={(open) =>
								setOpenIndex(open ? index : null)
							}
						>
							<CollapsibleTrigger className="group py-6 flex w-full items-center justify-between gap-6 text-left">
								<span className="font-medium text-base md:text-lg text-[#0A0A0A]">
									{faq.question}
								</span>
								<Plus
									className={`h-5 w-5 shrink-0 text-[#0A0A0A] transition-transform duration-200 ${
										openIndex === index ? "rotate-45" : ""
									}`}
								/>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<p className="pb-6 pr-10 text-base leading-relaxed text-[#333333]">
									{faq.answer}
								</p>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</div>
		</section>
	);
}
