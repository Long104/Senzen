"use client";

import {
	BUILT_IN_CATEGORIES,
	CUSTOM_ICONS,
	resolveCategoryIcon,
	useCustomCategories,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

// Shared category tile buttons — renders a fragment, parent owns the grid.
export function CategoryTiles({
	selected,
	onSelect,
}: {
	selected: string | null;
	onSelect: (key: string) => void;
}) {
	const customs = useCustomCategories();
	const all = [...BUILT_IN_CATEGORIES.map((c) => c.key), ...customs.map((c) => c.name)];

	return (
		<>
			{all.map((key) => {
				const builtIn = BUILT_IN_CATEGORIES.find((c) => c.key === key);
				const label = builtIn ? builtIn.label : key;
				const Icon = builtIn ? builtIn.icon : resolveCategoryIcon(key, customs);
				const isSelected = selected === key;
				return (
					<button
						key={key}
						type="button"
						onClick={() => onSelect(key)}
						className={cn(
							"flex flex-col items-center gap-1.5 rounded-full border bg-card px-3 py-2.5 transition-colors duration-200",
							isSelected
								? "border-primary bg-primary/10"
								: "border-border hover:border-primary/50",
						)}
					>
						<Icon
							className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")}
							strokeWidth={1.5}
						/>
						<span className="text-[11px] leading-none text-foreground">
							{label.split(" ")[0]}
						</span>
					</button>
				);
			})}
		</>
	);
}
