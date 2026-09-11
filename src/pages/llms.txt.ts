import { getCollection } from "astro:content";

export async function GET() {
	const posts = (
		await getCollection("blog", ({ data }) =>
			import.meta.env.PROD ? data.draft !== true : true,
		)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const lines = [
		"# svgforge",
		"",
		"> A low-level Node.js module that takes a bunch of SVG files, optimizes them and bakes them into SVG sprites and stacks.",
		"",
		"## Blog posts",
		...posts.map((post) => {
			const description = post.data.description || "Blog post about svgforge.";
			return `- [${post.data.title}](https://svgforge.github.io/blog/posts/${post.id}/): ${description}`;
		}),
		"",
		"## More",
		"- [Releases](https://svgforge.github.io/releases/): Latest GitHub releases of svgforge.",
		"- [All tags](https://svgforge.github.io/blog/tags/): Browse blog posts by tag.",
		"- [svgforge on GitHub](https://github.com/svgforge/svgforge): Source code and API documentation.",
		"- [svgforge-cli on GitHub](https://github.com/svgforge/svgforge-cli): Source code and command line documentation.",
	];

	return new Response(`${lines.join("\n")}\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
