export function markdownToText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`([^`]*)`/g, "$1")
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
		.replace(/^>\s?/gm, "")
		.replace(/(\*\*|__)(.*?)\1/g, "$2")
		.replace(/(\*|_)(.*?)\1/g, "$2")
		.replace(/[#>*]/g, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function truncate(text: string, maxLength = 160): string {
	if (text.length <= maxLength) return text;
	const cut = text.slice(0, maxLength);
	const lastSpace = cut.lastIndexOf(" ");
	return `${lastSpace > 40 ? cut.slice(0, lastSpace) : cut}…`;
}

export function getExcerpt(
	entry: { body?: string; data: { description?: string } },
	maxLength = 160,
): string {
	if (entry.data.description) return entry.data.description;
	if (!entry.body) return "";
	return truncate(markdownToText(entry.body), maxLength);
}
