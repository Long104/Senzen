"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryTiles } from "@/components/category-tiles";
import { type Transaction, useUpdateTransaction } from "@/hooks/useTransactions";
import { useCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { cleanAmountInput } from "@/lib/amount";

// Edit dialog for one expense — amount, note, category.
// Owner, plan and date are untouched; save is button-only (no Enter), per capture bar.
export function EditExpense({
	tx,
	open,
	onOpenChange,
}: {
	tx: Transaction | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const { updateTransactionMutation } = useUpdateTransaction();
	const { toast } = useToast();
	const { symbol } = useCurrency();

	useEffect(() => {
		if (tx) {
			setAmount(String(tx.amount));
			setNote(tx.description ?? "");
			setCategory(tx.category_name || tx.category?.name || null);
		}
	}, [tx]);

	function save() {
		if (!tx) return;
		const parsed = parseFloat(amount);
		if (isNaN(parsed) || parsed <= 0) {
			toast({ title: "type a number please" });
			return;
		}
		if (!category) {
			toast({ title: "pick a category first" });
			return;
		}
		updateTransactionMutation.mutate(
			{
				id: tx.id,
				amount: parsed,
				description: note.trim(),
				category_name: category,
			},
			{
				onSuccess: () => onOpenChange(false),
				onError: () => {
					toast({ title: "could not save — try again" });
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle className="lowercase">edit expense</DialogTitle>
					<DialogDescription>
						fix a typo or recategorize — nothing else changes
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="edit-amount">amount</Label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-muted-foreground">
								{symbol}
							</span>
							<Input
								id="edit-amount"
								inputMode="decimal"
								value={amount}
								onChange={(e) => setAmount(cleanAmountInput(e.target.value))}
								className="pl-7 font-mono tabular-nums"
								autoFocus
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="edit-note">note</Label>
						<Input
							id="edit-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="note (e.g. eat out)"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>category</Label>
						<div className="grid grid-cols-4 gap-2">
							<CategoryTiles selected={category} onSelect={setCategory} />
						</div>
					</div>

					<Button
						type="button"
						onClick={save}
						disabled={updateTransactionMutation.isPending}
						className="bg-primary font-normal text-primary-foreground hover:bg-primary/90"
					>
						save
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
