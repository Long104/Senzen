"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported correctly
import Cookies from "js-cookie";

type User = {
	user_id: number;
	exp: number;
	name: string;
	email: string;
	role: string;
} | null;

type AuthContextType = {
	user: User;
	login: (token: string) => void;
	logout: () => void;
	jwt: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User>(null);
	const [jwt, setJwt] = useState<string>("");

	const login = (token: string) => {
		Cookies.set("jwt", token);
		try {
			const decoded = jwtDecode<User>(token);
			setUser(decoded);
		} catch (error) {
			console.error("Error decoding JWT:", error);
			logout();
		}
	};

	const router = useRouter();
	const logout = async () => {
		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND + "/logout",
				{
					method: "POST",
					credentials: "include", // Include cookies in the request
				},
			);

			if (response.ok) {
				// Optionally, clear JWT cookie here as well
				// Cookies.remove("jwt", { path: "/" });
				// redirect("/sign-in"); // Redirect after logout
				Cookies.remove("jwt"); // Clear JWT cookie on client side
				// setJwt(null);
				setUser(null);
				router.push("/sign-in");
			} else {
				console.error("Logout failed:", response.statusText);
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
		// Cookies.remove("jwt");
	};

	useEffect(() => {
		const token = Cookies.get("jwt");
		setJwt(token ?? "");
		if (token) {
			try {
				const decoded = jwtDecode<User>(token);
				setUser(decoded);
			} catch (error) {
				console.error("Error decoding JWT:", error);
				logout();
			}
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout, jwt }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
