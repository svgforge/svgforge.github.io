---
title: Why SVG? History, Basics, and SVG Fragments
pubDate: 2026-02-18
tags:
  - tips
  - svg
---

**SVG** stands for *Scalable Vector Graphics* and is an XML-based description language for two-dimensional graphics on the web.

Unlike PNG or JPEG, SVG does not store individual pixels. Instead, it describes geometric shapes, paths, colors, and transformations. The browser recalculates the graphic at every display size.

## A Brief History of SVG

The development of SVG began in the late 1990s at the World Wide Web Consortium (W3C). Ideas from various vector graphics concepts, such as VML and PGML, influenced its development.

The first official SVG version, SVG 1.0, became a W3C Recommendation on **September 4, 2001**. SVG 1.1 followed on **January 14, 2003** and became the most important foundation for SVG on the web for many years.

In the early years, a plug-in such as the Adobe SVG Viewer was often required. Native browser support was introduced gradually:

- Firefox and Safari supported SVG at an early stage.
- Chrome integrated SVG support in early versions of its browser engine.
- Internet Explorer supported SVG starting with version 9, released in 2011.
- By around 2011, SVG could generally be used in the major modern browsers without a plug-in.

## Basic Structure of an SVG File

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 300 200"
  role="img"
  aria-labelledby="title">

  <title id="title">A red circle</title>

  <circle
    cx="150"
    cy="100"
    r="60"
    fill="crimson" />
</svg>
```

The `viewBox` attribute defines the internal coordinate system. This allows the graphic to be scaled independently of its actual output size.

```html
<svg width="600" height="400" viewBox="0 0 300 200">
  ...
</svg>
```

In this example, the graphic is scaled from an internal area of `300 × 200` to an output size of `600 × 400`.

## Basic SVG Elements

### Rectangle with `<rect>`

```xml
<rect
  x="20"
  y="20"
  width="160"
  height="90"
  rx="12"
  fill="steelblue"
  stroke="black"
  stroke-width="3" />
```

### Circle with `<circle>`

```xml
<circle
  cx="100"
  cy="100"
  r="60"
  fill="gold"
  stroke="darkorange"
  stroke-width="4" />
```

### Ellipse with `<ellipse>`

```xml
<ellipse
  cx="150"
  cy="90"
  rx="120"
  ry="50"
  fill="mediumseagreen" />
```

### Line with `<line>`

```xml
<line
  x1="20"
  y1="20"
  x2="280"
  y2="180"
  stroke="black"
  stroke-width="4" />
```

### Polygon with `<polygon>`

```xml
<polygon
  points="150,20 280,180 20,180"
  fill="tomato"
  stroke="black"
  stroke-width="3" />
```

### Freeform Paths with `<path>`

```xml
<path
  d="M 20 160 L 80 40 L 140 160 Z"
  fill="none"
  stroke="purple"
  stroke-width="6" />
```

Important commands used inside the `d` attribute include:

- `M` – move to a position
- `L` – draw a line
- `C` – cubic Bézier curve
- `Q` – quadratic Bézier curve
- `A` – arc
- `Z` – close the path

## Advantages of SVG

### Resolution Independence

SVG graphics can be enlarged or reduced without losing quality. This is particularly important for responsive websites and high-resolution displays.

### Structured Content

SVG consists of individual elements and attributes. For example, a circle remains a circle instead of being converted into pixels.

### CSS and JavaScript

SVG elements can be styled with CSS and modified with JavaScript. This makes animations, interactions, and dynamic diagrams possible.

### Reusability

Elements can be reused with `<symbol>` and `<use>`. This is the foundation of many SVG icon sprites.

### Accessibility

SVG can contain text, titles, and descriptions. However, a graphic is not automatically accessible. Informative graphics should be described semantically, while decorative graphics can be hidden from assistive technologies with `aria-hidden="true"`.

## What Is an SVG Fragment?

A fragment is the part of a URL that comes after the `#` character:

```text
graphic.svg#my-fragment
```

In SVG, a fragment can reference a specific view or element within an SVG file.

It is important to understand the following:

> An SVG fragment does not automatically mean that only part of the file is downloaded from the server.

Normally, the SVG file is loaded first. The browser then uses the fragment identifier to determine which view or element should be displayed.

