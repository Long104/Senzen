"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { fetchGetText } from "@/fetch/client";

// Quiet csv download — full history, no row limit.
export function ExportCsv() {
	const [pending, setPending] = useState(false);

	async function download() {
		setPending(true);
		try {
			const csv = await fetchGetText("transactions/export");
			const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
			const a = document.createElement("a");
			a.href = url;
			a.download = `senzen-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} finally {
			setPending(false);
		}
	}

	return (
		<button
			type="button"
			onClick={download}
			disabled={pending}
			aria-label="export history as csv"
			className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs lowercase text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
		>
			<Download className="h-3.5 w-3.5" />
			csv
		</button>
	);
}
