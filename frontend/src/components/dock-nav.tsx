"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChartColumn, House, Wallet, type LucideIcon } from "lucide-react";
import {
	Dock,
	DockIcon,
	DockItem,
	DockLabel,
} from "@/components/motion-primitives/dock";

const items: {
	name: string;
	url: string;
	icon: LucideIcon;
	match: (p: string) => boolean;
}[] = [
	{ name: "home", url: "/home", icon: House, match: (p) => p === "/home" },
	{
		name: "report",
		url: "/report",
		icon: ChartColumn,
		match: (p) => p.startsWith("/report"),
	},
	{
		name: "plans",
		url: "/plans",
		icon: Wallet,
		match: (p) => p.startsWith("/plan"),
	},
];

export function DockNav() {
	const router = useRouter();
	const pathname = usePathname() ?? "";

	return (
		<div className="pointer-events-none fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2">
			<Dock
				panelHeight={56}
				magnification={70}
				distance={120}
				className="pointer-events-auto items-center gap-1 rounded-full border border-border/60 bg-card/90 px-2 shadow-[0_8px_30px_rgb(16_21_22/0.12)] backdrop-blur"
			>
				{items.map((item) => {
					const active = item.match(pathname);
					return (
						<DockItem
							key={item.name}
							onClick={() => router.push(item.url)}
							className={`relative aspect-square size-10 rounded-full transition-colors ${
								active
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<DockLabel className="rounded-full border-0 bg-foreground px-2.5 py-1 text-[11px] lowercase text-background">
								{item.name}
							</DockLabel>
							<DockIcon>
								<item.icon
									className="h-auto w-full"
									strokeWidth={active ? 2.2 : 1.8}
								/>
								<span
									className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#1EC072] transition-opacity duration-200 ${
										active ? "opacity-100" : "opacity-0"
									}`}
								/>
							</DockIcon>
						</DockItem>
					);
				})}
			</Dock>
		</div>
	);
}
