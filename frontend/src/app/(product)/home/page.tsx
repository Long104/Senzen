"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { QuickAdd } from "@/components/quick-add";
import { ExpenseFeed } from "@/components/expense-feed";
import { useTransactions } from "@/hooks/useTransactions";
import { useCurrency } from "@/lib/currency";
import { categoryMeta } from "@/lib/categories";

function monthSpent(transactions: { amount: number; transaction_date: string }[]) {
	const now = new Date();
	return transactions
		.filter((t) => {
			const d = new Date(t.transaction_date);
			return (
				d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
			);
		})
		.reduce((sum, t) => sum + t.amount, 0);
}

export default function Home() {
	const { transactionsQuery } = useTransactions();
	const transactions = transactionsQuery.data;
	const { symbol } = useCurrency();
	const [query, setQuery] = useState("");

	const q = query.trim().toLowerCase();
	const filtered =
		q && transactions
			? transactions.filter((t) => {
					const note = (t.description ?? "").toLowerCase();
					const category = t.category_name || t.category?.name;
					const catKey = (category ?? "").toLowerCase();
					const catLabel = categoryMeta(category).label.toLowerCase();
					return note.includes(q) || catKey.includes(q) || catLabel.includes(q);
				})
			: transactions;

	const spent = transactions ? monthSpent(transactions) : 0;
	const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

	return (
		<main className="mx-auto max-w-2xl px-6 py-10">
			<p className="text-sm text-muted-foreground">
				{new Date().toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
				})}
			</p>

			<h1 className="mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground">
				{monthName} · {symbol}{spent.toFixed(2)}{" "}
				<span className="font-sans text-xl font-normal text-muted-foreground">
					spent
				</span>
			</h1>

			<div className="mt-8">
				<QuickAdd />
			</div>

			<div className="mt-8 flex items-center gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="search notes or categories"
						aria-label="search expenses"
						className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50"
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery("")}
							aria-label="clear search"
							className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				{q && transactions && (
					<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
						{filtered?.length ?? 0} of {transactions.length}
					</span>
				)}
			</div>

			<div className="mt-8">
				{q && (!filtered || filtered.length === 0) ? (
					<p className="py-16 text-center text-sm text-muted-foreground">
						no matches — try another word
					</p>
				) : (
					<ExpenseFeed transactions={filtered} />
				)}
			</div>
		</main>
	);
}
