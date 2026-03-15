import Cookies from "js-cookie";
import { CategorySchema } from "../types";
import { z } from "zod";

type Category = z.infer<typeof CategorySchema>;
export async function fetchDeleteCategory(
	url: string,
): Promise<Partial<Category> & { error?: string } | null> {
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
		console.log(text);
		return text ? JSON.parse(text) : null;
		// return await res.json(); // Or `return { success: true };` if no JSON response
	} catch (error) {
		console.error(error);
		return { error: "Error deleting data" };
	}
}
