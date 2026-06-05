"use client";

import * as React from "react";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";

const pricingItems: { title: string; href: string; description: string }[] = [
	{
		title: "Free",
		href: "/pricing",
		description: "Get started with basic budgeting tools",
	},
	{
		title: "Pro",
		href: "/pricing",
		description: "Advanced planning and analytics",
	},
	{
		title: "Enterprise",
		href: "/pricing",
		description: "Team collaboration and custom integrations",
	},
];

export function NavigationMenuDemo() {
	return (
		<NavigationMenu className="[&>*]:bg-primary [&>*]:text-accent-foreground z-50">
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/createPlan" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Create Plan
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				{/* <NavigationMenuItem> */}
					{/* <NavigationMenuTrigger>Pricing</NavigationMenuTrigger> */}
					{/* <NavigationMenuContent> */}
					{/* 	<ul className="grid w-[400px] gap-3 p-2 md:w-[400px] md:grid-cols-1 lg:w-[400px]"> */}
					{/* 		{pricingItems.map((item) => ( */}
					{/* 			<ListItem */}
					{/* 				key={item.title} */}
					{/* 				title={item.title} */}
					{/* 				href={item.href} */}
					{/* 			> */}
					{/* 				{item.description} */}
					{/* 			</ListItem> */}
					{/* 		))} */}
					{/* 	</ul> */}
					{/* </NavigationMenuContent> */}
				{/* </NavigationMenuItem> */}
				<NavigationMenuItem>
					<ProfileDropdown />
				</NavigationMenuItem>
				<NavigationMenuItem className="p-2">
					<ModeToggle />
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
