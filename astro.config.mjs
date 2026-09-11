// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://svgforge.github.io",
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
	},
});
