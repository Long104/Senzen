"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";

const pageNames: Record<string, string> = {
	home: "Home",
	createPlan: "Create Plan",
	viewPlan: "View Plan",
	plan: "Plan",
	ws: "WebSocket",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const eachPath = pathname?.split("/") ?? [];
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
		<>
			<QueryClientProvider client={queryClient}>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<ModeToggle />
								<Separator orientation="vertical" className="mr-2 h-4" />
								<Breadcrumb>
									<BreadcrumbList>
										{eachPath[1] && (
											<BreadcrumbItem className="hidden md:block">
												<BreadcrumbLink href="#">
													{pageNames[eachPath[1]] || eachPath[1]}
												</BreadcrumbLink>
											</BreadcrumbItem>
										)}
										{eachPath[2] && (
											<>
												<BreadcrumbSeparator className="hidden md:block" />
												<BreadcrumbItem>
													<BreadcrumbPage>
														{pageNames[eachPath[2]] ||
															eachPath[2]?.replace(/_/g, " ")}
													</BreadcrumbPage>
												</BreadcrumbItem>
											</>
										)}
									</BreadcrumbList>
								</Breadcrumb>
							</div>
							<Button variant="outline" className="mr-2" asChild>
								<Link href="/createPlan">+</Link>
							</Button>
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
						<Toaster />
					</SidebarInset>
				</SidebarProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	);
}
