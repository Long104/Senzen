import React from "react";
import { NavigationMenuDemo } from "@components/navbar-menu";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
	// const navItems = [
	// 	{ name: "Create Plan", href: "/" },
	// 	{ name: "View Plan", href: "/" },
	// 	{ name: "Profile", href: "/" },
	// ];
	return (
		<nav className=" flex justify-between py-3 px-20 text-primary-foreground bg-primary">
			<div className="text-2xl flex items-center">
				<Image
					src={"/logo.webp"}
					alt="Basic responsive image"
					className="mx-auto rounded-3xl object-cover object-center mr-2"
					width={0}
					height={0}
					sizes="(max-width: 768px) 50vw, (max-width: 1200px) 500vw, 300vw"
					style={{
						height: "auto",
					}}
					//         sizes="100vw"
					// style={{ width: '100%', height: 'auto' }} // optional
				/>
       <Link href="/"> 
				Senzen
        </Link>
			</div>
			<ul className="flex child:pl-6">
				<NavigationMenuDemo />
				{/* { */}
				{/*       navItems.map((item) => ( */}
				{/* 	<li key={item.name} className="child-hover:underline"> */}
				{/* 		{item.name} */}
				{/* 	</li> */}
				{/* )) */}
				{/*     } */}
			</ul>
		</nav>
	);
}
