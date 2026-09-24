import React from "react";

export function BrowserFrame({
	src,
	alt,
	label,
	className = "",
}: {
	src: string;
	alt: string;
	label?: string;
	className?: string;
}) {
	return (
		<div
			className={`relative rounded-xl border border-[#E5E5E5] bg-white p-2 md:p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)] ${className}`}
		>
			{/* Minimal Window Header */}
			<div className="flex items-center gap-1.5 pb-2 md:pb-2.5 px-1 border-b border-[#F0F0F0] mb-2">
				<div className="h-2 w-2 rounded-full bg-[#E5E5E5]" />
				<div className="h-2 w-2 rounded-full bg-[#E5E5E5]" />
				<div className="h-2 w-2 rounded-full bg-[#E5E5E5]" />
				{label && (
					<span className="ml-2 font-mono text-[10px] text-[#888888]">
						{label}
					</span>
				)}
			</div>
			{/* Clean Image Slot */}
			<div className="relative overflow-hidden rounded-lg bg-[#F7F7F7] aspect-[16/10]">
				<img
					src={src}
					alt={alt}
					loading="lazy"
					className="w-full h-full object-cover object-top"
				/>
			</div>
		</div>
	);
}
