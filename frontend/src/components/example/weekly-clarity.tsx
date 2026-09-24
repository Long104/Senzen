import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ledgerRows = [
	{ label: "WK 32 · saved ฿412 · on track", onTrack: true, fill: "92%" },
	{ label: "WK 31 · saved ฿405 · on track", onTrack: true, fill: "88%" },
	{ label: "WK 30 · saved ฿398 · behind", onTrack: false, fill: "61%" },
	{ label: "WK 29 · saved ฿441 · on track", onTrack: true, fill: "100%" },
];

export function WeeklyClarity() {
	return (
		<section className="relative w-full overflow-hidden bg-[#EEEEEE]">
			<div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
					<div>
						<h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0A0A0A]">
							your money, {" "}
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
								<span className="relative z-10">one line</span>
							</span>{" "}
							a week
						</h2>
						<p className="mt-6 text-base md:text-lg leading-relaxed text-[#333333] max-w-md">
							Every week closes itself out — saved, spent, on-track or
							behind, in a single ledger line you&apos;ll actually read.
						</p>
						<Link
							href="/home"
							className="mt-8 inline-flex items-center gap-2 font-medium text-[#0A0A0A] underline underline-offset-4 decoration-1 hover:decoration-2 transition-all"
						>
							open your ledger
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>

					<div className="mt-8 border-t border-[#E5E5E5] pt-8">
						<div className="space-y-6">
							{ledgerRows.map((row) => (
								<div key={row.label}>
									<div className="flex items-center gap-3">
										<span
											aria-hidden="true"
											className={`h-2 w-2 shrink-0 rounded-full ${row.onTrack ? "bg-[#1EC072]" : "bg-[#BBBBBB]"}`}
										/>
										<span className="font-mono text-sm text-[#0A0A0A]">
											{row.label}
										</span>
									</div>
									<div className="h-1 w-full rounded bg-[#E5E5E5]">
										<div
											className="h-1 rounded bg-[#1EC072]"
											style={{ width: row.fill }}
										/>
									</div>
								</div>
							))}
						</div>
						<div className="mt-8 border-t border-[#E5E5E5] pt-5">
							<p className="font-mono text-xs text-[#555555]">
								3 weeks on track
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
