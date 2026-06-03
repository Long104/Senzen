"use client";
import Cookies from "js-cookie";

export async function fetchGet(url: string): Promise<any> {
	const jwt = Cookies.get("jwt");
	const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
	}

	return await res.json();
}

export async function fetchPost(url: string, data: any): Promise<any> {
	const jwt = Cookies.get("jwt");
	const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error(`Failed to post ${url}: ${res.statusText}`);
	}

	return await res.json();
}

export async function fetchUpdate(
	url: string,
	id: string | number,
	data: any,
): Promise<any> {
	const jwt = Cookies.get("jwt");
	const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error(`Failed to update ${url}/${id}: ${res.statusText}`);
	}

	return await res.json();
}

export async function fetchDelete(
	url: string,
	id: string | number,
): Promise<any> {
	const jwt = Cookies.get("jwt");
	const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to delete ${url}/${id}: ${res.statusText}`);
	}

	const text = await res.text();
	return text ? JSON.parse(text) : null;
}
