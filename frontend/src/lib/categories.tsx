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

const CUSTOM_KEY = "senzen-custom-categories";

export function getCustomCategories(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(CUSTOM_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((c) => typeof c === "string") : [];
	} catch {
		return [];
	}
}

export function addCustomCategory(name: string): string {
	const key = name.trim().toLowerCase();
	if (!key) return key;
	const customs = getCustomCategories();
	if (!customs.includes(key) && !BUILT_IN_CATEGORIES.some((c) => c.key === key)) {
		window.localStorage.setItem(CUSTOM_KEY, JSON.stringify([...customs, key]));
		window.dispatchEvent(new Event("senzen-custom-categories"));
	}
	return key;
}
