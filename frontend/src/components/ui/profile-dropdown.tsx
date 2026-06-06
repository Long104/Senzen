"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Activity,
	ChevronRight,
	HelpCircle,
	KeyRound,
	LayoutGrid,
	LogOut,
	Palette,
	Settings,
	SwitchCamera,
	User2,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
export function ProfileDropdown({ classProfile }: { classProfile?: string }) {
	const { user, login, logout } = useAuth();
	const router = useRouter();
	const handleLogout = async () => {
		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_BACKEND + "/logout",
				{
					method: "POST",
					credentials: "include", // Include cookies in the request
				},
			);

			if (response.ok) {
				// Optionally, clear JWT cookie here as well
				// Cookies.remove("jwt", { path: "/" });
				// redirect("/sign-in"); // Redirect after logout
				Cookies.remove("jwt"); // Clear JWT cookie on client side
				setJwt(null);
				router.push("/sign-in");
			} else {
				console.error("Logout failed:", response.statusText);
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const [jwt, setJwt] = useState<{
		exp: number;
		name?: string;
		email?: string;
	} | null>(null);

	// let cookie;
	// Retrieve JWT from cookies on the client side
	function getJwtFromCookie() {
		// const cookie = document.cookie
		// 	.split("; ")
		// 	.find((row) => row.startsWith("jwt="))
		// 	?.split("=")[1];
		const cookie = Cookies.get("jwt");
		// cookie = Cookies.get("jwt");
		if (cookie) {
			try {
				return jwtDecode<{ exp: number; name: string; email: string }>(cookie);
			} catch (error) {
				console.error("Error decoding JWT:", error);
				handleLogout();
				return null;
			}
		}
		return null;
	}

	useEffect(() => {
		const decoded = getJwtFromCookie();
		if (decoded) setJwt(decoded);
	}, [user?.exp]);

	return (
		<>
			{user?.exp ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-10 w-10 rounded-full select-none"
						>
							{/* <Avatar className="h-10 w-10"> */}
							<Avatar className={cn("h-10 w-10", classProfile)}>
								<AvatarImage
									// src="/placeholder.svg?height=40&width=40"
									src="/money.avif"
									alt="Ai Ai"
								/>
								<AvatarFallback className="bg-rose-500 text-white">
									{/* {jwt?.exp} */}
									ai ai
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-80" align="end">
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-4">
								<p className="text-xs font-medium leading-none text-muted-foreground">
									ACCOUNT
								</p>
								<div className="flex items-center gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage src="/money.avif" alt="Ai Ai" />
										<AvatarFallback className="bg-rose-500 text-white text-lg">
											AA
										</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<p className="text-sm font-medium leading-none">
											{jwt?.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{/* aieasyuse@gmail.com */}
											{jwt?.email}
										</p>
									</div>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<SwitchCamera className="mr-2 h-4 w-4" />
								<span>Switch accounts</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Manage account</span>
								{/* <ChevronRight className="ml-auto h-4 w-4" /> */}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="font-normal">
							<p className="text-xs font-medium leading-none text-muted-foreground">
								Senzen
							</p>
						</DropdownMenuLabel>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User2 className="mr-2 h-4 w-4" />
								<span>Profile and visibility</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Activity className="mr-2 h-4 w-4" />
								<span>Activity</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LayoutGrid className="mr-2 h-4 w-4" />
								<span>Cards</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Palette className="mr-2 h-4 w-4" />
								<span>Theme</span>
								<ChevronRight className="ml-auto h-4 w-4" />
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Users className="mr-2 h-4 w-4" />
							<span>Create Workspace</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<HelpCircle className="mr-2 h-4 w-4" />
							<span>Help</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<KeyRound className="mr-2 h-4 w-4" />
							<span>Shortcuts</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							// onClick={() => handleLogout()}
							onClick={() => logout()}
							// onClick={logout}
							className="text-red-600 dark:text-red-400"
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<>
					<Link href="/sign-in">login</Link>
				</>
			)}
		</>
	);
}
