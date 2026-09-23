"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BUILT_IN_CATEGORIES, addCustomCategory, getCustomCategories } from "@/lib/categories";
import { CURRENCIES, setCurrency, useCurrency } from "@/lib/currency";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function QuickAdd({ planId }: { planId?: number }) {
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const [note, setNote] = useState("");
	const [customs, setCustoms] = useState<string[]>([]);
	const [addingCustom, setAddingCustom] = useState(false);
	const [customName, setCustomName] = useState("");
	const { createTransactionMutation } = useCreateTransaction();
	const { toast } = useToast();
	const { code, symbol } = useCurrency();

	const active = amount.trim().length > 0;
	const allCategories = [...BUILT_IN_CATEGORIES.map((c) => c.key), ...customs];

	function ensureCustoms() {
		if (customs.length === 0 && typeof window !== "undefined") {
			setCustoms(getCustomCategories());
		}
	}

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

	function saveCustom(e: React.FormEvent) {
		e.preventDefault();
		const key = addCustomCategory(customName);
		if (key) {
			setCustoms(getCustomCategories());
			setCategory(key);
		}
		setCustomName("");
		setAddingCustom(false);
	}

	return (
		<div className="w-full">
			<div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 h-14">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							aria-label="change currency"
							title={code}
							className="font-mono text-lg text-primary select-none hover:text-primary/80"
						>
							{symbol}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{CURRENCIES.map((c) => (
							<DropdownMenuItem
								key={c.code}
								onClick={() => setCurrency(c.code)}
								className={c.code === code ? "text-primary" : ""}
							>
								<span className="w-6 font-mono">{c.symbol}</span> {c.code}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<input
					value={amount}
					onChange={(e) => {
						setAmount(e.target.value.replace(/[^0-9.]/g, ""));
						ensureCustoms();
					}}
					inputMode="decimal"
					placeholder={active ? "" : "type an amount"}
					aria-label="amount"
					className="min-w-0 flex-1 bg-transparent outline-none font-mono text-lg tabular-nums placeholder:text-muted-foreground/70"
				/>
				{active && (
					<input
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="add a note"
						aria-label="note"
						className="hidden sm:block w-40 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
					/>
				)}
				{active && (
					<button
						type="button"
						onClick={submit}
						disabled={createTransactionMutation.isPending}
						className="shrink-0 rounded-md bg-primary px-4 h-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						add
					</button>
				)}
			</div>

			<div
				className={cn(
					"grid grid-cols-4 sm:grid-cols-8 gap-2 overflow-hidden transition-all duration-300",
					active ? "mt-3 max-h-64 opacity-100" : "max-h-0 opacity-0",
				)}
			>
				{allCategories.map((key) => {
					const meta = BUILT_IN_CATEGORIES.find((c) => c.key === key);
					const label = meta ? meta.label : key;
					const selected = category === key;
					return (
						<button
							key={key}
							type="button"
							onClick={() => setCategory(key)}
							className={cn(
								"flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-2.5 transition-colors",
								selected
									? "border-primary bg-primary/10"
									: "border-border hover:border-primary/50",
							)}
						>
							{meta ? (
								<meta.icon
									className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")}
									strokeWidth={1.5}
								/>
							) : (
								<span className={cn("h-4 w-4 text-center text-sm leading-4", selected ? "text-primary" : "text-muted-foreground")}>
									{label[0]}
								</span>
							)}
							<span className="text-[11px] leading-none text-foreground">
								{label.split(" ")[0]}
							</span>
						</button>
					);
				})}
				<button
					type="button"
					onClick={() => {
						ensureCustoms();
						setAddingCustom(true);
					}}
					className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-2 py-2.5 transition-colors hover:border-primary/50"
					aria-label="new category"
				>
					<Plus className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
					<span className="text-[11px] leading-none text-muted-foreground">new</span>
				</button>
			</div>

			{addingCustom && (
				<form onSubmit={saveCustom} className="mt-2 flex gap-2">
					<input
						value={customName}
						onChange={(e) => setCustomName(e.target.value)}
						placeholder="category name, e.g. coffee"
						autoFocus
						aria-label="new category name"
						className="flex-1 rounded-md border border-border bg-card px-3 h-9 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/50"
					/>
					<button
						type="submit"
						className="rounded-md bg-primary px-4 h-9 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						save
					</button>
					<button
						type="button"
						onClick={() => setAddingCustom(false)}
						className="rounded-md border border-border px-3 h-9 text-sm text-muted-foreground hover:text-foreground"
					>
						cancel
					</button>
				</form>
			)}
		</div>
	);
}
