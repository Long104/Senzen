import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="p-6">
			<div className="flex flex-col gap-4 mb-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex flex-col gap-3">
						<Skeleton className="h-40 rounded-lg" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				))}
			</div>
		</div>
	);
}
