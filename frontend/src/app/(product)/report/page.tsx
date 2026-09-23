"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";

type Plan = z.infer<typeof PlanSchema>;
type Mode = "month" | "year" | "all";

const chartConfig = {
	spent: { label: "spent", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

function monthKey(d: Date) {
	return `${d.getFullYear()}-${d.getMonth()}`;
}

function sameMonth(a: Date, b: Date) {
	return monthKey(a) === monthKey(b);
}

export default function ReportPage() {
	const [mode, setMode] = useState<Mode>("month");
	const [offset, setOffset] = useState(0);
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
	const { symbol } = useCurrency();
	const { transactionsQuery } = useTransactions();
	const { plansQuery } = usePlan();
	const transactions = transactionsQuery.data ?? [];
	const plans = (plansQuery.data ?? []) as Plan[];

	const now = new Date();
	const viewDate = useMemo(() => {
		if (mode === "all") return now;
		const d = new Date();
		d.setMonth(d.getMonth() + offset);
		return d;
	}, [mode, offset]);

	const view = useMemo(() => {
		const inWindow = transactions.filter((t) => {
			const d = new Date(t.transaction_date);
			if (mode === "month") return sameMonth(d, viewDate);
			if (mode === "year") return d.getFullYear() === viewDate.getFullYear();
			return true;
		});

		const inPrev = transactions.filter((t) => {
			const d = new Date(t.transaction_date);
			if (mode === "month") {
				const p = new Date(viewDate);
				p.setMonth(p.getMonth() - 1);
				return sameMonth(d, p);
			}
			if (mode === "year") return d.getFullYear() === viewDate.getFullYear() - 1;
			return false;
		});

		const total = inWindow.reduce((s, t) => s + t.amount, 0);
		const prevTotal = inPrev.reduce((s, t) => s + t.amount, 0);

		const byCat = new Map<string, number>();
		for (const t of inWindow) {
			const key = t.category_name || t.category?.name || "other";
			byCat.set(key, (byCat.get(key) ?? 0) + t.amount);
		}
		const categoryTotals = [...byCat.entries()]
			.map(([key, catTotal]) => ({ key, total: catTotal, meta: categoryMeta(key) }))
			.sort((a, b) => b.total - a.total);

		let series: { label: string; spent: number }[] = [];
		if (mode === "month") {
			const daysInMonth = new Date(
				viewDate.getFullYear(),
				viewDate.getMonth() + 1,
				0,
			).getDate();
			series = Array.from({ length: daysInMonth }, (_, i) => ({
				label: String(i + 1),
				spent: 0,
			}));
			for (const t of inWindow) {
				series[new Date(t.transaction_date).getDate() - 1].spent += t.amount;
			}
		} else {
			const byMonth = new Map<string, number>();
			for (const t of transactions) {
				const d = new Date(t.transaction_date);
				if (mode === "year" && d.getFullYear() !== viewDate.getFullYear()) continue;
				const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
				byMonth.set(key, (byMonth.get(key) ?? 0) + t.amount);
			}
			const keys = [...byMonth.keys()].sort();
			if (mode === "year") {
				series = Array.from({ length: 12 }, (_, i) => ({
					label: new Date(viewDate.getFullYear(), i, 1)
						.toLocaleDateString("en-US", { month: "short" })
						.toLowerCase(),
					spent: byMonth.get(`${viewDate.getFullYear()}-${String(i).padStart(2, "0")}`) ?? 0,
				}));
			} else {
				series = keys.map((k) => ({
					label: new Date(`${k}-01T00:00:00`)
						.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
						.toLowerCase(),
					spent: byMonth.get(k) ?? 0,
				}));
			}
		}

		const firstDate = transactions.length
			? new Date(
					Math.min(
						...transactions.map((t) => new Date(t.transaction_date).getTime()),
					),
				)
			: null;

		return { inWindow, total, prevTotal, categoryTotals, series, firstDate };
	}, [transactions, viewDate, mode]);

	const title =
		mode === "month"
			? viewDate.toLocaleDateString("en-US", { month: "long" }).toLowerCase() +
				(viewDate.getFullYear() !== now.getFullYear() ? ` ${viewDate.getFullYear()}` : "")
			: mode === "year"
				? String(viewDate.getFullYear())
				: "all time";

	const prevLabel =
		mode === "month"
			? new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
					.toLocaleDateString("en-US", { month: "long" })
					.toLowerCase()
			: mode === "year"
				? String(viewDate.getFullYear() - 1)
				: null;

	const delta =
		mode !== "all" && view.prevTotal > 0
			? ((view.total - view.prevTotal) / view.prevTotal) * 100
			: null;

	const maxCat = view.categoryTotals[0]?.total ?? 1;

	const spentByPlan = new Map<number, number>();
	for (const t of transactions) {
		if (t.plan_id != null) {
			spentByPlan.set(t.plan_id, (spentByPlan.get(t.plan_id) ?? 0) + t.amount);
		}
	}

	function jumpToMonth(seriesIndex: number) {
		if (mode === "year") {
			setMode("month");
			const target = new Date(viewDate.getFullYear(), seriesIndex, 1);
			setOffset(
				(target.getFullYear() - now.getFullYear()) * 12 +
					(target.getMonth() - now.getMonth()),
			);
		}
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-10">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					{mode !== "all" && (
						<button
							type="button"
							onClick={() => setOffset((o) => o - (mode === "year" ? 12 : 1))}
							aria-label="previous"
							className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
					)}
					<h1 className="text-2xl font-semibold lowercase tracking-tight text-foreground">
						{title}
					</h1>
					{mode !== "all" && (
						<button
							type="button"
							onClick={() => setOffset((o) => Math.min(o + (mode === "year" ? 12 : 1), 0))}
							disabled={offset >= 0}
							aria-label="next"
							className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					)}
				</div>
				<div className="flex rounded-lg border border-border bg-card p-0.5">
					{(["month", "year", "all"] as Mode[]).map((m) => (
						<button
							key={m}
							type="button"
							onClick={() => {
								setMode(m);
								setExpandedCategory(null);
								setOffset(0);
							}}
							className={cn(
								"rounded-md px-3 py-1 text-sm lowercase transition-colors",
								mode === m
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{m}
						</button>
					))}
				</div>
			</div>

			<p className="mt-4 font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground">
				{symbol}{view.total.toFixed(2)}{" "}
				<span className="font-sans text-xl font-normal text-muted-foreground">
					spent
				</span>
			</p>
			{delta !== null && prevLabel && (
				<p className="mt-1 text-sm text-muted-foreground">
					{delta <= 0 ? "↓" : "↑"} {Math.abs(delta).toFixed(0)}% vs {prevLabel}
				</p>
			)}
			{mode === "all" && view.firstDate && (
				<p className="mt-1 text-sm text-muted-foreground">
					since{" "}
					{view.firstDate
						.toLocaleDateString("en-US", { month: "long", year: "numeric" })
						.toLowerCase()}{" "}
					· {transactions.length} expenses
				</p>
			)}

			<div className="mt-10 grid gap-10 md:grid-cols-2">
				<section>
					<h2 className="mb-3 text-sm lowercase text-muted-foreground">
						by category
					</h2>
					{view.categoryTotals.length === 0 ? (
						<p className="py-8 text-sm text-muted-foreground">nothing here</p>
					) : (
						<div className="flex flex-col">
							{view.categoryTotals.map(({ key, total, meta }) => {
								const expanded = expandedCategory === key;
								const items = view.inWindow.filter(
									(t) => (t.category_name || t.category?.name || "other") === key,
								);
								return (
									<div key={key}>
										<button
											type="button"
											onClick={() => setExpandedCategory(expanded ? null : key)}
											className="group flex w-full items-center gap-3 rounded-md py-2.5 text-left transition-colors hover:bg-muted/50"
										>
											<meta.icon
												className="h-4 w-4 shrink-0 text-muted-foreground"
												strokeWidth={1.5}
											/>
											<span className="w-24 shrink-0 truncate text-sm text-foreground">
												{meta.label}
											</span>
											<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
												<div
													className="h-full rounded-full bg-primary transition-all"
													style={{ width: `${(total / maxCat) * 100}%` }}
												/>
											</div>
											<span className="w-20 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
												{symbol}{total.toFixed(2)}
											</span>
											<ChevronDown
												className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
											/>
										</button>
										{expanded && (
											<div className="mb-2 ml-11 divide-y divide-border/60 border-l border-border pl-4">
												{items.map((t) => (
													<div key={t.id} className="flex items-center gap-3 py-2">
														<span className="min-w-0 flex-1 truncate text-sm text-foreground">
															{t.description ||
																new Date(t.transaction_date).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																})}
														</span>
														<span className="shrink-0 font-mono text-sm tabular-nums text-primary">
															{symbol}{t.amount.toFixed(2)}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</section>

				<section>
					<h2 className="mb-3 text-sm lowercase text-muted-foreground">
						{mode === "month" ? "daily rhythm" : mode === "year" ? "months" : "every month"}
					</h2>
					<ChartContainer config={chartConfig} className="h-40 w-full">
						<BarChart
							data={view.series}
							margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
							onClick={(state) => {
								if (state?.activeTooltipIndex != null) {
									jumpToMonth(state.activeTooltipIndex);
								}
							}}
						>
							<CartesianGrid vertical={false} stroke="hsl(var(--border))" />
							<XAxis
								dataKey="label"
								tickLine={false}
								axisLine={false}
								tickMargin={6}
								interval={mode === "month" ? 4 : "preserveStartEnd"}
								tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
							/>
							<ChartTooltip
								cursor={{ fill: "hsl(var(--muted))" }}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar dataKey="spent" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
						</BarChart>
					</ChartContainer>
					{mode === "year" && (
						<p className="mt-2 text-xs text-muted-foreground">
							click a month to open it
						</p>
					)}
				</section>
			</div>

			{plans.length > 0 && (
				<section className="mt-12">
					<h2 className="mb-3 text-sm lowercase text-muted-foreground">
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
											? `${symbol}${(budget - spent).toFixed(2)} left`
											: `${symbol}${spent.toFixed(2)} spent`}
									</span>
								</Link>
							);
						})}
					</div>
				</section>
			)}
		</main>
	);
}
