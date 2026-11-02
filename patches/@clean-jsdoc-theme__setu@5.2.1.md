# TypeDoc: group the API sidebar by `@category`

Patch: [`@clean-jsdoc-theme__setu@5.2.1.patch`](./@clean-jsdoc-theme__setu@5.2.1.patch)
Package: `@clean-jsdoc-theme/setu` 5.2.1 (with `@clean-jsdoc-theme/typedoc` 5.2.1, TypeDoc 0.28.20)

## Problem

With the TypeDoc entry point, the API sidebar groups symbols by module only. A package with a single entry point is a single module, so every exported symbol ends up in one flat, alphabetical list. Our project has about 160 classes, interfaces, enums and type aliases in one list.

`@category` can't be used to split it, although the theme supports it for JSDoc, including nested paths such as `Types/Users`. The theme's docs mention this: *"`@category` does not shape the TypeDoc API sidebar"*.

```ts
/** @category Commands */
export class Users { /* ... */ }

/** @category Types/Users */
export interface RSIUserProfile { /* ... */ }
```

Expected: a **Commands** section, and a **Types** section with a **Users** folder.
Actual: `Users` and `RSIUserProfile` sit in the same flat list as everything else.

## Cause

The category is already parsed for TypeDoc pages. `renderContainerPage` calls `parseCategory(view.doclet)` and stores the path as `frontmatter.group`. But `assembleTypedocNav` sends every API page to `buildTypedocApiNav`, which places symbols by owning module only and never reads `frontmatter.group`.

The grouping logic exists: guide pages in the same function are grouped by `group` path with `buildGroupTree`, which handles nesting and ordering. API pages just never reach it.

## Fix

In `assembleTypedocNav`, send API pages that have a category to the same grouped tree as guides. Pages without a category keep the module hierarchy:

```diff
 function assembleTypedocNav({ apiPages = [], tutorials = [], docs = [], docGroups = [], home, source, menu }) {
-	const moduleNodes = buildTypedocApiNav(apiPages);
+	// API symbols with an @category (`Types/Users`) are grouped like docs, under that path;
+	// the others keep the module hierarchy. Section order follows `docGroups`.
+	const categorized = apiPages.filter((p) => p.frontmatter.group && !TYPEDOC_CONTAINER_KINDS.has(p.frontmatter.kind)).sort((a, b) => a.frontmatter.group.localeCompare(b.frontmatter.group));
+	const moduleNodes = buildTypedocApiNav(apiPages.filter((p) => !categorized.includes(p)));
 	const auxEntries = [];
 	const docSectionOrder = [];
+	for (const p of categorized) {
+		const path = p.frontmatter.group;
+		const top = splitGroupPath(path)[0];
+		if (top && !docSectionOrder.includes(top)) docSectionOrder.push(top);
+		auxEntries.push({
+			leaf: {
+				label: p.frontmatter.title,
+				slug: p.slug
+			},
+			path,
+			explicit: true,
+			order: p.frontmatter.order,
+			sort: "alpha"
+		});
+	}
```

- **Grouping:** categorized pages become entries of the existing grouped tree, so `Types/Users` renders as a **Types** section with a **Users** folder, as in the JSDoc sidebar.
- **Folder order:** pages are sorted by category path, so folders come out alphabetical rather than in source order.
- **Section order:** sections follow `docGroups`, for example `["Guides", "Client", "Commands", "Errors", "Types"]`. Sections not listed there come after, in order of appearance.
- **Modules:** module and namespace pages (`TYPEDOC_CONTAINER_KINDS`) are never moved, so multi-module projects keep their module tree.

## Why it is safe

- **Unchanged without categories:** projects with no `@category` produce the same sidebar as before, because `categorized` is empty.
- **No new parsing:** it only uses data the page already has (`frontmatter.group`, `frontmatter.order`) and the existing `buildGroupTree`.
- **JSDoc untouched:** the JSDoc sidebar has its own code path (`assembleNav`) and isn't affected.

## Alternative considered

Splitting the API into several TypeDoc entry points (one module per section) is the officially supported way to get sections. It broke about 60 `{@link}` references: TypeDoc resolves `{@link Users.getProfile}` in a type's comment within that comment's module, so it fails once the type and the class are in different modules. Fixing that would mean module-qualified links (`{@link Commands!Users.getProfile}`) throughout the source, which ties the code to the docs layout.

## Suggested upstream option

If changing the default is too broad, this could sit behind an option, for example `cleanJsdocTheme.typedocSidebar: "modules" | "categories"`.

## Verified

- Sidebar: Guides → Client → Commands → Errors → Types (alphabetical folders per module) → Source Files.
- Site: all 211 pages generated, internal links checked.
- `llms.txt`: its sections follow the new groups.
