import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, fetchPlans, fetchPlan } from "@/api/Plan";
import { fetchDelete } from "@/fetch/client";
import { PlanSchema } from "@/types";
import { z } from "zod";

import useAuthStore from "@/zustand/auth";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

export const usePlanById = () => {
	const searchParams = useSearchParams();
	const planId = searchParams.get("id");
	return useQuery({
		queryKey: ["plans", planId],
		queryFn: async () => fetchPlan(planId),
		enabled: !!planId, // Only fetch if planId is truthy
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});
};

export const usePlan = () => {
	const queryClient = useQueryClient();
	const users = useAuthStore((state) => state.user);
	const userId = users?.user_id;
	type Plan = z.infer<typeof PlanSchema>;

	// const planQuery = useQuery({
	// 	queryKey: ["plans", planId],
	// 	queryFn: async () => {
	// 		const result = await fetchPlan(planId);
	// 		console.log("Fetch Plans Result:", result);
	// 		return result;
	// 	},
	// 	enabled: !!planId,
	// 	// enabled: true,
	// 	staleTime: 1000 * 60 * 5, // 5 minutes
	// });

	const plansQuery = useQuery({
		queryKey: ["plans"],

		queryFn: async () => {
			if (!userId) {
				return null; // Fallback when no userId
			}
			const result = await fetchPlans();
			// console.log("Fetch Plans Result:", result);
			return result;
		},
		enabled: !!userId, // Only fetch if userId is truthy
	});

	// Create a new plan
	const createPlanMutation = useMutation({
		mutationFn: (newPlan: Partial<Plan>) => createPlan(newPlan),
		onSuccess: (data) => {
			// Correctly invalidate the query
			queryClient.setQueryData(["plans"], (oldData: any) => {
				if (oldData) {
					return [...oldData, data];
				}
				return [data];
			});
			queryClient.invalidateQueries({
				queryKey: ["plans"],
			});
		},
		onError: (error) => {
			console.log("this is error", error);
		},
	});

	const deletePlanMutation = useMutation({
		mutationFn: (id: number) => fetchDelete(`plan`, id), // Your delete API call
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["plans"] });
			queryClient.invalidateQueries({ queryKey: ["plans", userId] });
		},
		onError: (error) => {
			console.error("Failed to delete plan:", error);
		},
	});

	return { plansQuery, createPlanMutation, deletePlanMutation };
};
