"use client";

import { useEffect, useState } from "react";

export const CURRENCIES = [
	{ code: "THB", symbol: "฿" },
	{ code: "USD", symbol: "$" },
	{ code: "EUR", symbol: "€" },
	{ code: "JPY", symbol: "¥" },
	{ code: "GBP", symbol: "£" },
] as const;

export type Currency = (typeof CURRENCIES)[number];

const KEY = "senzen-currency";
const EVENT = "senzen-currency-changed";

const DEFAULT: Currency = CURRENCIES[0]; // THB

export function getCurrency(): Currency {
	if (typeof window === "undefined") return DEFAULT;
	const code = window.localStorage.getItem(KEY);
	return CURRENCIES.find((c) => c.code === code) ?? DEFAULT;
}

export function setCurrency(code: string) {
	window.localStorage.setItem(KEY, code);
	window.dispatchEvent(new Event(EVENT));
}

export function useCurrency(): Currency {
	const [currency, setLocal] = useState<Currency>(DEFAULT);

	useEffect(() => {
		setLocal(getCurrency());
		const onChange = () => setLocal(getCurrency());
		window.addEventListener(EVENT, onChange);
		return () => window.removeEventListener(EVENT, onChange);
	}, []);

	return currency;
}
