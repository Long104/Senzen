"use client";

import * as React from "react";
import { House, Wallet, Newspaper } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
	Sidebar,
	SidebarContent,
	SidebarRail,
} from "@/components/ui/sidebar";

import { usePlan } from "@/hooks/usePlan";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { plansQuery } = usePlan();
	const { data: plans, isLoading } = plansQuery;

	const data = {
		navMain: [
			{
				title: "plans",
				url: "#",
				icon: Newspaper,
				items: isLoading
					? [{ title: "loading...", url: "#" }]
					: plans?.length
					? plans.map((plan: Record<string, unknown>) => ({
							title: (plan?.name as string) || "unnamed plan",
							url: `/plan/${plan?.name}/?id=${plan.id}`,
						}))
					: [{ title: "no plans yet", url: "/plans" }],
			},
		],
		projects: [
			{
				name: "home",
				url: "/home",
				icon: House,
			},
			{
				name: "plans",
				url: "/plans",
				icon: Wallet,
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>
				<NavProjects projects={data.projects} />
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
