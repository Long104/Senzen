// 'use client'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
// import useAuthStore from "@/zustand/auth";

export async function middleware(req: NextRequest) {
	let token = req.cookies.get("jwt");

	// Check for token in URL (from OAuth redirect)
	const urlToken = req.nextUrl.searchParams.get("token");
	if (urlToken && !token) {
		// Create response and set cookie
		const response = NextResponse.redirect(new URL("/home", req.url));
		const isHttps = req.url.startsWith("https:");
		response.cookies.set("jwt", urlToken, {
			httpOnly: false,
			sameSite: "lax",
			secure: isHttps,
			path: "/",
			maxAge: 60 * 60 * 24 * 3, // 3 days
		});
		return response;
	}

  // const login = useAuthStore((state) => state.login)

	const handleLogout = async () => {
		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND + "/logout", {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				console.error("Logout failed:", response.statusText);
				// return;
			}
			return NextResponse.redirect(new URL("/sign-in", req.url));
		} catch (error) {
			console.error("Logout error:", error);
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}
	};

	if (token) {
		try {
			// if (req.nextUrl.pathname === "/" && token) {
			// 	return NextResponse.redirect("http://localhost:3000/home");
			// }
			// if (req.nextUrl.pathname === "/sign-in" && token) {
			// 	return NextResponse.redirect("http://localhost:3000/home");
			// }
			const path = req.nextUrl.pathname.replace(/\/+$/, ""); // Remove trailing slashes

			const redirectToHome = ["", "/sign-in", "/sign-up"]; // Adjust for root path ""

			const decoded = jwtDecode<{ exp: number }>(token.value); // Decode the token

			if (redirectToHome.includes(path) && token) {
				// return NextResponse.redirect("http://localhost:3000/home");
        // login(String(token))
				return NextResponse.redirect(new URL("/home", req.url));
			}

			const exp = decoded.exp * 1000; // Convert to milliseconds
			const currentTime = Date.now();

			if (currentTime >= exp) {
				return await handleLogout(); // Logout if expired
			}

			// Validate the token with your backend
			// const response = await fetch(
			// 	process.env.NEXT_PUBLIC_BACKEND + "/validate-token",
			// 	{
			// 		headers: { Authorization: `Bearer ${token.value}` },
			// 	},
			// );
			// if (!response.ok) {
			// 	return await handleLogout(); // Logout if token is not valid
			// }
		} catch (error) {
			console.error("Error decoding JWT:", error);
			return await handleLogout(); // Logout on decoding error
		}
	} else {
		const path = req.nextUrl.pathname.replace(/\/+$/, ""); // Remove trailing slashes
		const redirectToHome = ["", "/sign-in", "/sign-up"]; // Adjust for root path ""
		if (!redirectToHome.includes(path)) {
			console.error("JWT token is not available.");
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}
	}

	// return NextResponse.next(); // Continue to the requested route

	return NextResponse.next({
		// request: {
		// 	// Apply new request headers
		// 	headers: requestHeaders,
		// },
	});
}

export const config = {
	matcher: [
		"/home",
		"/dashboard",
		"/createPlan",
		"/",
		"/sign-in",
		"/sign-up",
		"/((?!.*\\..*|_next).*)",
	],
};
