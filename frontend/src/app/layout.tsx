import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { AuthProvider } from "@/context/auth";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { jwtDecode } from "jwt-decode";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "CashWise",
	description: "Smart budgeting and financial planning made simple",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en" suppressHydrationWarning>
			<AuthProvider>
				{/* <UserProvider auth={user_token?.user_id}> */}
					<body
						className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary [&_*]:select-none overscroll-y-none`}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem={false}
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</body>
				{/* </UserProvider> */}
			</AuthProvider>
		</html>
	);
}
