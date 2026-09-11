---
title: Optimizing SVG files
description: How to customize the built-in SVGO v4 optimization in svgforge-cli with the shape.transform config.
pubDate: 2026-02-18
tags:
  - tips
  - svg
  - svgo
---

A few practical tips for shrinking SVG files before they are baked into sprites.
svgforge-cli runs [SVGO v4](https://svgo.dev/) under the hood, so every shape
gets optimized automatically. All you need to know is how to steer it.

## What SVGO does

SVG files exported from vector editors (Figma, Illustrator, Sketch) carry a lot
of baggage: editor metadata, comments, hidden layers, default attributes, and
verbose path data. SVGO strips that dead weight in a deterministic pipeline of
plugins — each one responsible for a single optimization task. The result is
typically 30–70 % smaller files with no visible change.

## The default behavior

By default, svgforge-cli runs SVGO with `preset-default` plus two extra plugins:

```js
{
  plugins: [
    'preset-default',
    { name: 'removeViewBox' },
    { name: 'removeTitle' },
  ],
}
```

The `preset-default` bundle alone enables over 20 plugins (merge paths, collapse
groups, convert colors, minify path data …). `removeViewBox` and `removeTitle`
are added because svgforge's sprite and dimensions pipeline relies on them being
stripped.

That default is usually enough — but sometimes you need more control.

## Customizing SVGO via the config file

Create a JSON config file and point the CLI at it with `--config`:

```json
{
  "dest": "out",
  "shape": {
    "transform": [
      {
        "svgo": {
          "plugins": [
            "preset-default",
            { "name": "removeViewBox" },
            { "name": "removeTitle" },
            { "name": "removeXMLProcInst" },
            { "name": "removeDoctype" }
          ]
        }
      }
    ]
  },
  "mode": {
    "view": {
      "sprite": "svg/sprite.view.svg",
      "example": true
    }
  }
}
```

Run it with:

```bash
svgforge --config svgo.config.json 'assets/**/*.svg'
```

The key is `shape.transform`: an array of transformation steps that are applied
to every shape in order. The shorthand `["svgo"]` is equivalent to
`[{ "svgo": {} }]`. When you pass an explicit `plugins` array, it **replaces**
the built-in defaults entirely.

## Disabling specific plugins

More often than you want to add plugins, you want to turn one *off*. Use
`preset-default` with `overrides`:

```json
{
  "shape": {
    "transform": [
      {
        "svgo": {
          "plugins": [
            {
              "name": "preset-default",
              "params": {
                "overrides": {
                  "cleanupIds": false,
                  "removeHiddenElems": false
                }
              }
            },
            { "name": "removeViewBox" },
            { "name": "removeTitle" }
          ]
        }
      }
    ]
  }
}
```

This is useful when your SVGs rely on hand-crafted element IDs (e.g. for
JavaScript targeting) or when hidden elements carry meaning (e.g. a toggle
state).

## Common recipes

### Keep dimensions on the shape

Some sprite modes benefit from having `width` and `height` attributes on
individual shapes. Remove the `removeDimensions` plugin:

```json
{
  "shape": {
    "transform": [
      {
        "svgo": {
          "plugins": [
            {
              "name": "preset-default",
              "params": {
                "overrides": {
                  "removeDimensions": false
                }
              }
            },
            { "name": "removeViewBox" },
            { "name": "removeTitle" }
          ]
        }
      }
    ]
  }
}
```

### Preserve metadata for accessibility

If your SVGs carry `<title>`, `<desc>`, or `aria-*` attributes for
accessibility, turn off the relevant plugins:

```json
{
  "name": "preset-default",
  "params": {
    "overrides": {
      "removeTitle": false,
      "removeDesc": false
    }
  }
}
```

Note: when you override `removeTitle` or `removeDesc` inside `preset-default`
you should **not** also list `{ "name": "removeTitle" }` as a standalone
plugin — that would re-enable it.

### Aggressive cleanup for maximum compression

When output size is everything, add extra plugins beyond the default:

```json
{
  "shape": {
    "transform": [
      {
        "svgo": {
          "plugins": [
            "preset-default",
            { "name": "removeViewBox" },
            { "name": "removeTitle" },
            { "name": "removeDimensions" },
            { "name": "removeStyleElement" },
            { "name": "removeScriptElement" }
          ]
        }
      }
    ]
  }
}
```

### Convert inline styles to attributes

Some sprite workflows work better when CSS is expressed as presentation
attributes rather than `<style>` blocks:

```json
{
  "shape": {
    "transform": [
      {
        "svgo": {
          "plugins": [
            "preset-default",
            { "name": "convertStyleToAttrs" },
            { "name": "removeViewBox" },
            { "name": "removeTitle" }
          ]
        }
      }
    ]
  }
}
```

## CLI-only: the `--shape-transform` flag

For quick one-offs you can skip the config file and pass the transform
shorthand directly:

```bash
svgforge --view --shape-transform=svgo 'assets/**/*.svg'
```

To point a named transform at an external JSON config file, use the
`--shape-transform-*` pattern. For example, create a file `svgo-config.json`
containing the SVGO plugin configuration, then:

```bash
svgforge --view --shape-transform=svgo --shape-transform-svgo=svgo-config.json 'assets/**/*.svg'
```

This is handy in npm scripts where the config lives alongside `package.json`.

## How it fits into the pipeline

The transform runs on each shape **before** it is combined into the sprite.
The order is:

1. Read source SVG
2. Apply `shape.transform` steps (SVGO, custom callbacks …)
3. Optional: namespace IDs, apply alignment / meta data
4. Compose the final sprite SVG

This means SVGO operates on clean, individual SVG fragments — not on the
finished sprite — which makes its optimizations more predictable and
debuggable.

## Tips

- Run `svgforge --log=debug` to see how many bytes SVGO saved per shape.
- Start with the defaults. Only add custom config when you have a concrete
  reason.
- If you need *completely* unmodified SVGs, set `transform: []` to disable
  all optimizations.
- The `multipass` option of SVGO is not wired through svgforge — each
  shape is optimized in a single pass. This is fine: the shapes are small
  enough that multipass rarely helps.
