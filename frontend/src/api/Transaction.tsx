"use client";
import Cookies from "js-cookie";
// api/plans.ts
import { fetchGet, fetchPost } from "@/fetch/client";
import { PlanSchema, TransactionSchema } from "@/types";
import { z } from "zod";
type transaction = z.infer<typeof TransactionSchema>;
type FetchDeleteTransactionResponse = Partial<transaction> & {
	error?: string;
};

export const fetchUser = async (id: number | undefined) => {
	try {
		const response = await fetchGet(`plan/${id}`);
		return response;
		return response;
	} catch (error) {
		console.log("Error fetching plans:", error);
	}
	// return await fetchGet("plans");
};

type Plan = z.infer<typeof PlanSchema>;
export const createPlan = async (newPlan: Partial<Plan>) => {
	return await fetchPost("plan", newPlan);
};

export async function fetchDeleteTransaction(
	url: string,
): Promise<FetchDeleteTransactionResponse> {
	const jwt = Cookies.get("jwt");
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		if (!res.ok) {
			throw new Error("Cannot delete data");
		}

		const text = await res.text();
		return text ? JSON.parse(text) : null;
		// return await res.json(); // Or `return { success: true };` if no JSON response
	} catch (error) {
		console.error(error);
		return { error: "Error deleting data" };
	}
}
