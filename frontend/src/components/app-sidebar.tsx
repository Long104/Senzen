"use client";

import * as React from "react";
import { House, Wallet, CalendarDays } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import {
	Sidebar,
	SidebarContent,
	SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = {
		projects: [
			{
				name: "home",
				url: "/home",
				icon: House,
			},
			{
				name: "month",
				url: "/month",
				icon: CalendarDays,
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
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
