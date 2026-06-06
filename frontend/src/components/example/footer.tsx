import React from "react";
import Image from "next/image";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export const Footer = () => {
	return (
		<footer className="flex h-72 md:h-96 dark:bg-primary">
			{/* <div className="grid grid-cols-2"> */}
			<Card className="w-screen flex justify-around items-center">
				<div>
					<div className="text-2xl flex">
						<Image
							src={"/logo.webp"}
							alt="Basic responsive image"
							// className="mx-auto rounded-3xl object-cover object-center mr-2"
							className="rounded-3xl object-cover object-center mr-2"
							width={30}
							height={0}
							sizes="(max-width: 768px) 50vw, (max-width: 1200px) 500vw, 300vw"
							style={{
								height: "auto",
							}}
						/>
						Senzen
					</div>
					<br />© 2023 Senzen. All rights reserved.
				</div>
				<div className="grid grid-cols-3">
					<CardHeader>
						<CardTitle>Start</CardTitle>
						<CardDescription>begin here</CardDescription>
					</CardHeader>
					<CardHeader>
						<CardTitle>About us</CardTitle>
						<CardDescription>About us</CardDescription>
					</CardHeader>
					<CardHeader>
						<CardTitle>Community</CardTitle>
						<CardDescription>hello</CardDescription>
					</CardHeader>
					<CardHeader>
						<CardTitle>Contact</CardTitle>
						<CardDescription>Contact here</CardDescription>
					</CardHeader>
				</div>
			</Card>
			{/* </div> */}
		</footer>
	);
};
