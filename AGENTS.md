## Blog publishing workflow — German source, English publication

Blog articles are written in **German** as local drafts and **published in English
only**. German is NEVER rendered on the website — it only ever lives as source
files outside the content collection.

- German originals live in `notes/de/<slug>.md` **outside this repo** in the
  private workspace, tracked in the
  workspace backup git repo. They are never part of this (public) repository
  and never rendered: the content collection in `content.config.ts` only loads
  `src/content/blog/`. The German filename is the **English slug** of the
  eventual post (mapping by same basename, 1:1). The German title is the
  content's heading, NOT the filename.
- English translations live in `src/content/blog/<slug>.md`. Publish states:
  - `draft: true` → English translation in progress, visible only in
    `astro dev`, excluded from the static build (all routes already filter
    `data.draft !== true` in production).
  - no `draft` (or `draft: false`) → published.
- Workflow: write DE source in `notes/de/` (workspace) → translate to EN →
  create the EN file with `draft: true` in `src/content/blog/` → on approval
  remove the `draft` field.
- Renaming an English slug requires renaming the German source file too.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
