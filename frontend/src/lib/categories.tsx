import { useEffect, useState } from "react";
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
	Coffee,
	Pizza,
	Car,
	Bike,
	Shirt,
	House,
	Wifi,
	Smartphone,
	Tv,
	Gamepad2,
	Dumbbell,
	Dog,
	Baby,
	Gift,
	Music,
	BookOpen,
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

// Icons custom categories can pick from — keys are stable storage identifiers.
export const CUSTOM_ICONS: Record<string, LucideIcon> = {
	coffee: Coffee,
	pizza: Pizza,
	car: Car,
	bike: Bike,
	shirt: Shirt,
	house: House,
	wifi: Wifi,
	smartphone: Smartphone,
	tv: Tv,
	gamepad: Gamepad2,
	dumbbell: Dumbbell,
	dog: Dog,
	baby: Baby,
	gift: Gift,
	music: Music,
	book: BookOpen,
};

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

export type CustomCategory = { name: string; icon?: string };

function parseCustoms(raw: string | null): CustomCategory[] {
	try {
		const parsed = raw ? JSON.parse(raw) : [];
		if (!Array.isArray(parsed)) return [];
		return parsed
			.map((c) =>
				typeof c === "string" ? { name: c } : { name: c?.name, icon: c?.icon },
			)
			.filter((c): c is CustomCategory => !!c.name);
	} catch {
		return [];
	}
}

export function getCustomCategories(): CustomCategory[] {
	if (typeof window === "undefined") return [];
	return parseCustoms(window.localStorage.getItem(CUSTOM_KEY));
}

export function addCustomCategory(name: string, icon?: string): string {
	const key = name.trim().toLowerCase();
	if (!key) return key;
	const customs = getCustomCategories();
	if (
		!customs.some((c) => c.name === key) &&
		!BUILT_IN_CATEGORIES.some((c) => c.key === key)
	) {
		window.localStorage.setItem(
			CUSTOM_KEY,
			JSON.stringify([...customs, { name: key, icon }]),
		);
		window.dispatchEvent(new Event("senzen-custom-categories"));
	}
	return key;
}

// Hydration-safe customs reader for client components — empty until mounted,
// then kept fresh via the storage event.
export function useCustomCategories(): CustomCategory[] {
	const [customs, setCustoms] = useState<CustomCategory[]>([]);

	useEffect(() => {
		const sync = () => setCustoms(getCustomCategories());
		sync();
		window.addEventListener("senzen-custom-categories", sync);
		return () => window.removeEventListener("senzen-custom-categories", sync);
	}, []);

	return customs;
}

// Resolve the display icon for any category name (built-in, custom, unknown).
export function resolveCategoryIcon(
	name: string | null | undefined,
	customs: CustomCategory[],
): LucideIcon {
	if (!name) return CircleDashed;
	const custom = customs.find((c) => c.name === name);
	if (custom?.icon && CUSTOM_ICONS[custom.icon]) return CUSTOM_ICONS[custom.icon];
	return categoryMeta(name).icon;
}
