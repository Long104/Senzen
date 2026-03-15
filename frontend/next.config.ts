import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "assets.aceternity.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/:path*",
	// 			destination: "https://cashwise.localhost/:path*",
	// 		},
	// 	];
	// },
	// async redirects() {
	//     return [
	//         {
	//             source: "/hello",
	//             destination: "/sign-in",
	//             permanent: true,
	//         },
	//     ];
	// },
};

export default nextConfig;
