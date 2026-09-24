import { HeroComposer } from "@example/spotlight-demo";
import { AppScreenshotsSection } from "@example/screenshot-section";
import { HighlightsBand } from "@example/highlights-band";
import { WeeklyClarity } from "@example/weekly-clarity";
import { FaqSection } from "@example/faq-section";
import { Footer } from "@example/footer";

export default function Home() {
	return (
		<>
			<HeroComposer />
			<AppScreenshotsSection />
			<HighlightsBand />
			<WeeklyClarity />
			<FaqSection />
			<Footer />
		</>
	);
}
