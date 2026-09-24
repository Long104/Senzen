import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "senzen",
		short_name: "senzen",
		description: "quiet expense tracking",
		start_url: "/home",
		display: "standalone",
		background_color: "#EBEDEE",
		theme_color: "#EBEDEE",
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