## SVG Fragments with `<view>`

The `<view>` element can be used to define named views within an SVG file:

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 300 100">

  <rect
    x="0"
    y="0"
    width="100"
    height="100"
    fill="tomato" />

  <circle
    cx="150"
    cy="50"
    r="50"
    fill="gold" />

  <polygon
    points="200,100 250,0 300,100"
    fill="steelblue" />

  <view
    id="red-view"
    viewBox="0 0 100 100" />

  <view
    id="circle-view"
    viewBox="100 0 100 100" />

  <view
    id="triangle-view"
    viewBox="200 0 100 100" />
</svg>
```

The views can then be referenced by their IDs:

```html
<img src="shapes.svg#red-view" alt="Red rectangle">
<img src="shapes.svg#circle-view" alt="Yellow circle">
<img src="shapes.svg#triangle-view" alt="Blue triangle">
```

Another supported syntax is:

```html
<img
  src="shapes.svg#svgView(viewBox(100,0,100,100))"
  alt="Yellow circle">
```

## SVG Sprites with `<symbol>` and `<use>`

Reusable icons are often stored in an SVG sprite:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-home" viewBox="0 0 32 32">
    <path
      d="M 3 14 L 16 3 L 29 14 V 29 H 3 Z"
      fill="none"
      stroke="currentColor"
      stroke-width="2" />
  </symbol>
</svg>
```

The symbol can then be used inside another SVG document:

```html
<svg
  class="icon"
  viewBox="0 0 32 32"
  aria-hidden="true">

  <use href="#icon-home"></use>
</svg>
```

The modern attribute is `href`. The older syntax, `xlink:href`, is still found in older projects but is considered deprecated:

```html
<use xlink:href="#icon-home"></use>
```

## External SVG Fragments

The sprite can also be stored in a separate file:

```html
<svg
  class="icon"
  viewBox="0 0 32 32"
  aria-hidden="true">

  <use href="/assets/icons.svg#icon-home"></use>
</svg>
```

The URL consists of two parts:

```text
/assets/icons.svg#icon-home
└──────────────┘ └─────────┘
    SVG file       Fragment ID
```

When using external references, the following points are particularly important:

- The external file must be accessible.
- The referenced element must have the specified ID.
- Same-origin rules and CORS can affect whether the reference works.
- CSS rules are not always inherited in the same way as they are with inline SVG.
- External references should be tested in the browsers that the application needs to support.

## Browser Support for SVG Fragments

SVG fragment identifiers have been part of the SVG 1.1 specification for a long time. However, practical support varied between browsers and embedding methods.

A rough historical overview looks like this:

| Browser | Support |
|---|---|
| Firefox | Important support starting with Firefox 15, around 2012 |
| Internet Explorer | SVG support starting with IE9; better fragment support in later versions |
| Chrome | Initially partial support; considerably more stable from around Chrome 50 |
| Safari | Partial support; broader support from Safari 11.1 |
| Modern browsers | Generally well supported |

A distinction must be made between different use cases:

```html
<!-- Fragment within the same document -->
<use href="#icon-home"></use>

<!-- External SVG sprite -->
<use href="/icons.svg#icon-home"></use>

<!-- External SVG file with a named view -->
<img src="/map.svg#city-center" alt="City center">
```

These three variants are related, but they do not behave exactly the same way.

## SVG Fragments and Performance

SVG fragments primarily improve the organization and reuse of graphics. They do not automatically guarantee lower data transfer.

If a large SVG file is loaded as a sprite, the browser may initially download the entire file. The fragment identifier then determines which part is displayed. Caching, Brotli or GZIP compression, and a sensible file structure can still improve overall performance.

## Conclusion

SVG is a structured, scalable graphics technology for the web. Elements such as `<circle>`, `<rect>`, `<path>`, and `<polygon>` can be used to create simple and complex graphics.

SVG fragments extend this concept with addressable views and reusable parts. The `<view>` element can define specific sections of an SVG file, while `<symbol>` and `<use>` can be used to create SVG icon sprites:

```html
<use href="/assets/icons.svg#icon-home"></use>
```

SVG fragments and external `<use>` references are generally well supported in modern browsers. However, production applications should still take CORS, browser compatibility, CSS inheritance, accessibility, and the actual file size into account.
