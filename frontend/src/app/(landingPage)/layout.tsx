import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/example/navbar";

export const metadata: Metadata = {
	title: "Senzen",
	description: "Smart budgeting and financial planning made simple",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
