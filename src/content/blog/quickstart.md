---

title: "Quickstart: Build your first sprite in 5 minutes"
description: A quick introduction to svgforge that helps you install the tool, create your first sprite, and see how to use icons from the sprite in your own product.
pubDate: 2026-11-07
tags:

- tutorial
- svg

---

In this guide, we'll build a **symbol sprite** and test its icons on a page using `<use>` — the most modern and widely used approach.

svgforge also supports other sprite modes: `view`, `stack`, and `defs`. For details, see [Specific mode properties](https://github.com/svgforge/svgforge/blob/main/docs/configuration.md#specific-mode-properties).

## Prerequisites

- Node.js 24 or later

## Setup

1. Create a project folder to work in. Let's call it `svgforge-project`.
2. Download a few SVG icons into that folder.
3. Install the library:

```bash
npm install @svgforge/svgforge
```

You should see output similar to this in the terminal:

```
added 38 packages in 1m

12 packages are looking for funding
  run `npm fund` for details
```

## Building the sprite

1. Create an `.mjs` file in the project folder (for example, `build-sprite.mjs`) and paste in the following code:

```js
import fs from "node:fs";
import path from "node:path";
import SVGSpriter from "@svgforge/svgforge";

const config = {
	dest: "out-lib",
	mode: {
		symbol: {
			example: true,
		},
	},
};

const spriter = new SVGSpriter(config);

for (const file of fs.globSync("*.svg")) {
	spriter.add(file, null, fs.readFileSync(file, "utf8"));
}

const { result } = await spriter.compileAsync();

for (const mode of Object.values(result)) {
	for (const resource of Object.values(mode)) {
		fs.mkdirSync(path.dirname(resource.path), { recursive: true });
		fs.writeFileSync(resource.path, resource.contents);
	}
}
```

Save the file.

2. Run it in the terminal:

```bash
node build-sprite.mjs
```

Two files will appear in the `out-lib/symbol/` folder:

- `sprite.symbol.svg` — the sprite itself
- `sprite.symbol.html` — a preview page (generated because of `example: true`)

## Checking the sprite

1. Start a local server:

```bash
npx serve out-lib
```

2. Open in your browser:

```
http://localhost:3000/symbol/sprite.symbol.html
```

You should see a confirmation that the sprite is ready. Now the icons from the sprite can be used on any page via `<use>`.

## Using the sprite

1. Create an HTML file inside the `out-lib/symbol/` folder. Name it `test-use.html`.

2. Paste the following code into the file:

```html
<svg width="32" height="32">
  <use href="svg/sprite.symbol.svg#home"></use>
</svg>
```

`#home` is the icon's identifier in the symbol sprite. By default, it matches the original SVG file name without the extension: `home.svg` → `home`.

**How to find your icon's identifier:**

- Open the preview page: `http://localhost:3000/symbol/sprite.symbol.html`
- Find the icon you need.
- Click the **Copy ID** button next to it — the identifier will be copied to your clipboard.
- Paste it in place of `home` in `<use href="svg/sprite.symbol.svg#...">`.

Save the file.

3. If you stopped the local server earlier, start it again:

```bash
npx serve out-lib
```

If the local server is still running, move on to the next step.

4. Open in your browser:

```
http://localhost:3000/symbol/test-use.html
```

The browser should display the icon whose identifier you specified in `<use>`.

## Learn more

- [Using symbol sprites via `<use>`](https://github.com/svgforge/svgforge/blob/main/docs/configuration.md#defs--symbol-mode)
- [Other sprite modes: `view`, `stack`, `defs`](https://github.com/svgforge/svgforge/blob/main/docs/configuration.md#specific-mode-properties)
- [Full sprite configuration documentation](https://github.com/svgforge/svgforge/blob/main/docs/configuration.md)
