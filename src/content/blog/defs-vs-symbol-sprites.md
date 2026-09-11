---
title: defs vs symbol sprites
description: When should you choose <defs> and when <symbol>? Both are inline <use> sprite techniques — this post explains the differences based on the SVG spec.
pubDate: 2026-03-10
tags:
  - tutorial
  - svg
---

When should you choose `<defs>` and when `<symbol>`?

This post compares both inline sprite approaches — and yes, the two are *not*
interchangeable. `<defs>` and `<symbol>` are siblings from the same family of
[structural elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element#structural_elements),
but they serve different purposes, defined by the specification itself.

## The spec background

Both elements have been part of SVG since the very beginning and are covered in
both the [SVG 1.1 spec](https://www.w3.org/TR/SVG11/struct.html) and the
[SVG 2 draft](https://www.w3.org/TR/SVG2/struct.html):

| Element | SVG 1.1 | SVG 2 | MDN reference |
| --- | --- | --- | --- |
| `<defs>` | [The defs element](https://www.w3.org/TR/SVG11/struct.html#DefsElement) | [The defs element](https://www.w3.org/TR/SVG2/struct.html#DefsElement) | [MDN `<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/defs) |
| `<symbol>` | [The symbol element](https://www.w3.org/TR/SVG11/struct.html#SymbolElement) | [The symbol element](https://www.w3.org/TR/SVG2/struct.html#SymbolElement) | [MDN `<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol) |
| `<use>` | [The use element](https://www.w3.org/TR/SVG11/struct.html#UseElement) | [The use element](https://www.w3.org/TR/SVG2/struct.html#UseElement) | [MDN `<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use) |

## What `<defs>` is

The specification describes `<defs>` as a **reference container**: a place to
store objects that are *not rendered directly* but **referenced from
elsewhere**. Elements inside `<defs>` have an implicit `display:none` — they
exist in the document tree, but nothing is drawn until something points at
them via an IRI reference (`url(#id)`, `<use href="#id">`, …).

```html
<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="20%" stop-color="#39F"/>
      <stop offset="90%" stop-color="#F3F"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="8" height="8" fill="url(#grad)"/>
</svg>
```

That is the *primary* use case of `<defs>`: it hosts **helper objects**
(gradients, patterns, filters, masks, markers, clip paths) that other
elements pull in. It is not designed as an "icon library" element — it
simply happens to work for that, because any element, including an `<svg>`
with an ID, can be placed inside and later cloned via `<use>`.

## What `<symbol>` is

`<symbol>` is fundamentally different: it is a **graphical template object**
that is *instantiated* by `<use>`.

> The `symbol` element is used to define graphical template objects which
> can be instantiated by a `use` element.
> — [SVG 1.1, 5.11](https://www.w3.org/TR/SVG11/struct.html#SymbolElement)

A `<symbol>` itself is also never rendered, but unlike `<defs>` it brings a
set of **view-port attributes** along:

- [`viewBox`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox)
  — the symbol defines its own coordinate system,
- [`preserveAspectRatio`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio)
  — how the symbol's content fits into the viewport of the referencing `<use>`,
- [`x`, `y`, `width`, `height`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/x)
  — position and size defaults, plus
- [`refX` / `refY`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol#refx_and_refy)
  — a reference point, which is why `<symbol>` is also used for markers.

This matters because of how `<use>` renders its target:

> The referenced `symbol` and its contents are deep-cloned into the
> generated tree, with the exception that the `symbol` is replaced by an
> `svg`.
> — [SVG 1.1, 5.6](https://www.w3.org/TR/SVG11/struct.html#UseElement)

When a `<use>` instantiates a `<symbol>`, the symbol becomes an inner
`<svg>` — and that inner `<svg>` *inherits the symbol's `viewBox`*. The
icon thus gets proper, aspect-ratio-aware scaling for free. You do **not**
need to repeat the `viewBox` on the `<use>` wrapper:

```html
<svg>
  <symbol id="icon" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z"/>
  </symbol>
  <use href="#icon" width="48" height="48"/>
</svg>
```

That single difference — **the `<symbol>` carries its own `viewBox`** — is the
whole story behind the "defs vs symbol" debate.

## Deep dive: the reference mechanics

Both techniques build a sprite the same way: one file with many named icons,
each shown by pointing a `<use>` at an ID. The current spec also allows the
modern `href` attribute directly (no more `xlink:href` needed) — see the
[SVG 2 `<use>` element](https://www.w3.org/TR/SVG2/struct.html#UseElement).

A `<use>` can reference either
[an element in the same document](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use#notes_about_use)
(`<use href="#id">`) or
[an external SVG file](https://caniuse.com/mdn-svg_elements_use_external_uri)
(`<use href="sprite.svg#id">`). Both work for `<defs>` and `<symbol>` alike —
*because* both are just ID-targets.

There is a catch, though: an external `<use>` reference creates a **separate
DOM** (see [CSS-Tricks, "SVG use with external reference"](https://css-tricks.com/svg-use-with-external-reference-take-2)).
That means:

- you can style the `href` target from outside CSS, but **not** individual
  shapes inside the sprite (`#icon .path-1` won't match),
- references *inside* the sprite file (e.g. a gradient `fill="url(#grad)"`)
  may not resolve in Chrome when the sprite is loaded externally.

Whether you inline the sprite or fetch it externally, `<defs>` and
`<symbol>` behave identically — this is exactly what the
[CSS-Tricks sprite articles](https://css-tricks.com/svg-use-external-source/)
describe.

## `<defs>` and `<symbol>` in svgforge

svgforge's `defs` and `symbol` modes generate sprites that differ only in the
container element around each icon — and both are consumed identically:

```html
<!-- defs: <defs><svg id="…" viewBox="…"> -->
<svg>
  <defs>
    <svg id="actions--document-new" viewBox="0 0 48 48">…</svg>
  </defs>
</svg>

<!-- symbol: <symbol id="…" viewBox="…"> -->
<svg>
  <symbol id="actions--document-new" viewBox="0 0 48 48">…</symbol>
</svg>
```

Consuming them:

```html
<!-- defs: the <use> wrapper needs its own viewBox -->
<svg viewBox="0 0 48 48"><use href="sprite.svg#actions--document-new"/></svg>

<!-- symbol: the <symbol> provides the viewBox -->
<svg><use href="sprite.svg#actions--document-new"/></svg>
```

Enable them in your config and get both variants:

```json
{
  "dest": "out",
  "mode": {
    "defs": {
      "sprite": "svg/sprite.defs.svg",
      "example": true
    },
    "symbol": {
      "sprite": "svg/sprite.symbol.svg",
      "example": true
    }
  }
}
```

Run with:

```bash
svgforge --config sprite.config.json 'assets/**/*.svg'
```

## Which one should you use?

**Use `<symbol>`** for new icon systems. The spec gives it three advantages
over `<defs>`:

1. **No `viewBox` duplication.** The symbol defines the coordinate system, so
   your `<svg><use href="#…"/></svg>` wrappers stay tiny and clean.
2. **Scaling semantics built in.** `viewBox` + `preserveAspectRatio` even let
   a single icon render at different sizes and aspect ratios from one
   definition — impossible with a plain `<g>` or `<svg>` in `<defs>`.
3. **Clearer semantics.** `<symbol>` is *made for* reusable graphical
   templates; `<defs>` is meant for helper objects.

**Use `<defs>`** when your icons are not self-contained units but *parts that
other icons reference* — shared gradients, filters, masks, or clip paths that
several symbols pull in. In a hybrid setup it is perfectly normal to wrap every
icon in `<symbol>` and put the shared helpers in a `<defs>` above them.

In short (mirroring the svgforge docs): **`defs` and `symbol` are two flavours
of the same inline `<use>` technique — if you can only keep one, choose
`symbol`, the modern variant.**

## When neither is the right choice

`<use>`-based sprites render as inline SVG. That means they are **not**
usable as `<img src="…">` or as CSS `background-image`. For those, fragment
identifiers are the way to go — which is what svgforge's
[`stack`](https://css-tricks.com/svg-fragment-identifiers-work/) and
[`view`](https://css-tricks.com/svg-fragment-identifiers-work/) modes produce
(`<img src="sprite.stack.svg#id">`). A quick decision guide:

| Need | Mode |
| --- | --- |
| Inline icons, styleable with CSS/`currentColor`, reusable many times | `symbol` (or `defs`) |
| Stylesheet-driven icons with cacheable, externally referenced sprites | `symbol` + `render: {css: true}` |
| `<img>` or `background-image` icons | `stack` |
| Foreground images with browser-native slicing | `view` |