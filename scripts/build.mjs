#!/usr/bin/env node
/**
 * Portfolio build/sync script (zero dependencies).
 *
 *  1. Pre-renders crawler / no-JS friendly HTML from js/data.js into index.html
 *     between `<!-- ssr:NAME -->` and `<!-- /ssr:NAME -->` markers. app.js replaces
 *     this markup at runtime, so JS users see the interactive version while
 *     search engines, ATS parsers and link previews still get the real content.
 *  2. Derives the service-worker CACHE_NAME from a content hash of every cached
 *     asset, so returning visitors always receive fresh CSS/JS after a deploy.
 *  3. Bumps sitemap.xml <lastmod> whenever the cached content actually changes.
 *
 * Usage:  node scripts/build.mjs          (writes files)
 *         node scripts/build.mjs --check  (exit 1 if anything is out of date)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* ---------------------------------------------------------------- data ---- */

const sandbox = { window: {} };
vm.runInNewContext(read('js/data.js'), sandbox, { filename: 'js/data.js' });
const { PROFILE, EXPERIENCE, PROJECTS, SKILL_DOMAINS, CREDENTIALS } = sandbox.window.PortfolioData;

const esc = (v) =>
    String(v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u.trim()) ? u.trim() : '#');
const indent = (html, pad) =>
    html
        .split('\n')
        .map((line) => (line.trim() ? pad + line : ''))
        .join('\n');

/* ------------------------------------------------------------ renderers --- */

const renderers = {
    metrics: () =>
        PROFILE.metrics
            .map(
                (m) => `<article class="metric-card card-3d" data-tilt-3d data-tilt-max="10">
    <span class="metric-value">${esc(m.value)}</span>
    <span class="metric-label">${esc(m.label)}</span>
    <span class="metric-meta">${esc(m.meta)}</span>
</article>`
            )
            .join('\n'),

    experience: () =>
        EXPERIENCE.map(
            (job) => `<article class="ssr-card">
    <h3>${esc(job.role)} &mdash; ${esc(job.company)}</h3>
    <p class="ssr-meta">${esc(job.period)} &bull; ${esc(job.location)}</p>
    <p>${esc(job.summary)}</p>
    <ul>
${job.highlights.map((h) => `        <li><strong>${esc(h.title)}:</strong> ${esc(h.description)}</li>`).join('\n')}
    </ul>
</article>`
        ).join('\n'),

    projects: () =>
        PROJECTS.map((p) => {
            const links = (p.links || [])
                .map((l) => `<a href="${esc(safeUrl(l.url))}" rel="noopener noreferrer">${esc(l.label)}</a>`)
                .join(' &bull; ');
            return `<article class="ssr-card">
    <h3>${esc(p.title)}</h3>
    <p class="ssr-meta">${esc(p.subtitle)} &bull; ${esc(p.primaryStack)}</p>
    <p>${esc(p.summary)}</p>${links ? `\n    <p>${links}</p>` : ''}
</article>`;
        }).join('\n'),

    skills: () =>
        SKILL_DOMAINS.map(
            (d) => `<article class="ssr-card">
    <h3>${esc(d.title)}</h3>
    <p>${d.items.map(esc).join(', ')}</p>
</article>`
        ).join('\n'),

    credentials: () => {
        const edu = CREDENTIALS.education;
        return [
            `<article class="ssr-card">
    <h3>Education</h3>
    <p><strong>${esc(edu.degree)}</strong></p>
    <p class="ssr-meta">${esc(edu.institution)} &bull; ${esc(edu.location)} &bull; ${esc(edu.period)}</p>
</article>`,
            `<article class="ssr-card">
    <h3>Certifications</h3>
    <ul>
${CREDENTIALS.certifications.map((c) => `        <li>${esc(c.title)} &mdash; ${esc(c.issuer)} (${esc(c.date)})</li>`).join('\n')}
    </ul>
</article>`,
            `<article class="ssr-card">
    <h3>Languages</h3>
    <ul>
${CREDENTIALS.languages.map((l) => `        <li>${esc(l.name)} &mdash; ${esc(l.level)}</li>`).join('\n')}
    </ul>
</article>`
        ].join('\n');
    }
};

/* ------------------------------------------------------------- index.html - */

let html = read('index.html');
for (const [name, render] of Object.entries(renderers)) {
    const re = new RegExp(`([ \\t]*)<!-- ssr:${name} -->[\\s\\S]*?<!-- /ssr:${name} -->`);
    const match = html.match(re);
    if (!match) throw new Error(`Missing <!-- ssr:${name} --> markers in index.html`);
    const pad = match[1];
    html = html.replace(
        re,
        `${pad}<!-- ssr:${name} -->\n${indent(render(), pad)}\n${pad}<!-- /ssr:${name} -->`
    );
}

/* ------------------------------------------------------ service worker ---- */

let sw = read('service-worker.js');
const assetBlock = sw.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/);
if (!assetBlock) throw new Error('ASSETS_TO_CACHE not found in service-worker.js');
const assets = [...assetBlock[1].matchAll(/'([^']+)'/g)]
    .map((m) => m[1])
    .filter((p) => p !== './')
    .sort();

const hash = createHash('sha256');
for (const asset of assets) {
    const rel = asset.replace(/^\.\//, '');
    hash.update(rel);
    // Hash the freshly generated index.html, not the stale copy on disk.
    hash.update(rel === 'index.html' ? html : readFileSync(join(ROOT, rel)));
}
const version = hash.digest('hex').slice(0, 10);
const prevVersion = (sw.match(/const CACHE_NAME = '([^']+)'/) || [])[1];
const nextCacheName = `hassan-backend-3d-${version}`;
sw = sw.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${nextCacheName}';`);

/* ------------------------------------------------------------- sitemap ---- */

let sitemap = read('sitemap.xml');
if (prevVersion !== nextCacheName) {
    const today = new Date().toISOString().slice(0, 10);
    sitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`);
}

/* --------------------------------------------------------------- write ---- */

const outputs = { 'index.html': html, 'service-worker.js': sw, 'sitemap.xml': sitemap };
const stale = Object.entries(outputs).filter(([p, content]) => read(p) !== content);

if (CHECK_ONLY) {
    if (stale.length) {
        console.error(`Out of date: ${stale.map(([p]) => p).join(', ')}. Run: node scripts/build.mjs`);
        process.exit(1);
    }
    console.log('Build artifacts are up to date.');
} else {
    for (const [p, content] of stale) writeFileSync(join(ROOT, p), content);
    console.log(stale.length ? `Updated: ${stale.map(([p]) => p).join(', ')}` : 'Nothing to update.');
    console.log(`Service worker cache: ${nextCacheName}`);
}
