// Checks every internal link of the generated documentation site.
//
// Usage: node scripts/check-docs-links.mjs [siteDir]   (default: site)
//
// Fails when a link points to a page, file or #anchor that does not exist, or when a link is
// relative (`configuration.md`, `../x`): relative links break depending on whether the page URL
// ends with a slash. Link to guides with root paths (`/configuration`) and to the API with
// `{@link Symbol}`; the theme prefixes both with the site's basePath.
import {
  existsSync, readdirSync, readFileSync 
} from 'node:fs';
import {
  join, relative, sep 
} from 'node:path';

const siteDir = process.argv[2] ?? 'site';
const config = JSON.parse(readFileSync('typedoc.json', 'utf8'));
const basePath = (config.cleanJsdocTheme?.basePath ?? '/').replace(/\/?$/, '/');

if (!existsSync(siteDir))
{
  console.error(`No site found in "${siteDir}". Run \`pnpm run docs\` first.`);
  process.exit(1);
}

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir)
{
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

/** Site file served for a URL path (without basePath), or undefined */
function fileFor(urlPath)
{
  const clean = decodeURIComponent(urlPath).replace(/^\/+|\/+$/g, '');
  const candidates = [join(siteDir, clean, 'index.html'), join(siteDir, clean)];
  return candidates.find(candidate => existsSync(candidate) && !candidate.endsWith(sep));
}

const idCache = new Map();
function idsOf(file)
{
  if (!idCache.has(file))
  {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map(match => match[1])));
  }
  return idCache.get(file);
}

const problems = [];
let checked = 0;

for (const file of htmlFiles(siteDir))
{
  const page = '/' + relative(siteDir, file).split(sep).join('/').replace(/(^|\/)index\.html$/, '');
  // Source viewer pages only link back to theme assets; skip them to keep the check fast
  if (page.startsWith('/source/'))
    continue;

  const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]*)"/g))
  {
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href))
      continue; // external URL, mailto:, data: ...

    checked++;
    const [path, hash] = href.split('#');
    let target = file;

    if (path)
    {
      if (!path.startsWith('/'))
      {
        problems.push(`${page}: relative link "${href}", use a root link such as "/configuration"`);
        continue;
      }
      if (!path.startsWith(basePath) && path !== basePath.slice(0, -1))
      {
        problems.push(`${page}: link "${href}" is outside the site base path "${basePath}"`);
        continue;
      }
      target = fileFor(path.slice(basePath.length));
      if (!target)
      {
        problems.push(`${page}: broken link "${href}"`);
        continue;
      }
    }

    // `#L<n>` on a source page selects a line in the code viewer, not an element id
    const isSourceLine = /^L\d+$/.test(hash ?? '') && path.slice(basePath.length).startsWith('source/');
    if (hash && !isSourceLine && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash)))
      problems.push(`${page}: missing anchor "${href}"`);
  }
}

// The theme renders an unresolved `{@link X}` in a guide as plain code, without a warning:
// check that every `{@link}` written in docs/*.md became a real link on its page.
const docsDir = config.cleanJsdocTheme?.docs;
if (docsDir && existsSync(docsDir))
{
  for (const name of readdirSync(docsDir).filter(entry => entry.endsWith('.md')))
  {
    const markdown = readFileSync(join(docsDir, name), 'utf8');
    const slug = /^slug:\s*(.+)$/m.exec(markdown)?.[1].trim() ?? name.replace(/\.md$/, '');
    const pageFile = fileFor(slug);
    if (!pageFile)
    {
      problems.push(`${docsDir}/${name}: no page generated at "/${slug}"`);
      continue;
    }
    const html = readFileSync(pageFile, 'utf8');
    for (const [, target] of markdown.matchAll(/\{@link(?:code|plain)?\s+([^}\s|]+)/g))
    {
      checked++;
      const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`<a [^>]*>(?:<code[^>]*>)?${escaped}(?:</code>)?</a>`).test(html))
        problems.push(`${docsDir}/${name}: {@link ${target}} does not resolve to an API symbol`);
    }
  }
}

if (problems.length)
{
  console.error(`Found ${problems.length} broken documentation link(s):`);
  for (const problem of [...new Set(problems)])
    console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`Documentation links OK (${checked} links checked).`);
