"use client";

import { QuickAdd } from "@/components/quick-add";
import { ExpenseFeed } from "@/components/expense-feed";
import { useTransactions } from "@/hooks/useTransactions";
import { useCurrency } from "@/lib/currency";

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

			<div className="mt-10">
				<ExpenseFeed transactions={transactions} />
			</div>
		</main>
	);
}
