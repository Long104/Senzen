"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { addCustomCategory, CUSTOM_ICONS } from "@/lib/categories";
import { CURRENCIES, setCurrency, useCurrency } from "@/lib/currency";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryTiles } from "@/components/category-tiles";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";
import { cleanAmountInput } from "@/lib/amount";
import { cn } from "@/lib/utils";

export function QuickAdd({ planId }: { planId?: number }) {
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const [note, setNote] = useState("");
	const [addingCustom, setAddingCustom] = useState(false);
	const [customName, setCustomName] = useState("");
	const [customIcon, setCustomIcon] = useState<string>("coffee");
	const { createTransactionMutation } = useCreateTransaction();
	const { toast } = useToast();
	const { code, symbol } = useCurrency();

	const parsed = parseFloat(amount);
	const hasAmount = !isNaN(parsed) && parsed > 0;
	const active = amount.trim().length > 0;

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
		const key = addCustomCategory(customName, customIcon);
		if (key) {
			setCategory(key);
		}
		setCustomName("");
		setCustomIcon("coffee");
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
							className="flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-2 font-mono text-lg text-primary select-none transition-colors outline-none hover:bg-primary/5 hover:opacity-80 focus:outline-none focus-visible:outline-none"
						>
							{symbol}
							<ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2} />
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

				<span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

				<input
					value={amount}
					onChange={(e) => setAmount(cleanAmountInput(e.target.value))}
					inputMode="decimal"
					placeholder="0.00"
					aria-label="amount"
					className="min-w-0 w-32 shrink-0 bg-transparent outline-none font-mono text-lg tabular-nums placeholder:text-muted-foreground/70"
				/>

				<span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

				<input
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="note (e.g. eat out)"
					aria-label="note"
					className="min-w-0 flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70 pl-1"
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
				<CategoryTiles selected={category} onSelect={setCategory} />
				<button
					type="button"
					onClick={() => setAddingCustom(true)}
					className="flex flex-col items-center gap-1.5 rounded-full border border-dashed border-border bg-card px-3 py-2.5 transition-colors duration-200 hover:border-primary/50"
					aria-label="new category"
				>
					<Plus className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
					<span className="text-[11px] leading-none text-muted-foreground">new</span>
				</button>
			</div>

			{addingCustom && (
				<form onSubmit={saveCustom} className="mt-3 rounded-2xl border border-border bg-card p-3">
					<input
						value={customName}
						onChange={(e) => setCustomName(e.target.value)}
						placeholder="category name, e.g. coffee"
						autoFocus
						aria-label="new category name"
						className="w-full rounded-md border border-border bg-card px-3 h-9 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/50"
					/>
					<div className="mt-3 grid grid-cols-8 gap-1.5">
						{Object.entries(CUSTOM_ICONS).map(([key, Icon]) => {
							const picked = customIcon === key;
							return (
								<button
									key={key}
									type="button"
									onClick={() => setCustomIcon(key)}
									aria-label={key}
									className={cn(
										"flex h-9 items-center justify-center rounded-full border transition-colors duration-200",
										picked
											? "border-primary bg-primary/10 text-primary"
											: "border-transparent text-muted-foreground hover:border-border",
									)}
								>
									<Icon className="h-4 w-4" strokeWidth={1.5} />
								</button>
							);
						})}
					</div>
					<div className="mt-3 flex gap-2">
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
					</div>
				</form>
			)}
		</div>
	);
}
