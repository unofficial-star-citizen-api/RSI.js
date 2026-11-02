# TypeDoc: classes with a hidden constructor still render `new X()`

Patch: [`@clean-jsdoc-theme__typedoc@5.2.1.patch`](./@clean-jsdoc-theme__typedoc@5.2.1.patch)
Package: `@clean-jsdoc-theme/typedoc` 5.2.1 (with `@clean-jsdoc-theme/setu` 5.2.1, TypeDoc 0.28.20)

## Problem

A class marked `@hideconstructor`, or whose constructor is `@hidden`, still gets a **Constructors** section. The signature shows no parameters, for example `new Users(): Users`. The real constructor has parameters, and the author asked for it to be hidden.

```ts
/**
 * Citizen profiles. Access it through `rsi.users`.
 * @hideconstructor
 */
export class Users
{
  /** @hidden */
  constructor(httpClient: HttpClient) { /* ... */ }
}
```

Expected: no Constructors section, as with the JSDoc entry point.
Actual: a Constructors section with `new Users(): Users`.

## Cause

`setu` renders the Constructors section unless the class doclet has `hideconstructor: true` (`renderContainerPage`: `if (view.kind === "class" && !view.doclet.hideconstructor)`). The flag is in the utils doclet schema, and the JSDoc entry point sets it from the `@hideconstructor` tag.

The TypeDoc bridge never sets it, and it can't get it from the tag:

1. TypeDoc handles `@hideconstructor` itself. Its `CommentPlugin` removes the constructor reflection, then calls `comment.removeModifier("@hideconstructor")` on the class. A `@hidden` constructor is removed in the same way.
2. By the time the bridge converts the class, it has no `Constructor` child and no `@hideconstructor` modifier.
3. `adaptContainer` only reads constructor parameters `if (signature)`. With no constructor it leaves `params` empty, and `setu` still emits the section, built from the class name.

Mapping the `@hideconstructor` modifier in `commentFields` doesn't help, because TypeDoc strips it before the bridge runs.

## Fix

In `adaptContainer`, mark the class as having a hidden constructor when TypeDoc left it without one:

```diff
 function adaptContainer(reflection, doclet, resolveLink) {
 	const ctor = reflection.children?.find((c) => c.kindOf(ReflectionKind.Constructor));
+	// TypeDoc removes the constructor of a class marked @hideconstructor (or a @hidden constructor):
+	// render no Constructors section for it instead of an empty `new X()` signature.
+	if (!ctor && reflection.kindOf(ReflectionKind.Class)) doclet.hideconstructor = true;
 	const signature = firstSignature(ctor);
```

## Why it is safe

- TypeDoc creates a `Constructor` reflection for every class, including the implicit one of a class that declares no constructor. So a class with no constructor child means TypeDoc removed it on purpose.
- The check is limited to `ReflectionKind.Class`. Interfaces also go through `adaptContainer` but never have a Constructors section.
- Classes whose constructor is documented are unchanged. In our project, `RSI`, `HttpClient` and the error classes still render their full constructors, such as `new RSI(config: RSIConfig): RSI` with its parameter table.

## Verified

- 12 classes with `@hideconstructor` + `@hidden` constructor: no Constructors section.
- Classes with public constructors: unchanged.
- Rest of the site: 211 pages generated, no new warnings.
