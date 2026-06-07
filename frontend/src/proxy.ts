import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function proxy(req: NextRequest) {
	const token = req.cookies.get("jwt");
	const path = req.nextUrl.pathname.replace(/\/+$/, "");

	if (token) {
		try {
			const redirectToHome = ["", "/sign-in", "/sign-up"];

			if (redirectToHome.includes(path)) {
				return NextResponse.redirect(new URL("/home", req.url));
			}

			const decoded = jwtDecode<{ exp: number }>(token.value);
			const exp = decoded.exp * 1000;
			const currentTime = Date.now();

			if (currentTime >= exp) {
				const response = NextResponse.redirect(
					new URL("/sign-in", req.url),
				);
				response.cookies.set("jwt", "", {
					maxAge: 0,
					path: "/",
				});
				return response;
			}
		} catch (error) {
			console.error("Error decoding JWT:", error);
			const response = NextResponse.redirect(
				new URL("/sign-in", req.url),
			);
			response.cookies.set("jwt", "", {
				maxAge: 0,
				path: "/",
			});
			return response;
		}
	} else {
		const redirectToHome = ["", "/sign-in", "/sign-up"];
		if (!redirectToHome.includes(path)) {
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard",
		"/createPlan",
		"/",
		"/sign-in",
		"/sign-up",
		"/((?!.*\\..*|_next).*)",
		// "/(api|trpc)(.*)"
	], // Apply middleware to `/home`, `/dashboard`, etc.
};
