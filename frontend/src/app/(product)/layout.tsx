"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { DockNav } from "@/components/dock-nav";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000 * 5,
				gcTime: 10 * 60 * 1000,
				refetchOnWindowFocus: false,
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-svh">
				<header className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6 pt-[env(safe-area-inset-top)]">
					<Link
						href="/home"
						className="text-lg font-semibold lowercase tracking-tight text-foreground"
					>
						senzen
					</Link>
					<NavUser />
				</header>
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						{children}
					</motion.div>
				</AnimatePresence>
				<div className="h-24" aria-hidden="true" />
				<DockNav />
			</div>
			<Toaster />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
