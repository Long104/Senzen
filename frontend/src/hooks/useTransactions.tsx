"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGet, fetchPost, fetchUpdate, fetchDelete } from "@/fetch/client";
import useAuthStore from "@/zustand/auth";

export type Transaction = {
	id: number;
	user_id: number;
	plan_id: number | null;
	category_id: number | null;
	category_name: string | null;
	amount: number;
	transaction_date: string;
	description?: string;
	category?: { name: string } | null;
};

export function useTransactions() {
	const user = useAuthStore((state) => state.user);

	const transactionsQuery = useQuery({
		queryKey: ["transactions"],
		queryFn: async () => {
			const result = await fetchGet("transactions");
			return (result ?? []) as Transaction[];
		},
		enabled: !!user,
	});

	return { transactionsQuery };
}

export function useCreateTransaction() {
	const queryClient = useQueryClient();

	const createTransactionMutation = useMutation({
		mutationFn: (newTransaction: {
			amount: number;
			category_name: string;
			description?: string;
			plan_id?: number | null;
			transaction_date: string;
		}) => fetchPost("transaction", newTransaction),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["plans"] });
		},
	});

	return { createTransactionMutation };
}

export function useUpdateTransaction() {
	const queryClient = useQueryClient();

	const updateTransactionMutation = useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: number;
			amount?: number;
			description?: string;
			category_name?: string;
		}) => fetchUpdate("transactions", id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["plans"] });
		},
	});

	return { updateTransactionMutation };
}

export function useDeleteTransaction() {
	const queryClient = useQueryClient();

	const deleteTransactionMutation = useMutation({
		mutationFn: (id: number) => fetchDelete("transactions", id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["plans"] });
		},
	});

	return { deleteTransactionMutation };
}
