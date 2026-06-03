// app/page.tsx
import { cookies } from "next/headers";

export async function fetchGet(url: string) {
	const cookieStore = await cookies();
	const jwt = cookieStore.get("jwt");
	// const jwtToken = Cookies.get("jwt"); // Get JWT from cookies
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_BACKEND + `/${url}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt?.value}`, // Add the Bearer token
				// Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxvbmd3ZWVAZ21haWwuY29tIiwiZXhwIjoxNzMwOTAzODc4LCJuYW1lIjoiaGFoYTEyMyIsInJvbGUiOiJhZG1pbiIsInVzZXJfaWQiOjl9.emEj5_LhhE82gOA3FGYuk6cJfwoyxdJVC5JIDmL5Y50`, // Add the Bearer token
			},
		});

		if (!res.ok) {
			throw new Error("cannot fetch data");
		}

		return await res.json();
	} catch (error) {
		console.error(error);
			throw new Error(`Failed to fetch ${url}: ${error}`);
	}
}
