"use client";

import { useEffect, useState } from "react";
import { BUILT_IN_CATEGORIES, getCustomCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

// Shared category tile buttons — renders a fragment, parent owns the grid.
// Hydrates custom categories on mount and listens for additions.
export function CategoryTiles({
	selected,
	onSelect,
}: {
	selected: string | null;
	onSelect: (key: string) => void;
}) {
	const [customs, setCustoms] = useState<string[]>([]);

	useEffect(() => {
		const sync = () => setCustoms(getCustomCategories());
		sync();
		window.addEventListener("senzen-custom-categories", sync);
		return () => window.removeEventListener("senzen-custom-categories", sync);
	}, []);

	return (
		<>
			{[...BUILT_IN_CATEGORIES.map((c) => c.key), ...customs].map((key) => {
				const meta = BUILT_IN_CATEGORIES.find((c) => c.key === key);
				const label = meta ? meta.label : key;
				const isSelected = selected === key;
				return (
					<button
						key={key}
						type="button"
						onClick={() => onSelect(key)}
						className={cn(
							"flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-2.5 transition-colors duration-200",
							isSelected
								? "border-primary bg-primary/10"
								: "border-border hover:border-primary/50",
						)}
					>
						{meta ? (
							<meta.icon
								className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")}
								strokeWidth={1.5}
							/>
						) : (
							<span className={cn("h-4 w-4 text-center text-sm leading-4", isSelected ? "text-primary" : "text-muted-foreground")}>
								{label[0]}
							</span>
						)}
						<span className="text-[11px] leading-none text-foreground">
							{label.split(" ")[0]}
						</span>
					</button>
				);
			})}
		</>
	);
}
