export function cleanAmountInput(raw: string): string {
	const stripped = raw.replace(/[^0-9.]/g, "");
	const firstDot = stripped.indexOf(".");
	if (firstDot === -1) return stripped;
	return (
		stripped.slice(0, firstDot + 1) +
		stripped.slice(firstDot + 1).replace(/\./g, "")
	);
}
