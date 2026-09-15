// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://svgforge.github.io",
	image: {
		layout: "constrained",
		responsiveStyles: true,
		breakpoints: [480, 640, 768],
		service: {
			entrypoint: "./src/lib/avif-image-service.ts",
		},
	},
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
	},
});
