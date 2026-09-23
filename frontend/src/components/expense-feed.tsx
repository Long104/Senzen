"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Transaction } from "@/hooks/useTransactions";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { categoryMeta } from "@/lib/categories";
import { useCurrency } from "@/lib/currency";

function dayLabel(dateStr: string): string {
	const date = new Date(dateStr);
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	const sameDay = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	if (sameDay(date, today)) return "today";
	if (sameDay(date, yesterday)) return "yesterday";
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
}

function FeedRow({ t, onDelete, symbol }: { t: Transaction; onDelete: (id: number) => void; symbol: string }) {
	const meta = categoryMeta(t.category_name || t.category?.name);
	return (
		<div className="group flex items-center gap-3 py-2.5">
			<meta.icon
				className="h-4 w-4 shrink-0 text-muted-foreground"
				strokeWidth={1.5}
			/>
			<span className="shrink-0 max-w-[50%] truncate text-sm text-foreground">
				{t.description || meta.label}
			</span>
			{t.description && (
				<span className="hidden sm:inline shrink-0 max-w-[25%] truncate text-xs text-muted-foreground">
					{meta.label}
				</span>
			)}
			<span className="flex-1 border-b border-dotted border-border/80 translate-y-1" />
			<span className="shrink-0 font-mono text-sm tabular-nums text-primary">
				{symbol}{t.amount.toFixed(2)}
			</span>
			<button
				type="button"
				onClick={() => onDelete(t.id)}
				aria-label="delete expense"
				className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
			>
				<X className="h-3.5 w-3.5" />
			</button>
		</div>
	);
}

export function ExpenseFeed({
	transactions,
}: {
	transactions: Transaction[] | undefined;
}) {
	const { deleteTransactionMutation } = useDeleteTransaction();
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const { symbol } = useCurrency();

	function handleDelete(id: number) {
		setDeletingId(id);
		deleteTransactionMutation.mutate(id, {
			onSettled: () => setDeletingId(null),
		});
	}

	if (!transactions || transactions.length === 0) {
		return (
			<p className="py-16 text-center text-sm text-muted-foreground">
				nothing here yet — add your first expense above
			</p>
		);
	}

	const groups = new Map<string, Transaction[]>();
	for (const t of transactions) {
		const label = dayLabel(t.transaction_date);
		const list = groups.get(label) ?? [];
		list.push(t);
		groups.set(label, list);
	}

	return (
		<div>
			{[...groups.entries()].map(([label, items]) => (
				<section key={label} className="mb-6">
					<h2 className="mb-1 text-sm lowercase text-muted-foreground">
						{label}
					</h2>
					<div className="divide-y divide-border/60">
						{items.map((t) => (
							<div
								key={t.id}
								className={deletingId === t.id ? "opacity-40 transition-opacity" : "transition-opacity"}
							>
								<FeedRow t={t} onDelete={handleDelete} symbol={symbol} />
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
