import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure it's imported correctly
import { persist, createJSONStorage } from "zustand/middleware";

// Define types for User and AuthState
type User = {
	user_id: number;
	exp: number;
	name: string;
	email: string;
	role: string;
} | null;

interface AuthState {
	user: User;
	jwt: string | null;
	login: (token: string) => void;
	logout: () => Promise<void>;
}

// Create the Zustand store
const useAuthStore = create(
	persist<AuthState>(
		(set, get) => ({
			user: null,
			jwt: null,
			login: (token: string) => {
				const currentState = get(); // Access current state
				if (currentState.jwt && currentState.user) {
					console.log("User is already logged in");
					return;
				}
				Cookies.set("jwt", token);
				try {
					const decodedUser = jwtDecode<User>(token);
					set({ user: decodedUser, jwt: token });
				} catch (error) {
					console.error("Error decoding JWT:", error);
					useAuthStore.getState().logout();
				}
			},
			logout: async () => {
				// jwt is HttpOnly (set by the backend) — only the server can
				// clear it. POST /logout → ClearCookie("jwt") on the API.
				try {
					await fetch(process.env.NEXT_PUBLIC_BACKEND + "/logout", {
						method: "POST",
						credentials: "include",
					});
				} catch (error) {
					console.error("Logout error:", error);
				}
				Cookies.remove("jwt"); // best-effort; real clear is server-side
				set({ user: null, jwt: null });
			},
		}),
		{
			name: "users", // name of the item in the storage (must be unique)
			// storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
);

export default useAuthStore;
