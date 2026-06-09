import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  fetchGet, fetchPost } from "@/fetch/client";
import { fetchDeleteCategory } from "@/api/Category";
import { useSearchParams } from "next/navigation";

import useAuthStore from "@/zustand/auth";
export const useCategory = () => {
	const queryClient = useQueryClient();
	const users = useAuthStore((state) => state.user);
	const userId = users?.user_id;
	const searchParams = useSearchParams();
	const planId = searchParams.get("id");

	const categoriesQuery = () =>
		useQuery({
			queryKey: ["categories", planId],
			queryFn: async () => {
				if (!userId) {
					return null; // Fallback when no userId
				}
				const result = await fetchGet(
					`categories?plan_id=${planId}`,
					// `categories?user_id=${userId},plan_id=${planId}`,

					// `categories`,
				);
				// console.log("Fetch Plans Result:", result);
				return result;
			},

			enabled: !!userId && !!planId,
		});

	const createCategoryMutation = useMutation({
		mutationFn: async ({ newCategory }: { newCategory: Partial<any> }) =>
			await fetchPost(`category`, {
				...newCategory, // Spread the newCategory data
				plan_id: Number(planId), // Add plan_id to the request body
				// user_id comes from JWT on the backend
			}),
		onSuccess: (newCategoryData) => {
			// Get the current cached categories data
			queryClient.setQueryData(["categories", planId], (oldData: any) => {
				if (newCategoryData.error) {
					return console.log(newCategoryData.error);
				}
				if (oldData && Array.isArray(oldData)) {
					return [...oldData, newCategoryData]; // Add the new category to the old data
				}
				return [newCategoryData]; // If no old data, return the new category
			});
			console.log("new category data", newCategoryData);
			// queryClient.invalidateQueries({ queryKey: ["categories"], exact: true });
			// queryClient.invalidateQueries({ queryKey: ["categories",planId] });
		},
		onError: (error) => {
			console.error("Failed to create category:", error);
		},
	});

	const deleteCategoryMutation = useMutation({
		mutationFn: ({
			// planId,
			categoryId,
		}: { planId: string | null; categoryId: number }) =>
			fetchDeleteCategory(
				`category?plan_id=${planId}&category_id=${categoryId}`,
			), // Your delete API call
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["categories", planId] });
			// queryClient.invalidateQueries({ queryKey: ["categories"], exact: true });
		},
		onError: (error) => {
			console.error("Failed to delete plan:", error);
		},
	});

	return { categoriesQuery, createCategoryMutation, deleteCategoryMutation };
};
