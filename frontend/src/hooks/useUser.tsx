import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/User";

import useAuthStore from "@/zustand/auth";

export const useUser = () => {
	const users = useAuthStore((state) => state.user);
	const userId = users?.user_id;

	const userQuery = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			if (!userId) {
				return null; // Fallback when no userId
			}
			const result = await fetchUser();
			// console.log("Fetch Plans Result:", result);
			return result;
		},
		enabled: !!userId,
	});

	return { userQuery };
};
