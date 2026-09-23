import {
	Utensils,
	ShoppingCart,
	Bus,
	Droplets,
	Zap,
	Plane,
	ShoppingBag,
	HeartPulse,
	CircleDashed,
	type LucideIcon,
} from "lucide-react";

export type BuiltInCategory = {
	key: string;
	label: string;
	icon: LucideIcon;
};

export const BUILT_IN_CATEGORIES: BuiltInCategory[] = [
	{ key: "food", label: "food & drink", icon: Utensils },
	{ key: "groceries", label: "groceries", icon: ShoppingCart },
	{ key: "transport", label: "transport", icon: Bus },
	{ key: "water", label: "water bill", icon: Droplets },
	{ key: "electric", label: "electric bill", icon: Zap },
	{ key: "travel", label: "travel", icon: Plane },
	{ key: "shopping", label: "shopping", icon: ShoppingBag },
	{ key: "health", label: "health", icon: HeartPulse },
];

export function categoryMeta(name?: string | null): BuiltInCategory {
	return (
		BUILT_IN_CATEGORIES.find((c) => c.key === name) ?? {
			key: name ?? "other",
			label: name ?? "other",
			icon: CircleDashed,
		}
	);
}
