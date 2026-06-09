"use client";
// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchGet } from "@/fetch/client";

type User = {
	id: number;
	name: string;
	email: string;
	// Plans: Plan[];
	// CreatedAt: string;
	// updatedAt: string;
	Plans: any[];
} | null;

type UserContextType = {
	user_data: User;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
	children: React.ReactNode;
	auth: number | undefined;
}> = ({ children, auth }) => {
	const [user_data, setUser_data] = useState<User>(null);

	useEffect(() => {
		// Fetch user data once
		const fetchUser = async () => {
			try {
				// const data = await fetchGet(`user/${user?.user_id}`); // Replace with your API endpoint
				// const data = await fetchGet(`user/1`); // Replace with your API endpoint
				const data = await fetchGet(`user`); // user_id comes from JWT
				setUser_data(data);
				// console.log("this is user id", user?.user_id);
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			}
		};
		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user_data }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within an UserProvider");
	}
	return context;
};
