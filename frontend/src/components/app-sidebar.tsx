"use client";

import * as React from "react";
import {
	Building2,
	PlusCircle,
	Settings2,
	Newspaper,
	House,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

import useAuthStore from "@/zustand/auth";
import { usePlan } from "@/hooks/usePlan";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const users = useAuthStore((state) => state.user);
	const { plansQuery } = usePlan();
	const { data: plans, isLoading } = plansQuery;

	const data = {
		user: {
			name: users?.name,
			email: users?.email,
			avatar: "/logo.webp",
		},
		teams: [
			{
				name: "CashWise",
				logo: Building2,
				plan: "Company",
			},
		],
		navMain: [
			{
				title: "Plan",
				url: "#",
				icon: Newspaper,
				items: isLoading
					? [
							{ title: "Loading...", url: "#" },
							{ title: "Loading...", url: "#" },
						]
					: plans?.length
						? plans.map((plan: Record<string, unknown>) => ({
								title: (plan?.name as string) || "Unnamed Plan",
								url: `/plan/${plan?.name}/?id=${plan.id}`,
							}))
						: [{ title: "No plans yet", url: "/createPlan" }],
			},
			{
				title: "News & Forums",
				url: "#",
				icon: Newspaper,
				items: [
					{ title: "Money", url: "#" },
					{ title: "Saving", url: "#" },
					{ title: "Story", url: "#" },
				],
			},
			{
				title: "Settings",
				url: "#",
				icon: Settings2,
				items: [
					{ title: "General", url: "#" },
					{ title: "Team", url: "#" },
					{ title: "Billing", url: "#" },
					{ title: "Limits", url: "#" },
				],
			},
		],
		projects: [
			{
				name: "Home",
				url: "/home",
				icon: House,
			},
			{
				name: "Create Plan",
				url: "/createPlan",
				icon: PlusCircle,
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
