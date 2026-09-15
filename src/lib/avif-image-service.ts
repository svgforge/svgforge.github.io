import type { LocalImageService } from "astro";
import { baseService } from "astro/assets";
import sharpService from "astro/assets/services/sharp";

/**
 * Wraps the built-in sharp service with two project-specific defaults:
 * - AVIF as the output format unless the caller explicitly set one (or the
 *   source is SVG, which is passed through unchanged).
 * - A capped `sizes` attribute: the article container constrains images to
 *   roughly 672px, so there is no point telling the browser to load the full
 *   source width on desktop.
 */
const service: LocalImageService = {
	...sharpService,
	validateOptions(options, imageConfig, logger) {
		const src = options.src;
		if (!options.format && typeof src !== "string" && src.format !== "svg") {
			options.format = "avif";
		}
		if (options.sizes) {
			options.sizes = "(min-width: 768px) 768px, 100vw";
		}
		return baseService.validateOptions?.(options, imageConfig, logger) ?? options;
	},
};

export default service;
