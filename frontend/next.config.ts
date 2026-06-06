import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
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
	// 			destination: "https://senzen.localhost/:path*",
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
