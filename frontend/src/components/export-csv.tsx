"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { fetchGetText } from "@/fetch/client";

// Quiet csv download — full history, or one plan's history. No row limit.
export function ExportCsv({
	planId,
	planName,
}: {
	planId?: number;
	planName?: string;
}) {
	const [pending, setPending] = useState(false);

	async function download() {
		setPending(true);
		try {
			const url = planId ? `transactions/export?plan_id=${planId}` : "transactions/export";
			const csv = await fetchGetText(url);
			const blobUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
			const a = document.createElement("a");
			a.href = blobUrl;
			const slug = planName ? `-${planName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : "";
			a.download = `senzen${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
			a.click();
			URL.revokeObjectURL(blobUrl);
		} finally {
			setPending(false);
		}
	}

	return (
		<button
			type="button"
			onClick={download}
			disabled={pending}
			aria-label={planId ? "export this plan as csv" : "export history as csv"}
			className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs lowercase text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
		>
			<Download className="h-3.5 w-3.5" />
			csv
		</button>
	);
}
