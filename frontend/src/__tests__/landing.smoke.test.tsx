import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/link so static render works without Next.js runtime
vi.mock("next/link", () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

// Suppress lucide-react icon warnings in SSR
vi.mock("lucide-react", () => ({
	ArrowRight: (props: any) => <svg {...props} />,
	Plus: (props: any) => <svg {...props} />,
}));

// Mock the Collapsible to a simple div (avoids client-only hooks in SSR)
vi.mock("@/components/ui/collapsible", () => ({
	Collapsible: ({ children }: any) => <div>{children}</div>,
	CollapsibleTrigger: ({ children, ...props }: any) => (
		<button {...props}>{children}</button>
	),
	CollapsibleContent: ({ children }: any) => <div>{children}</div>,
}));

import Home from "@/app/(landingPage)/page";

describe("landing page smoke", () => {
	it("renders all sections with expected copy", () => {
		const html = renderToStaticMarkup(<Home />);

		// Hero
		expect(html).toContain("your money, remembered.");
		expect(html).toContain("hi, this is senzen");
		expect(html).toContain("start tracking");

		// Screenshots section
		expect(html).toContain("the app itself.");
		expect(html).toContain("01 · home");
		expect(html).toContain("03 · plans");

		// FAQ
		expect(html).toContain("do i need to connect my bank?");

		// Highlights
		expect(html).toContain("more from senzen");
	});

	it("does not contain AI-plan-demo markers", () => {
		const html = renderToStaticMarkup(<Home />);

		expect(html).not.toContain("ask for a plan");
		expect(html).not.toContain("family trip");
		expect(html).not.toContain("auto-save");
		expect(html).not.toContain("Auto-save");
		expect(html).not.toContain("nudge you");
	});

	it("does not reference HeroStatsBand", () => {
		const html = renderToStaticMarkup(<Home />);

		expect(html).not.toContain("Plan → Budget → Ledger");
		expect(html).not.toContain("Every expense");
	});
});
