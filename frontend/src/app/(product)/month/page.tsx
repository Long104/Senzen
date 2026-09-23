"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { QuickAdd } from "@/components/quick-add";
import { useTransactions } from "@/hooks/useTransactions";
import { usePlan } from "@/hooks/usePlan";
import { categoryMeta } from "@/lib/categories";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import Link from "next/link";
import { z } from "zod";
import { PlanSchema } from "@/types";

type Plan = z.infer<typeof PlanSchema>;

const chartConfig = {
	spent: { label: "spent", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

function monthKey(d: Date) {
	return `${d.getFullYear()}-${d.getMonth()}`;
}

export default function MonthPage() {
	const [offset, setOffset] = useState(0);
	const { transactionsQuery } = useTransactions();
	const { plansQuery } = usePlan();
	const transactions = transactionsQuery.data ?? [];
	const plans = (plansQuery.data ?? []) as Plan[];

	const viewDate = useMemo(() => {
		const d = new Date();
		d.setMonth(d.getMonth() + offset);
		return d;
	}, [offset]);

	const { monthTx, prevTotal, monthTotal, categoryTotals, daily } =
		useMemo(() => {
			const monthTx = transactions.filter((t) => {
				const d = new Date(t.transaction_date);
				return monthKey(d) === monthKey(viewDate);
			});
			const prevTx = transactions.filter((t) => {
				const d = new Date(t.transaction_date);
				const p = new Date(viewDate);
				p.setMonth(p.getMonth() - 1);
				return monthKey(d) === monthKey(p);
			});

			const monthTotal = monthTx.reduce((s, t) => s + t.amount, 0);
			const prevTotal = prevTx.reduce((s, t) => s + t.amount, 0);

			const byCat = new Map<string, number>();
			for (const t of monthTx) {
				const key = t.category_name || t.category?.name || "other";
				byCat.set(key, (byCat.get(key) ?? 0) + t.amount);
			}
			const categoryTotals = [...byCat.entries()]
				.map(([key, total]) => ({ key, total, meta: categoryMeta(key) }))
				.sort((a, b) => b.total - a.total);

			const daysInMonth = new Date(
				viewDate.getFullYear(),
				viewDate.getMonth() + 1,
				0,
			).getDate();
			const daily = Array.from({ length: daysInMonth }, (_, i) => ({
				day: i + 1,
				spent: 0,
			}));
			for (const t of monthTx) {
				const d = new Date(t.transaction_date);
				if (d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth()) {
					daily[d.getDate() - 1].spent += t.amount;
				}
			}

			return { monthTx, prevTotal, monthTotal, categoryTotals, daily };
		}, [transactions, viewDate]);

	const monthName = viewDate.toLocaleDateString("en-US", { month: "long" });
	const prevName = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
		.toLocaleDateString("en-US", { month: "long" })
		.toLowerCase();
	const delta = prevTotal > 0 ? ((monthTotal - prevTotal) / prevTotal) * 100 : null;
	const maxCat = categoryTotals[0]?.total ?? 1;

	const spentByPlan = new Map<number, number>();
	for (const t of transactions) {
		if (t.plan_id != null) {
			spentByPlan.set(t.plan_id, (spentByPlan.get(t.plan_id) ?? 0) + t.amount);
		}
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-10">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setOffset((o) => o - 1)}
					aria-label="previous month"
					className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>
				<h1 className="text-2xl font-semibold lowercase tracking-tight text-foreground">
					{monthName.toLowerCase()}
					{viewDate.getFullYear() !== new Date().getFullYear() &&
						` ${viewDate.getFullYear()}`}
				</h1>
				<button
					type="button"
					onClick={() => setOffset((o) => Math.min(o + 1, 0))}
					disabled={offset >= 0}
					aria-label="next month"
					className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>

			<p className="mt-4 font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground">
				${monthTotal.toFixed(2)}{" "}
				<span className="font-sans text-xl font-normal text-muted-foreground">
					spent
				</span>
			</p>
			{delta !== null && (
				<p className="mt-1 text-sm text-muted-foreground">
					{delta <= 0 ? "↓" : "↑"} {Math.abs(delta).toFixed(0)}% vs {prevName}
				</p>
			)}

			<div className="mt-10 grid gap-10 md:grid-cols-2">
				<section>
					<h2 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
						by category
					</h2>
					{categoryTotals.length === 0 ? (
						<p className="py-8 text-sm text-muted-foreground">
							nothing this month
						</p>
					) : (
						<div className="flex flex-col gap-3">
							{categoryTotals.map(({ key, total, meta }) => (
								<div key={key} className="flex items-center gap-3">
									<meta.icon
										className="h-4 w-4 shrink-0 text-muted-foreground"
										strokeWidth={1.5}
									/>
									<span className="w-28 shrink-0 truncate text-sm text-foreground">
										{meta.label}
									</span>
									<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-primary"
											style={{ width: `${(total / maxCat) * 100}%` }}
										/>
									</div>
									<span className="w-20 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
										${total.toFixed(2)}
									</span>
								</div>
							))}
						</div>
					)}
				</section>

				<section>
					<h2 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
						daily rhythm
					</h2>
					<ChartContainer config={chartConfig} className="h-40 w-full">
						<BarChart data={daily} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
							<CartesianGrid vertical={false} stroke="hsl(var(--border))" />
							<XAxis
								dataKey="day"
								tickLine={false}
								axisLine={false}
								tickMargin={6}
								interval={4}
								tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
							/>
							<ChartTooltip
								cursor={{ fill: "hsl(var(--muted))" }}
								content={<ChartTooltipContent labelFormatter={(d) => `day ${d}`} />}
							/>
							<Bar dataKey="spent" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
						</BarChart>
					</ChartContainer>
				</section>
			</div>

			{plans.length > 0 && (
				<section className="mt-12">
					<h2 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
						plans
					</h2>
					<div className="flex flex-col gap-3">
						{plans.map((plan) => {
							const budget = (plan.initial_budget as number) || 0;
							const spent = spentByPlan.get(plan.id as number) ?? 0;
							const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;
							return (
								<Link
									key={plan.id}
									href={`/plan/${plan.name.replace(/ /g, "_")}?id=${plan.id}`}
									className="flex items-center gap-3 rounded-md px-1 py-1 transition-colors hover:bg-muted/60"
								>
									<span className="w-28 shrink-0 truncate text-sm lowercase text-foreground">
										{plan.name}
									</span>
									<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-primary"
											style={{ width: `${progress * 100}%` }}
										/>
									</div>
									<span className="w-32 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
										{budget > 0
											? `$${(budget - spent).toFixed(2)} left`
											: `$${spent.toFixed(2)} spent`}
									</span>
								</Link>
							);
						})}
					</div>
				</section>
			)}

			{monthKey(viewDate) === monthKey(new Date()) && (
				<div className="mt-12">
					<QuickAdd />
				</div>
			)}
		</main>
	);
}
