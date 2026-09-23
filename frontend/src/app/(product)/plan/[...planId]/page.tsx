"use client";

import { useSearchParams } from "next/navigation";
import { QuickAdd } from "@/components/quick-add";
import { ExpenseFeed } from "@/components/expense-feed";
import { usePlanById } from "@/hooks/usePlan";
import { useTransactions } from "@/hooks/useTransactions";

function inMonth(date: string, ref: Date) {
	const d = new Date(date);
	return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

function isToday(date: string) {
	const d = new Date(date);
	const now = new Date();
	return (
		d.getDate() === now.getDate() &&
		d.getMonth() === now.getMonth() &&
		d.getFullYear() === now.getFullYear()
	);
}

export default function PlanPage() {
	const searchParams = useSearchParams();
	const planId = searchParams.get("id");

	const { data: plan } = usePlanById();
	const { transactionsQuery } = useTransactions();
	const all = transactionsQuery.data;
	const transactions = (all ?? []).filter(
		(t) => t.plan_id != null && String(t.plan_id) === String(planId),
	);

	const now = new Date();
	const today = transactions
		.filter((t) => isToday(t.transaction_date))
		.reduce((s, t) => s + t.amount, 0);
	const month = transactions
		.filter((t) => inMonth(t.transaction_date, now))
		.reduce((s, t) => s + t.amount, 0);
	const total = transactions.reduce((s, t) => s + t.amount, 0);

	const budget = (plan?.initial_budget as number) || 0;
	const left = budget - total;

	return (
		<main className="mx-auto max-w-2xl px-6 py-10">
			<h1 className="text-2xl font-semibold lowercase tracking-tight text-foreground">
				{plan?.name ?? "plan"}
			</h1>
			{budget > 0 && (
				<p className="mt-2 font-mono text-lg tabular-nums text-foreground">
					${left.toFixed(2)}{" "}
					<span className="font-sans text-sm text-muted-foreground">
						left of ${budget.toLocaleString()}
					</span>
				</p>
			)}

			<div className="mt-6 flex gap-6 border-b border-border pb-6">
				<div>
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						today
					</p>
					<p className="font-mono text-lg tabular-nums text-foreground">
						${today.toFixed(2)}
					</p>
				</div>
				<div>
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						this month
					</p>
					<p className="font-mono text-lg tabular-nums text-foreground">
						${month.toFixed(2)}
					</p>
				</div>
				<div>
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						total
					</p>
					<p className="font-mono text-lg tabular-nums text-foreground">
						${total.toFixed(2)}
					</p>
				</div>
			</div>

			<div className="mt-8">
				<QuickAdd planId={planId ? parseInt(planId) : undefined} />
			</div>

			<div className="mt-10">
				<ExpenseFeed transactions={transactions} />
			</div>
		</main>
	);
}
