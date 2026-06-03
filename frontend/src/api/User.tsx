// api/plans.ts
import { fetchGet } from "@/fetch/client";

export const fetchUser = async (id:number | undefined) => {
	try {
		const response = await fetchGet(`user/${id}`);
		return response;
		return response;
	} catch (error) {
		console.log("Error fetching plans:", error);
	}
	// return await fetchGet("plans");
};

