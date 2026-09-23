"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, X } from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useTransactions } from "@/hooks/useTransactions";
import { z } from "zod";
import { PlanSchema } from "@/types";

type Plan = z.infer<typeof PlanSchema>;

function PlanCard({
	plan,
	spent,
	onDelete,
}: {
	plan: Plan;
	spent: number;
	onDelete: (id: number) => void;
}) {
	const budget = (plan.initial_budget as number) || 0;
	const left = budget - spent;
	const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;

	return (
		<div className="group relative rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40">
			<Link href={`/plan/${plan.name.replace(/ /g, "_")}?id=${plan.id}`} className="block">
				<p className="text-lg font-medium lowercase tracking-tight text-foreground">
					{plan.name}
				</p>
				<p className="mt-0.5 text-xs text-muted-foreground">
					since{" "}
					{plan.createdAt
						? new Date(plan.createdAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})
						: "—"}
				</p>
				<p className="mt-4 font-mono text-2xl font-semibold tabular-nums text-foreground">
					{budget > 0 ? `$${left.toFixed(2)}` : `$${spent.toFixed(2)}`}
					<span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
						{budget > 0 ? "left" : "spent"}
					</span>
				</p>
				{budget > 0 && (
					<div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
				)}
			</Link>
			<button
				type="button"
				onClick={() => onDelete(plan.id as number)}
				className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus:opacity-100 group-hover:opacity-100"
				aria-label={`delete ${plan.name}`}
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}

export default function Plans() {
	const { plansQuery, createPlanMutation, deletePlanMutation } = usePlan();
	const { data: plans, isLoading } = plansQuery;
	const { transactionsQuery } = useTransactions();
	const transactions = transactionsQuery.data;

	const [dialogOpen, setDialogOpen] = useState(false);
	const [name, setName] = useState("");
	const [budget, setBudget] = useState("");
	const [deleting, setDeleting] = useState<Plan | null>(null);

	const spentByPlan = new Map<number, number>();
	for (const t of transactions ?? []) {
		if (t.plan_id != null) {
			spentByPlan.set(t.plan_id, (spentByPlan.get(t.plan_id) ?? 0) + t.amount);
		}
	}

	function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		createPlanMutation.mutate(
			{
				name: name.trim(),
				initial_budget: isNaN(parseFloat(budget)) ? 0 : parseFloat(budget),
			} as Partial<Plan>,
			{
				onSuccess: () => {
					setDialogOpen(false);
					setName("");
					setBudget("");
				},
			},
		);
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-10">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-semibold lowercase tracking-tight text-foreground">
					plans
				</h1>
				<Button
					onClick={() => setDialogOpen(true)}
					className="bg-primary text-primary-foreground hover:bg-primary/90"
				>
					<Plus className="h-4 w-4" /> new
				</Button>
			</div>

			{isLoading ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} className="h-40 rounded-lg" />
					))}
				</div>
			) : Array.isArray(plans) && plans.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan: Plan) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							spent={spentByPlan.get(plan.id as number) ?? 0}
							onDelete={(id) =>
								setDeleting(plans.find((p: Plan) => p.id === id) ?? null)
							}
						/>
					))}
				</div>
			) : (
				<p className="py-16 text-center text-sm text-muted-foreground">
					no plans yet —{" "}
					<button
						className="text-primary underline underline-offset-4"
						onClick={() => setDialogOpen(true)}
					>
						start one
					</button>
				</p>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="lowercase">new plan</DialogTitle>
						<DialogDescription>
							a budget for something you want
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreate} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="plan-name">name</Label>
							<Input
								id="plan-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="japan trip"
								autoFocus
								required
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="plan-budget">budget</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-muted-foreground">
									$
								</span>
								<Input
									id="plan-budget"
									type="number"
									inputMode="decimal"
									value={budget}
									onChange={(e) => setBudget(e.target.value)}
									placeholder="2,000"
									className="pl-7 font-mono"
								/>
							</div>
						</div>
						<Button
							type="submit"
							className="bg-primary font-normal text-primary-foreground hover:bg-primary/90"
						>
							create
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deleting}
				onOpenChange={(open) => !open && setDeleting(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							delete {deleting?.name.toLowerCase()}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							this removes the plan and keeps its expenses in your history.
							this can&apos;t be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={() => {
								if (deleting)
									deletePlanMutation.mutate(deleting.id as number);
								setDeleting(null);
							}}
						>
							delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</main>
	);
}
