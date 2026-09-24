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

function cleanAmountInput(raw: string): string {
	const stripped = raw.replace(/[^0-9.]/g, "");
	const firstDot = stripped.indexOf(".");
	if (firstDot === -1) return stripped;
	return (
		stripped.slice(0, firstDot + 1) +
		stripped.slice(firstDot + 1).replace(/\./g, "")
	);
}

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

	const parsed = parseFloat(amount);
	const hasAmount = !isNaN(parsed) && parsed > 0;
	const active = amount.trim().length > 0;
	const allCategories = [...BUILT_IN_CATEGORIES.map((c) => c.key), ...customs];

	function ensureCustoms() {
		if (customs.length === 0 && typeof window !== "undefined") {
			setCustoms(getCustomCategories());
		}
	}

	function submit() {
		if (!active || isNaN(parsed) || parsed <= 0) {
			toast({ title: "type a number please" });
			return;
		}
		if (!category) {
			toast({ title: "pick a category first" });
			return;
		}
		createTransactionMutation.mutate(
			{
				amount: parsed,
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
			<div className="flex items-center gap-3 rounded-full border border-border bg-card h-16 pl-5 pr-2 shadow-[0_2px_12px_rgba(16,21,22,0.05)] transition-colors focus-within:border-primary/60">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							aria-label="change currency"
							title={`change currency · ${code}`}
							className="font-mono text-lg text-primary select-none transition-opacity hover:opacity-70"
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
						setAmount(cleanAmountInput(e.target.value));
						ensureCustoms();
					}}
					inputMode="decimal"
					placeholder="0.00"
					aria-label="amount"
					className="min-w-0 w-20 shrink-0 bg-transparent outline-none font-mono text-lg tabular-nums placeholder:text-muted-foreground/70"
				/>

				<span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

				<input
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="what was it for?"
					aria-label="note"
					className="min-w-0 flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
				/>

				<button
					type="button"
					onClick={submit}
					disabled={createTransactionMutation.isPending}
					aria-label="add expense"
					className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
				>
					<Plus className={cn("h-5 w-5 transition-transform duration-300", hasAmount && category && "rotate-90")} />
				</button>
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
								"flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-2.5 transition-all duration-200 hover:-translate-y-0.5",
								selected
									? "border-primary bg-primary/10 scale-[1.03]"
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
					className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-2 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50"
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
