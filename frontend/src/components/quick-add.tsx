"use client";

import { useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BUILT_IN_CATEGORIES } from "@/lib/categories";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function QuickAdd({ planId }: { planId?: number }) {
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const [note, setNote] = useState("");
	const { createTransactionMutation } = useCreateTransaction();
	const { toast } = useToast();

	const active = amount.trim().length > 0;

	function submit() {
		const value = parseFloat(amount);
		if (!active || isNaN(value) || value <= 0) return;
		if (!category) {
			toast({ title: "pick a category first" });
			return;
		}
		createTransactionMutation.mutate(
			{
				amount: value,
				category_name: category,
				description: note.trim() || undefined,
				plan_id: planId ?? null,
				transaction_date: new Date().toISOString(),
			},
			{
				onSuccess: () => {
					setAmount("");
					setCategory(null);
					setNote("");
				},
				onError: () => {
					toast({ title: "could not save — try again" });
				},
			},
		);
	}

	return (
		<div className="w-full">
			<div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 h-14">
				<span className="font-mono text-lg text-primary select-none">$</span>
				<input
					value={amount}
					onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
					onKeyDown={(e) => e.key === "Enter" && submit()}
					inputMode="decimal"
					placeholder={active ? "" : "type an amount"}
					aria-label="amount"
					className="flex-1 bg-transparent outline-none font-mono text-lg tabular-nums placeholder:text-muted-foreground/70"
				/>
				{active && (
					<input
						value={note}
						onChange={(e) => setNote(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && submit()}
						placeholder="add a note"
						aria-label="note"
						className="w-40 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
					/>
				)}
			</div>

			<div
				className={cn(
					"grid grid-cols-4 sm:grid-cols-8 gap-2 overflow-hidden transition-all duration-300",
					active ? "mt-3 max-h-32 opacity-100" : "max-h-0 opacity-0",
				)}
			>
				{BUILT_IN_CATEGORIES.map((c) => (
					<button
						key={c.key}
						type="button"
						onClick={() => setCategory(c.key)}
						className={cn(
							"flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-2.5 transition-colors",
							category === c.key
								? "border-primary bg-primary/10"
								: "border-border hover:border-primary/50",
						)}
					>
						<c.icon
							className={cn(
								"h-4 w-4",
								category === c.key ? "text-primary" : "text-muted-foreground",
							)}
							strokeWidth={1.5}
						/>
						<span className="text-[11px] leading-none text-foreground">
							{c.label.split(" ")[0]}
						</span>
					</button>
				))}
			</div>

			{active && (
				<p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
					<CornerDownLeft className="h-3 w-3" /> enter to save
				</p>
			)}
		</div>
	);
}
