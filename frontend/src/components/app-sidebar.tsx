"use client";

import * as React from "react";
import { House, Wallet, ChartColumn } from "lucide-react";

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
				name: "report",
				url: "/report",
				icon: ChartColumn,
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
