"use client";

import { useEffect } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/zustand/auth";

export function NavUser() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();

	const name = user?.name ?? "Guest";
	const email = user?.email ?? "";
	const initials =
		name
			.split(" ")
			.map((part) => part[0])
			.slice(0, 2)
			.join("")
			.toUpperCase() || "U";

	// OAuth (Google/GitHub) sets the HttpOnly cookie server-side and never
	// touches the zustand store — hydrate identity from the backend instead.
	useEffect(() => {
		if (user) return;
		fetch(process.env.NEXT_PUBLIC_BACKEND + "/user", {
			credentials: "include",
		})
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (data?.email) {
					useAuthStore.setState({
						user: {
							user_id: data.id,
							exp: 0,
							name: data.name,
							email: data.email,
							role: "",
						},
					});
				}
			})
			.catch(() => {});
	}, [user]);

	const handleLogout = async () => {
		await logout(); // Clear HttpOnly cookie via backend + user state
		router.push("/sign-in");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-10 gap-2 rounded-full px-2 transition-colors hover:bg-accent"
				>
					<span className="hidden text-sm font-medium leading-tight sm:block max-w-28 truncate">
						{name}
					</span>
					<Avatar className="h-8 w-8 rounded-full">
						<AvatarImage src="/logo.png" alt={name} />
						<AvatarFallback className="rounded-full">
							{initials}
						</AvatarFallback>
					</Avatar>
					<ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 rounded-lg"
				side="bottom"
				align="end"
				sideOffset={8}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-full">
							<AvatarImage src="/logo.png" alt={name} />
							<AvatarFallback className="rounded-full">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left leading-tight">
							<span className="truncate font-semibold">{name}</span>
							<span className="truncate text-xs text-muted-foreground">
								{email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				onClick={handleLogout}
				className="text-muted-foreground focus:bg-destructive/10 focus:text-destructive"
			>
				<LogOut />
				Log out
			</DropdownMenuItem>
		</DropdownMenuContent>
		</DropdownMenu>
	);
}
