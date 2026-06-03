"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const plans = [
	{
		name: "Free",
		description: "For personal budgeting",
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: [
			"Up to 3 financial plans",
			"Basic expense tracking",
			"Monthly budget overview",
			"Email support",
		],
		cta: "Get Started",
		href: "/sign-up",
		popular: false,
	},
	{
		name: "Pro",
		description: "For serious planners",
		monthlyPrice: 9,
		yearlyPrice: 79,
		features: [
			"Unlimited financial plans",
			"Advanced analytics & charts",
			"Auto-save & smart alerts",
			"Custom categories & budgets",
			"Export reports (PDF/CSV)",
			"Priority support",
		],
		cta: "Start Pro Trial",
		href: "/sign-up",
		popular: true,
	},
	{
		name: "Enterprise",
		description: "For teams & families",
		monthlyPrice: 29,
		yearlyPrice: 249,
		features: [
			"Everything in Pro",
			"Team collaboration (up to 25)",
			"Shared family budgets",
			"Custom integrations & API",
			"Dedicated account manager",
			"SSO & advanced security",
			"Custom onboarding",
		],
		cta: "Contact Sales",
		href: "/sign-up",
		popular: false,
	},
];

export default function PricingPage() {
	const [yearly, setYearly] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						Simple, transparent pricing
					</h1>
					<p className="mt-4 text-lg text-muted-foreground">
						Choose the plan that fits your financial goals. Upgrade or downgrade at any time.
					</p>

					<div className="mt-8 flex items-center justify-center gap-3">
						<Label
							htmlFor="billing-toggle"
							className={cn(
								"text-sm font-medium",
								!yearly ? "text-foreground" : "text-muted-foreground",
							)}
						>
							Monthly
						</Label>
						<Switch
							id="billing-toggle"
							checked={yearly}
							onCheckedChange={setYearly}
						/>
						<Label
							htmlFor="billing-toggle"
							className={cn(
								"text-sm font-medium",
								yearly ? "text-foreground" : "text-muted-foreground",
							)}
						>
							Yearly
							<Badge variant="secondary" className="ml-2">
								Save ~27%
							</Badge>
						</Label>
					</div>
				</div>

				<div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
					{plans.map((plan) => (
						<Card
							key={plan.name}
							className={cn(
								"relative flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
								plan.popular && "border-primary shadow-md scale-105",
							)}
						>
							{plan.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<Badge className="px-4 py-1">Most Popular</Badge>
								</div>
							)}
							<CardHeader className="text-center">
								<CardTitle className="text-xl">{plan.name}</CardTitle>
								<CardDescription>{plan.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="mb-6 text-center">
									<span className="text-4xl font-bold text-foreground">
										${yearly ? plan.yearlyPrice : plan.monthlyPrice}
									</span>
									<span className="text-muted-foreground">
										{plan.monthlyPrice === 0
											? ""
											: yearly
												? "/year"
												: "/month"}
									</span>
								</div>
								<ul className="flex flex-col gap-3">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-3">
											<Check className="size-4 shrink-0 text-primary" />
											<span className="text-sm text-muted-foreground">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									className="w-full"
									variant={plan.popular ? "default" : "outline"}
									asChild
								>
									<Link href={plan.href}>{plan.cta}</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				<div className="mt-20 text-center">
					<h2 className="text-2xl font-bold text-foreground">
						Frequently Asked Questions
					</h2>
					<div className="mt-8 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Can I switch plans later?
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Is there a free trial?
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Pro and Enterprise plans come with a 14-day free trial. No credit card required to start.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									What happens to my data if I cancel?
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Your data is safe. You can export everything before canceling, and we keep your data for 30 days in case you change your mind.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Do you offer refunds?
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									We offer a full refund within the first 30 days of any paid plan. No questions asked.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
