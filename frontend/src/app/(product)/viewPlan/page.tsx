'use client'
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	DollarSign,
	PiggyBank,
	ArrowRight,
} from "lucide-react";

// Mock data
const userData = {
	name: "Alex Johnson",
	avatar: "https://i.pravatar.cc/150?img=33",
	balance: 5750.83,
	income: 3200,
	expenses: 2100,
	savings: 1100,
};

const expenseData = [
	{ category: "Housing", amount: 1200 },
	{ category: "Food", amount: 400 },
	{ category: "Transportation", amount: 200 },
	{ category: "Utilities", amount: 150 },
	{ category: "Entertainment", amount: 100 },
	{ category: "Healthcare", amount: 50 },
];

const transactionHistory = [
	{ id: 1, description: "Grocery Shopping", amount: -75.5, date: "2024-03-10" },
	{ id: 2, description: "Salary Deposit", amount: 3200, date: "2024-03-01" },
	{ id: 3, description: "Electric Bill", amount: -120, date: "2024-03-05" },
	{ id: 4, description: "Online Purchase", amount: -49.99, date: "2024-03-08" },
	{ id: 5, description: "Freelance Payment", amount: 500, date: "2024-03-07" },
];

export default function Dashboard() {
	return (
		<div className="min-h-screen bg-background">

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Balance
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${userData.balance.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground">
									+20.1% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Income</CardTitle>
								<ArrowUpIcon className="h-4 w-4 text-green-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${userData.income.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground">
									+2.5% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Expenses</CardTitle>
								<ArrowDownIcon className="h-4 w-4 text-red-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${userData.expenses.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground">
									-4.3% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Savings</CardTitle>
								<PiggyBank className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${userData.savings.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground">
									+12.7% from last month
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Expense Breakdown</CardTitle>
								<CardDescription>
									Your spending by category this month
								</CardDescription>
							</CardHeader>
							<CardContent className="pl-2">
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={expenseData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="category" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="amount" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Recent Transactions</CardTitle>
								<CardDescription>
									Your latest financial activities
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-4">
									{transactionHistory.map((transaction) => (
										<li key={transaction.id} className="flex items-center">
											<div
												className={`rounded-full p-2 ${transaction.amount > 0 ? "bg-green-100" : "bg-red-100"} mr-3`}
											>
												{transaction.amount > 0 ? (
													<ArrowUpIcon className="h-4 w-4 text-green-500" />
												) : (
													<ArrowDownIcon className="h-4 w-4 text-red-500" />
												)}
											</div>
											<div className="flex-1">
												<p className="text-sm font-medium">
													{transaction.description}
												</p>
												<p className="text-xs text-gray-500">
													{transaction.date}
												</p>
											</div>
											<p
												className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
											>
												{transaction.amount > 0 ? "+" : ""}
												{transaction.amount.toFixed(2)}
											</p>
										</li>
									))}
								</ul>
								<Button variant="link" className="mt-4 w-full">
									View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					</div>

					<Card className="mt-8">
						<CardHeader>
							<CardTitle>Budget Overview</CardTitle>
							<CardDescription>
								Track your spending against your budget
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="monthly" className="w-full">
								<TabsList>
									<TabsTrigger value="monthly">Monthly</TabsTrigger>
									<TabsTrigger value="yearly">Yearly</TabsTrigger>
								</TabsList>
								<TabsContent value="monthly">
									<div className="space-y-4">
										<div>
											<div className="flex justify-between mb-1 text-sm font-medium">
												<span>Housing</span>
												<span>$1200 / $1500</span>
											</div>
											<Progress value={80} className="h-2" />
										</div>
										<div>
											<div className="flex justify-between mb-1 text-sm font-medium">
												<span>Food</span>
												<span>$400 / $500</span>
											</div>
											<Progress value={80} className="h-2" />
										</div>
										<div>
											<div className="flex justify-between mb-1 text-sm font-medium">
												<span>Transportation</span>
												<span>$200 / $300</span>
											</div>
											<Progress value={66} className="h-2" />
										</div>
									</div>
								</TabsContent>
								<TabsContent value="yearly">
									<p>Yearly budget overview coming soon...</p>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
