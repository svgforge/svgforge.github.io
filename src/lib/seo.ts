export const SITE_URL = "https://svgforge.github.io";

export const SITE_AUTHOR = {
	"@type": "Person",
	name: "Felix Müller",
	url: "https://github.com/joeda1",
} as const;

export function siteUrl(path = "/") {
	return new URL(path, SITE_URL).href;
}

export function breadcrumbList(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: siteUrl(item.path),
		})),
	};
}
