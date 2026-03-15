"use client";
import Cookies from "js-cookie";

export async function fetchGet(url: string): Promise<any> {
	const jwt = Cookies.get("jwt");
	// const jwtToken = Cookies.get("jwt"); // Get JWT from cookies
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`, // Add the Bearer token
			},
		});

		if (!res.ok) {
			throw new Error("cannot fetch data");
		}

		return await res.json();
	} catch (error) {
		console.error(error);
		return []; // Return empty array instead of JSX
	}
}

export async function fetchPost(url: string, data: any): Promise<any> {
	const jwt = Cookies.get("jwt");
	// const jwtToken = Cookies.get("jwt"); // Get JWT from cookies
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`, // Add the Bearer token
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error("cannot fetch data");
		}

		return await res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function fetchUpdate(
	url: string,
	id: string | number,
	data: any,
): Promise<any> {
	const jwt = Cookies.get("jwt");
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error("Cannot update data");
		}

		return await res.json();
	} catch (error) {
		console.error(error);
		return { error: "Error updating data" };
	}
}

export async function fetchDelete(
	url: string,
	id: string | number,
): Promise<any> {
	const jwt = Cookies.get("jwt");
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		if (!res.ok) {
			throw new Error("Cannot delete data");
		}

		const text = await res.text();
		console.log(text);
		return text ? JSON.parse(text) : null;
		// return await res.json(); // Or `return { success: true };` if no JSON response
	} catch (error) {
		console.error(error);
		return { error: "Error deleting data" };
	}
}
