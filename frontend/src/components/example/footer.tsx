import React from "react";
import Link from "next/link";

const columns = [
	{
		title: "Product",
		links: [
			{ label: "Create Plan", href: "/createPlan" },
			{ label: "Dashboard", href: "/home" },
			{ label: "Pricing", href: "/pricing" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "#" },
			{ label: "Careers", href: "#" },
			{ label: "Contact", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Privacy", href: "#" },
			{ label: "Terms", href: "#" },
			{ label: "Security", href: "#" },
		],
	},
];

export const Footer = () => {
	return (
		<footer className="w-full bg-[#0A0A0A] text-[#EEEEEE]">
			<div
				aria-hidden="true"
				className="h-8 w-full"
				style={{
					backgroundImage:
						"radial-gradient(circle, rgba(238,238,238,0.18) 2.5px, transparent 2.5px)",
					backgroundSize: "14px 14px",
				}}
			/>
			<div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
					<div>
						{/* Bear stamp */}
						<img
							src="/mascot/bear-sleep-peaceful.png"
							alt=""
							aria-hidden="true"
							className="w-16 h-16 object-contain mb-4 opacity-80"
						/>
						<p className="font-sans text-xl font-bold tracking-tight text-[#EEEEEE]">
							senzen
						</p>
						<p className="mt-3 font-sans text-sm leading-relaxed text-[#BBBBBB] max-w-xs">
							your money, remembered.
						</p>
					</div>
					{columns.map((column) => (
						<div key={column.title}>
							<h4 className="font-sans text-sm font-semibold text-[#EEEEEE]">
								{column.title}
							</h4>
							<ul className="mt-4 space-y-2 font-sans text-sm">
								{column.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-[#BBBBBB] hover:text-[#EEEEEE] transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-12 border-t border-white/10 pt-6 font-sans text-xs text-[#999999]">
					© {new Date().getFullYear()} senzen financial systems. all rights
					reserved.
				</div>
			</div>
		</footer>
	);
};
