import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function proxy(req: NextRequest) {
	const token = req.cookies.get("jwt");
	const path = req.nextUrl.pathname.replace(/\/+$/, "");

	// API + OAuth paths — always let through (backend enforces its own
	// auth; the middleware only guards pages). Includes /api/* variants
	// since the Vercel proxy moved these under /api.
	const oauthPaths = [
		"/google_login",
		"/google_callback",
		"/github_login",
		"/github_callback",
		"/api/google_login",
		"/api/google_callback",
		"/api/github_login",
		"/api/github_callback",
	];
	if (oauthPaths.includes(path)) {
		return NextResponse.next();
	}

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
		"/((?!api|.*\\..*|_next|google_login|google_callback|github_login|github_callback).*)",
	],
};
