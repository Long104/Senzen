"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Users } from "lucide-react";
import useAuthStore from "@/zustand/auth";
import { useRouter } from "next/navigation";
import { usePlan } from "@/hooks/usePlan";
import { z } from "zod";
import { PlanSchema } from "@/types";

export default function CreatePlan() {
	const user = useAuthStore((state) => state.user);
	const router = useRouter();
	const [planName, setPlanName] = useState("");
	const [planDescription, setPlanDescription] = useState("");
	const [planType, setPlanType] = useState("personal");
	const [planVisibility, setPlanVisibility] = useState("private");
	const [planDuration, setPlanDuration] = useState("");
	const [initialBudget, setInitialBudget] = useState("");
	const [autoSave, setAutoSave] = useState(true);
	const { createPlanMutation } = usePlan();

	type Plan = z.infer<typeof PlanSchema>;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		const planData: Partial<Plan> = {
			name: planName,
			user_id: user?.user_id,
			description: planDescription,
			plan_type: planType,
			visibility: planVisibility,
			duration: planDuration,
			initial_budget: isNaN(parseFloat(initialBudget))
				? 0
				: parseFloat(initialBudget),
			auto_save: autoSave,
		};

		try {
			// const res = await fetchPost("plan", planData);
			const data = PlanSchema.parse(planData);
			const res = await createPlanMutation.mutateAsync(data);
			setPlanName("");
			setPlanDescription("");
			setPlanType("personal");
			setPlanVisibility("private");
			setPlanDuration("");
			setInitialBudget("");
			setAutoSave(true);

			console.log(res);
			router.push(`/plan/${res.name.replace(/ /g, "_")}?id=${res.id}`);
		} catch (error) {
			console.error("Error submitting plan:", error);
		}
		// Reset form or redirect to the new plan page
	};

	return (
		<div className="min-h-screen bg-background">
			<main className="max-w-3xl mx-auto py-12 sm:px-6 lg:px-8">
				<form onSubmit={handleSubmit}>
					<Card>
						<CardHeader>
							<CardTitle>Plan Details</CardTitle>
							<CardDescription>
								Set up your new financial plan with Cashwise
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="plan-name">Plan name</Label>
								<Input
									id="plan-name"
									placeholder="e.g. My 2024 Savings Plan"
									value={planName}
									onChange={(e) => setPlanName(e.target.value)}
									required
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="plan-description">Description (optional)</Label>
								<Textarea
									id="plan-description"
									placeholder="Describe your financial goals and strategies"
									value={planDescription}
									onChange={(e) => setPlanDescription(e.target.value)}
								/>
							</div>

							<RadioGroup
								value={planType}
								onValueChange={setPlanType}
								className="flex flex-col gap-1 "
								defaultValue="comfortable"
							>
								<Label>Plan Type</Label>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="personal"
										id="personal"
										className="border-gray-400 text-white"
									/>
									<Label htmlFor="personal">Personal</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="family"
										id="family"
										className="border-gray-400 text-white"
									/>
									<Label htmlFor="family">Family</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="business"
										id="business"
										className="border-gray-400 text-white"
									/>
									<Label htmlFor="business">Business</Label>
								</div>
							</RadioGroup>

							<div className="flex flex-col gap-2">
								<Label>Plan Visibility</Label>
								<Select
									value={planVisibility}
									onValueChange={setPlanVisibility}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select visibility" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="private">
											<div className="flex items-center">
												<Lock className="mr-2 h-4 w-4" />
												Private
											</div>
										</SelectItem>
										<SelectItem value="shared">
											<div className="flex items-center">
												<Users className="mr-2 h-4 w-4" />
												Shared with specific people
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Plan Duration</Label>
								<Select value={planDuration} onValueChange={setPlanDuration}>
									<SelectTrigger>
										<SelectValue placeholder="Select duration" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1week">1 Week</SelectItem>
										<SelectItem value="1month">1 Month</SelectItem>
										<SelectItem value="3months">3 Months</SelectItem>
										<SelectItem value="6months">6 Months</SelectItem>
										<SelectItem value="1year">1 Year</SelectItem>
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="initial-budget">Initial Budget</Label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
										$
									</span>
									<Input
										id="initial-budget"
										type="number"
										placeholder="0.00"
										value={initialBudget}
										onChange={(e) => setInitialBudget(e.target.value)}
										className="pl-7"
									/>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Switch
									id="auto-save"
									checked={autoSave}
									onCheckedChange={setAutoSave}
									className="bg-gray-800 border-2 border-gray-600 data-[state=checked]:bg-green-500"
								/>
								<Label htmlFor="auto-save">Enable auto-save feature</Label>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full">
								Create Financial Plan
							</Button>
						</CardFooter>
					</Card>
				</form>
			</main>
		</div>
	);
}
