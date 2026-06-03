import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/(product)/home/page";

vi.mock("@/hooks/usePlan", () => ({
	usePlan: () => ({
		plansQuery: {
			data: [
				{
					id: 1,
					name: "Test Plan",
					description: "A test plan",
					initial_budget: 1000,
				},
			],
			isLoading: false,
		},
		deletePlanMutation: { mutate: vi.fn() },
	}),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

describe("Home Page", () => {
	it("renders financial plans overview heading", () => {
		render(<Home />);
		expect(
			screen.getByText("Financial Plans Overview"),
		).toBeInTheDocument();
	});

	it("renders plan cards when plans exist", () => {
		render(<Home />);
		expect(screen.getByText("Test Plan")).toBeInTheDocument();
	});

	it("renders view details button for each plan", () => {
		render(<Home />);
		expect(screen.getByText("View Details")).toBeInTheDocument();
	});
});
