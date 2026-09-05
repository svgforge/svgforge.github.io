# svgforge.github.io

Organization site for the svgforge GitHub organization, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Development

```sh
pnpm install
pnpm dev        # dev server (http://localhost:4321)
pnpm build      # static build into dist/
pnpm preview    # preview the static build
```

## Deployment

Any push to `main` triggers `.github/workflows/deploy.yml`, which builds the static site and deploys it to GitHub Pages (source: GitHub Actions).

The site is served at <https://svgforge.github.io/>.