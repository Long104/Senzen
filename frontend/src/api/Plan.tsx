// api/plans.ts
import { fetchGet, fetchPost } from "@/fetch/client";
import { PlanSchema } from "@/types";
import { z } from "zod";
type Plan = z.infer<typeof PlanSchema>;

export const fetchPlans = async () => {
	try {
		const response = await fetchGet(`plans`);
		return response;
	} catch (error) {
		console.log("Error fetching plans:", error);
	}
};

export const fetchPlan = async (id: string | null) => {
	try {
		const response = await fetchGet(`plan/${id}`);
		return response;
		return response;
	} catch (error) {
		console.log("Error fetching plans:", error);
	}
	// return await fetchGet("plans");
};

export const createPlan = async (newPlan: Partial<Plan>) => {
	return await fetchPost("plan", newPlan);
};
