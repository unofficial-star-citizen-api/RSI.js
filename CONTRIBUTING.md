# Contributing to RSI.js

First of all, thank you for taking the time to contribute. o7

RSI.js is a community project. It only stays useful if people report and fix things when robertsspaceindustries.com changes, and that happens a lot. Every contribution helps, big or small.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Getting started](#getting-started)
- [Branching and release flow](#branching-and-release-flow)
- [Project structure](#project-structure)
- [Coding guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Adding a new module or endpoint](#adding-a-new-module-or-endpoint)
- [Fixing a scraper after an RSI change](#fixing-a-scraper-after-an-rsi-change)
- [Commit messages](#commit-messages)
- [Pull request checklist](#pull-request-checklist)
- [Reporting security issues](#reporting-security-issues)

## Ways to contribute

You don't have to write code to help:

- **Report a broken scraper.** RSI changed a page and a field is now empty or wrong? [Open a bug report](https://github.com/unofficial-star-citizen-api/RSI.js/issues/new?template=bug_report.yml) with the handle, SID or URL you used.
- **Request data.** Some RSI data isn't covered yet? [Open a feature request](https://github.com/unofficial-star-citizen-api/RSI.js/issues/new?template=feature_request.yml), and link the RSI page or endpoint if you know it.
- **Improve the docs.** Typos, missing examples and unclear explanations all count.
- **Write code.** Fix bugs, add modules, add tests. Issues labelled [`good first issue`](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [`help wanted`](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) are a good place to start.

Before starting significant work, comment on the issue (or open one) so we can agree on the approach and avoid duplicated effort.

## Getting started

### Prerequisites

- **Node.js**: CI runs on Node 26. Any current LTS should work for development.
- **pnpm**: the repository pins its version through the `packageManager` field. The easiest way to get it is `corepack enable`.
- **Docker** (optional), only if you want the [rotating proxy](docs/proxies.md#rotating-proxy-service).

### Setup

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/RSI.js.git
cd RSI.js

# 2. Install dependencies
pnpm install

# 3. (Optional) enable the repository's git hooks
git config core.hooksPath .githooks

# 4. Make sure everything is green before you change anything
pnpm run check
```

### Useful scripts

| Command | What it does |
|---|---|
| `pnpm run build` | Bundles CJS, ESM and browser builds with esbuild, then emits `.d.ts` declarations |
| `pnpm run build:watch` | Rebuilds the CJS bundle on change |
| `pnpm test` | Runs the Vitest suite once |
| `pnpm run test:watch` | Runs Vitest in watch mode |
| `pnpm run test:coverage` | Runs the tests with V8 coverage (report in `coverage/`) |
| `pnpm run lint` / `lint:fix` | Runs ESLint, or runs it and autofixes |
| `pnpm run typecheck` | Type-checks the sources and the tests (Vitest does not) |
| `pnpm run check` | Lint + type check + tests |
| `pnpm run ci` | Lint + type check + tests + build |
| `pnpm run docs` | Generates the documentation site in `site/` |
| `pnpm run docs:serve` | Serves `site/` locally (the site needs HTTP, opening the files directly does not work) |
| `pnpm run docs:watch` | Regenerates the site on change |
| `pnpm run docs:check` | Validates the doc comments, builds the site and checks every link |
| `pnpm run docs:links` | Checks the links of the already-built `site/` |

CI runs `pnpm run ci` and `pnpm run docs:check`.

### Trying your changes against the live site

Unit tests never touch the network (see [Testing](#testing)). To check your change against the real RSI website, build the project and run a small script from a scratch folder such as `debug/`. Don't commit it:

```javascript
// debug/main.js
import { RSI, RSIError } from '../dist/index.js';

const rsi = new RSI({ logging: true });
try {
  console.log(await rsi.users.getProfile('Dymerz'));
} catch (error) {
  console.error(error instanceof RSIError ? 'RSI Error:' : 'Error:', error);
}
```

```bash
pnpm run build && node debug/main.js
```

Please be gentle with RSI's servers while testing. If you need to make many requests, use the [rotating proxy](docs/proxies.md#rotating-proxy-service).

## Branching and release flow

```
your-branch ──PR──► staging ──merge commit──► main
                       │                        │
                       ▼                        ▼
          X.Y.Z-rc.N on GitHub Packages    X.Y.Z on npm
                 (dist-tag "next")         (dist-tag "latest")
```

- **Open pull requests against `staging`**, not `main`.
- Name branches after their purpose: `fix/org-member-count`, `feat/starmap-landing-zones`, `docs/readme-examples`.
- Every push to `staging` publishes a release candidate. Maintainers merge `staging` into `main` (with a merge commit) to ship a stable release.
- The documentation site follows the same flow: `staging` is published as a preview at [`/RSI.js/staging/`](https://unofficial-star-citizen-api.github.io/RSI.js/staging/), and `main` at [`/RSI.js/`](https://unofficial-star-citizen-api.github.io/RSI.js/).
- Maintainers handle versioning, so **don't bump the version** in `package.json`.

## Project structure

```
docs/                     # Hand-written guides, rendered in the documentation site
typedoc.json              # Documentation site configuration (TypeDoc + clean-jsdoc-theme)
typedoc/footer.html       # Footer of the documentation site
patches/                  # pnpm patches applied to the documentation theme
scripts/                  # Repository scripts (documentation link check)
site/                     # Generated documentation site (git-ignored)
src/
├── index.ts              # Public entry point, re-exports everything below
├── rsi.ts                # The RSI class: builds one HttpClient and every module
├── http-client.ts        # axios wrapper: proxies, NO_PROXY, UA, timeout, logging
├── logger.ts             # Global on/off console logger
├── errors/               # RSIError base class
├── helpers/              # Shared helpers (HttpHelper, ...)
├── types/                # Shared types, e.g. RSIResourceMeta
├── schemas/              # JSON schemas used by tests to validate result shapes
├── utils/validator.ts    # assertValidSchema() (Ajv)
├── mocks/                # HttpClientMock for tests
└── commands/
    └── <module>/                       # e.g. users, organizations, ships, starmaps ...
        ├── index.ts                    # Re-exports the module's public surface
        ├── <module>.ts                 # Public class wired into RSI (e.g. Users)
        ├── <module>-<feature>.ts       # One file per feature for larger modules
        ├── <module>-<feature>.test.ts  # Co-located tests
        ├── interfaces/                 # Result/param interfaces and enums + index.ts
        ├── errors/                     # Module-specific errors (e.g. RSIUserNotFoundError)
        └── mocks/                      # HTML/JSON fixtures captured from RSI
```

Build outputs go to `dist/`: `index.js` (CJS), `index.esm.js` (ESM), `index.browser[.min].js` (IIFE, global `RSI`) and the `.d.ts` files.

## Coding guidelines

ESLint enforces most of the style (`pnpm run lint:fix` fixes most of it). To summarize:

- **TypeScript strict mode.** No implicit `any`. Avoid explicit `any` outside tests.
- 2-space indentation, single quotes, semicolons.
- **Braces on their own line** (Allman style), as in the existing code:

  ```typescript
  public async getProfile(userHandle: string): Promise<RSIUserProfile | null>
  {
    if (response.status === 404)
      throw new RSIUserNotFoundError(userHandle);
  }
  ```

- Import internal modules with the `@/` alias (`import { HttpClient } from '@/http-client';`).
- Prefix public types with `RSI` (`RSIShip...`, `RSIOrganization...`) and export them from the module's `interfaces/index.ts`. Mark raw upstream response types that aren't part of the public API with `/** @internal */`. See [Documentation](#documentation) for `@internal` vs `@hidden`.
- Use **enums** for values that come from a fixed set (filters, boards, statuses) so users get autocompletion.

### Behaviour conventions

These rules keep the library's output consistent. Please follow them:

1. **Check the status code yourself.** `HttpClient` never throws on an HTTP status (`validateStatus: () => true`). Every command must check `response.status`, and RSI's `success` flag when there is one.
2. **Throw typed errors.** Use `RSIError` for upstream failures. When a resource does not exist, throw a subclass of `RSINotFoundError` from the module's `errors/` folder (see `RSIUserNotFoundError`); never return `null` or an empty result for a single-resource lookup. Throw a plain `Error` only for invalid user input.
3. **Validate and encode user input** before putting it in a URL (see `Users.encodeHandle`).
4. **Normalize the output:**
   - Make URLs absolute with `HttpClient.toAbsoluteUrl()`.
   - Put the resource's public RSI page in `meta.url` (`RSIResourceMeta`), never in a top-level `url`/`href`/`link`.
   - Return dates as ISO-8601 strings, and use `undefined` rather than empty strings (`HttpHelper.toStringOrUndefined`).
5. **Log through `createLogger(ClassName.name)`**, at `info` level for "what is being fetched". Never log bodies, headers or anything sensitive.
6. **Be polite to RSI.** When a command fans out into many requests, bound the concurrency (see `Ships.mapWithConcurrency`).

## Testing

We use **[Vitest](https://vitest.dev/)**. Tests live next to the code (`*.test.ts`) and **must not hit the network**, so CI stays deterministic and doesn't depend on RSI being up.

The usual pattern: capture a real response as a fixture, then stub the client's shared `HttpClient`. Every module uses `rsi.httpClient`, so tests go through `rsi.<module>` like users do:

```typescript
import fs from 'fs';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { RSI } from '../../rsi';

describe('Users.getProfile', () =>
{
  test('parses a profile page', async () =>
  {
    const rsi = new RSI();
    vi.spyOn(rsi.httpClient, 'get').mockResolvedValue({
      status: 200,
      data: fs.readFileSync(path.join(__dirname, 'mocks', 'profile.html'), 'utf8'),
    } as any);

    const profile = await rsi.users.getProfile('Dymerz');

    expect(profile?.handle).toBe('Dymerz');
  });
});
```

Guidelines:

- **Cover the error paths too**: 404 becomes a typed not-found error, non-200 and `success !== 1` become `RSIError`, and invalid input becomes `Error`.
- **Fixtures** go in the module's `mocks/` folder. Trim them to what the parser needs, and **remove personal data** you don't need (emails, real bios and so on). Use public, well-known handles and orgs when you can.
- For JSON results, consider validating the shape against a schema in `src/schemas/` with `assertValidSchema()` from `src/utils/validator.ts`.
- `HttpClientMock` (`src/mocks/http-client.mock.ts`) is available when you need to mock several URLs at once.

## Documentation

The [documentation site](https://unofficial-star-citizen-api.github.io/RSI.js/) is generated with [TypeDoc](https://typedoc.org/) and the [clean-jsdoc-theme](https://ankdev.me/clean-jsdoc-theme/theme/typedoc-getting-started). It has three sources:

- **The API reference** comes from the doc comments in `src/`. The code is the documentation: there is no separate API page to keep in sync.
- **The guides** are the Markdown files in `docs/`.
- **The home page** is `README.md`.

### Writing doc comments

Every exported class, interface, enum, type alias, function and method needs a doc comment. CI fails otherwise. On public methods, include:

```typescript
/**
 * Get a citizen's public profile: record number, display name, handle, badge, avatar,
 * enlisted date, location, fluency, website and bio.
 *
 * @param userHandle - Citizen handle, for example `Dymerz`
 * @returns The citizen profile
 * @throws Error if the handle is not a valid citizen handle
 * @throws {@link RSIUserNotFoundError} if no citizen has this handle
 * @throws {@link RSIError} if RSI answers with any other non-200 status
 *
 * @example
 * ```typescript
 * import { RSI } from '@unofficial-star-citizen-api/rsi.js';
 *
 * const rsi = new RSI();
 * const profile = await rsi.users.getProfile('Dymerz');
 * ```
 */
```

- **A summary** that says what the method returns, not how it works.
- **`@param`, `@returns`, and one `@throws` per error**, with the condition that triggers it.
- **An `@example`** that starts from `new RSI()` and runs as-is. Take example values from the test fixtures (real handles, SIDs and codes), not made-up ones.
- **`@category`** on every class and type: it decides the sidebar section. Use exactly one of:
  - `Commands` for module classes (`Users`, `Ships`...)
  - `Types/<Module>` for their results, parameters and enums, for example `Types/Users` or `Types/Progress trackers`
  - `Errors` for error classes
  - `Client` for `RSI`, its configuration and `HttpClient`

  Symbols without a category land in an unlabelled list after the sections. The section order is set by `docGroups` in `typedoc.json`.
- **Fields**: document the fields of result types users read directly, with units and formats (metres, USD, ISO dates). Raw upstream types that mirror RSI's JSON field by field only need a type-level comment; property comments are not enforced.
- **Link symbols** with `{@link RSIError}`, or `{@link Users.getProfile}` for a member (TypeDoc syntax, with a dot). Broken links fail CI.

Two rules specific to this codebase:

- **Methods exposed as properties.** When a module class wires a method from another file (`public readonly get: ...` in `Organizations`, `Starmaps`, `ProgressTrackers`), give the property an **explicit function type**, such as `(sid: string) => Promise<RSIOrganization>`, and put the doc comment on the property. Comments inside the factory or helper class are not shown, and `ReturnType<...>` or `Class['method']` types render as unreadable references.
- **Module constructors.** Users never create `Users`, `Ships` and the other modules: `RSI` does. Add `@hideconstructor` to the class comment and `/** @hidden */` to the constructor, so the docs never show `new Users(...)`. Don't write examples that construct a module either: go through `new RSI()`.
- **Hiding things.** Use `@hidden` to keep something out of the docs while still publishing its type, for example helper classes. Use `@internal` only for raw response types that should also be removed from the published `.d.ts` files (`stripInternal` is on). Don't give an `@internal` type the same name as a public one: TypeScript merges them.

### Guides

Guides are Markdown files in `docs/`. The frontmatter sets the page URL, the sidebar title, group and position:

```markdown
---
title: Proxies
slug: proxies
group: Guides
order: 3
---
```

- **Always set `slug`.** It fixes the page URL, so renaming or moving the file doesn't break links to it.
- **Link to another guide with a root path**: `[Configuration](/configuration)`, using its slug. The build prefixes it with the site's base path, so the link works on both the stable site and the staging preview. Relative links (`configuration.md`, `../configuration`) are rejected by the link check.
- **Link to the API with `{@link}`**: `{@link RSIError}` for a symbol, `{@link Users#getProfile}` for a member. In guides, members take a `#` (JSDoc syntax), not the dot used in doc comments.
- Don't add a `docs/index.md`: it would replace the README as the home page.

### Previewing and checking

```bash
pnpm run docs        # generate the site in site/
pnpm run docs:serve  # serve it on http://localhost:3000
pnpm run docs:check  # what CI runs: validates the doc comments, builds the site and checks every link
```

The site must be served over HTTP: search and the interactive parts don't work when you open the files directly. Use `pnpm run docs:watch` while you write.

When `docs:check` fails, it says what to fix:

- A missing comment names the symbol and the file, for example `RSIFoo, defined in src/commands/foo/interfaces/index.ts, does not have any documentation`.
- A broken link names the page and the link, for example `/proxies: broken link "/configuraton"` or `docs/proxies.md: {@link Users#getProfil} does not resolve to an API symbol`. The theme would otherwise render an unresolved guide link as plain text, and a broken page link as a 404.

`pnpm run docs:links` reruns only the link check on the current `site/`.

### Site configuration

The site is configured in `typedoc.json` (`cleanJsdocTheme` block):

- **Sidebar sections** come from `@category` (see above), ordered by `docGroups`.
- **Footer**: `typedoc/footer.html`. The logos are embedded as data URIs (built from `docs/assets/made-by-the-community-*-160.png`) so they work under any base path; the light/dark swap follows the site theme.
- **LLM support**: every page has a copy / open-in-Claude, ChatGPT or Perplexity button (`copyPage`), handed over with the `aiPrompt` context. The build also writes `llms.txt`, `llms-full.txt` and `sitemap.xml`, which need `siteUrl`.

The theme is pinned to an exact version and patched with [`pnpm patch`](https://pnpm.io/cli/patch). The patches live in `patches/` and are applied on every install:

- `@clean-jsdoc-theme/typedoc`: no Constructors section for classes whose constructor TypeDoc removed (`@hideconstructor`, `@hidden`).
- `@clean-jsdoc-theme/setu`: group the TypeDoc API sidebar by `@category` path instead of one flat list.

Each patch has a write-up next to it in `patches/` (problem, cause, fix), ready to be sent upstream. When you upgrade the theme, check whether these are fixed upstream. Otherwise recreate them with `pnpm patch @clean-jsdoc-theme/<package>@<version>`; pnpm fails the install if a patch no longer matches an installed version.

### Publishing

You don't publish the docs yourself. The [Docs workflow](.github/workflows/docs.yaml) rebuilds the site on every push to `staging` or `main` that touches `src/`, `docs/`, the README or the docs configuration:

- `staging` is published as a preview at <https://unofficial-star-citizen-api.github.io/RSI.js/staging/>
- `main` is published at <https://unofficial-star-citizen-api.github.io/RSI.js/>

## Adding a new module or endpoint

1. **Find the source.** Use your browser's dev tools on robertsspaceindustries.com to locate the HTML page, JSON endpoint or GraphQL query that holds the data. Note the URL, method and payload in your PR.
2. **Create `src/commands/<module>/`** following the [structure above](#project-structure): a public class, `interfaces/`, `mocks/` and an `index.ts`.
3. **Wire it up:**
   - export it from `src/commands/index.ts`
   - add a `public readonly <module>: <Class>` property to `RSI` in `src/rsi.ts`, and instantiate it in the constructor with the shared `httpClient`
4. **Write tests** against captured fixtures, covering both success and error cases.
5. **Document it** with doc comments: a summary and `@category` on the class, and `@param`, `@returns`, `@throws` and an `@example` on every public method (see [Documentation](#documentation)). Add a row for the module to the table in the README.

If you're adding a method to an existing module, the same rules apply: interface, fixture, tests and doc comments with an example.

## Fixing a scraper after an RSI change

This is the most common and most valuable kind of contribution:

1. Reproduce the problem with a small script (see [Trying your changes against the live site](#trying-your-changes-against-the-live-site)).
2. Save the **new** HTML/JSON response as a fixture, either replacing the old one or adding a new one next to it if both layouts still exist in the wild.
3. Write or update a test that fails with the current parser.
4. Fix the selectors or mapping until the test passes.
5. In the PR, mention what changed on RSI's side. A screenshot or a snippet of the new markup helps reviewers a lot.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

- **Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `ci`
- **Scope**: usually the module (`users`, `organizations`, `ships`, `starmaps`, `http-client`, `ci-cd`, ...)

Examples:

```
fix(organizations): parse member count after RSI header redesign
feat(starmaps): add landing zone lookup
docs(readme): document telemetry versions
```

If a change breaks the public API, say so with a `!` after the type/scope (`feat(users)!: ...`) and explain it in the commit body.

## Pull request checklist

Before you open a PR, please make sure that:

- [ ] the PR targets the **`staging`** branch
- [ ] `pnpm run ci` passes locally (lint, type check, tests and build)
- [ ] `pnpm run docs:check` passes, and public API changes are documented with an `@example`
- [ ] new or changed behaviour is covered by tests that don't use the network
- [ ] fixtures contain no unnecessary personal data
- [ ] public types are exported from the module's `index.ts`
- [ ] the PR description explains **what** changed and **why**, and links the related issue (`Closes #123`)

Keep PRs focused. Several small PRs are reviewed much faster than one big one.

## Reporting security issues

Please **do not open a public issue** for security vulnerabilities, for example something that would let a malicious RSI response or user input do harm in a consuming application. Use [GitHub's private vulnerability reporting](https://github.com/unofficial-star-citizen-api/RSI.js/security/advisories/new) instead.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](README.md#license) that covers this project.

---

Questions? Open an issue with the `question` label. We're happy to help. See you in the 'verse!
