import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  fetchGet, fetchPost } from "@/fetch/client";
import { fetchDeleteTransaction } from "@/api/Transaction";
import { TransactionSchema } from "@/types";
import { z } from "zod";

import { useSearchParams } from "next/navigation";
import useAuthStore from "@/zustand/auth";
export const useEachPlan = () => {
	const queryClient = useQueryClient();
	const users = useAuthStore((state) => state.user);
	const userId = users?.user_id;
	type transaction = z.infer<typeof TransactionSchema>;
	const searchParams = useSearchParams();
	const planId = searchParams.get("id");

	const eachPlanQuery = () =>
		useQuery({
			queryKey: ["plans", planId],
			queryFn: async () => {
				if (!userId || !planId) {
					return null; // Fallback when no userId
				}
				const result = await fetchGet(`plan/${planId}`);
				console.log("Fetch Plans Result:", result);
				return result;
			},

			enabled: !!userId && !!planId, // Only fetch if userId is truthy
		});

	// Create a new plan
	const createTransactionMutation = useMutation({
		mutationFn: async ({
			planId,
			newTransaction,
		}: { planId: string | null; newTransaction: Partial<transaction> }) => {
			// await fetchPost(`category?user_id=${userId}&plan_id=${planId}`, {
			await fetchPost(`transaction`, {
				...newTransaction, // Spread the newCategory data
				plan_id: Number(planId), // Add plan_id to the request body
				// user_id comes from JWT on the backend
			});
			console.log("this is new transaction", newTransaction);
		},
		onSuccess: () => {
			// Correctly invalidate the query
			// queryClient.setQueryData(["plans", planId], (oldData: any) => {
			// 	if (oldData) {
			// 		return [...oldData, data];
			// 	}
			// 	return [data];
			// });
			// queryClient.invalidateQueries({ queryKey: ["plans"], exact: true });
			queryClient.invalidateQueries({ queryKey: ["plans",planId] });
		},
	});

	const deleteTransactionMutation = useMutation({
		mutationFn: ({
			planId,
			transactionId,
		}: { planId: string | null; transactionId: number }) =>
			fetchDeleteTransaction(
				// `transaction?user_id=${userId}&plan_id=${planId}&category_id=${categoryId}`,
				`transaction?plan_id=${planId}&transaction_id=${transactionId}`,
			), // Your delete API call
		onSuccess: () => {
			// After successfully deleting a plan, invalidate the 'plans' query

			queryClient.removeQueries({ queryKey: ["plans", planId] });
			queryClient.invalidateQueries({ queryKey: ["plans"], exact: true });
		},
		onError: (error) => {
			console.error("Failed to delete plan:", error);
		},
	});

	return {
		eachPlanQuery,
		createTransactionMutation,
		deleteTransactionMutation,
	};
};
