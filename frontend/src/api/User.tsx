// api/plans.ts
import { fetchGet } from "@/fetch/client";

export const fetchUser = async () => {
	try {
		const response = await fetchGet(`user`);
		return response;
	} catch (error) {
		console.log("Error fetching user:", error);
	}
};

