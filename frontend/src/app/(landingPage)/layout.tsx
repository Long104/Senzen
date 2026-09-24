import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/example/navbar";

export const metadata: Metadata = {
	title: "Senzen — Plan your money. Track every day.",
	description: "Manual expense tracking. no bank sync, no notifications.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="light flex min-h-screen flex-col bg-[#EEEEEE] text-[#0A0A0A]">
			<Navbar />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
