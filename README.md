# Hassan Mohamed — Backend Software Engineer (3D Single-Page Portfolio)

An interactive **3D Single-Page Application (SPA)** built from scratch using **pure HTML5, CSS3, and Vanilla JavaScript** (zero external frameworks or build tools), tailored for **Hassan Mohamed — Backend Software Engineer (Java Spring Boot & PHP Laravel)**.

## Key Features

- **100% Pure HTML5, CSS3 & Vanilla JS 3D Engines**:
  - **Full-Viewport 3D Spatial Backdrop (`js/scene3d.js`)**: Custom perspective infrastructure grid, scroll-synced 3D polyhedral microservices core, orbiting nodes, and depth-sorted telemetry field.
  - **Interactive 3D System Architecture Lab (`js/topology3d.js`)**: 360° draggable 3D topologies for *E-Wallet Microservices (7-Service Saga)*, *Gasly IoT Telemetry & Spatial Routing*, *Paw & Claw Multi-Tenant SaaS (UUID v7)*, *BookFlex Microservices (Design Patterns & Redis Locks)*, and *Shopak Multi-Tenant SaaS (Laravel 12, 59 Tables, 244 APIs)* with animated request-flow traces and node inspection.
  - **Interactive 3D Fibonacci Tech Sphere (`js/sphere3d.js`)**: Spin through 32 core technologies in 3D space and highlight any of the 12 backend engineering domains.
  - **Hardware-Accelerated CSS 3D Cards & Holographic Rig**: Mouse-tracked `rotateX`/`rotateY` spatial cards, dynamic specular sheen, and 3D Z-layered portrait HUD.
- **Single-Page Architecture**:
  - Smooth anchor & scroll-spy routing across 7 depth layers (`Overview`, `3D Lab`, `Experience`, `Systems`, `Stack`, `Credentials`, `Contact`).
  - Live interactive JSON API terminal (`whoami`, `patterns`, `domains`, `availability`).
  - Filterable production systems grid with deep-dive **Architecture Case Study Modal**.
  - Quick-launch **Command Palette (`Ctrl+K` / `⌘K`)** and **3D: HIGH / ECO** performance toggle.
- **Grounded in Verified CV Data**:
  - Includes 5 years of production experience across **Visual Innovate**, **Future Sword**, and **Freelance Consulting**, open-source microservices repos, 12 technical skill domains, **Al-Alsun Higher Institute** degree, and all 5 certifications.
  - Direct **Download CV (PDF)** link to `Hassan Mohamed - Software Engineer CV.pdf`.

## Build & Maintenance

The site ships as static files with no runtime dependencies. One small Node script keeps the generated parts in sync:

```bash
node scripts/build.mjs          # regenerate everything
node scripts/build.mjs --check  # CI-friendly: exits 1 if anything is stale
```

It does three things:

1. **Pre-renders content for crawlers, ATS parsers and no-JS visitors.** Experience, projects, skills, credentials and hero metrics are rendered from `js/data.js` into `index.html` between `<!-- ssr:* -->` markers. `app.js` replaces that markup at runtime with the interactive version.
2. **Versions the service-worker cache by content hash**, so returning visitors always get fresh CSS/JS after a deploy.
3. **Bumps `sitemap.xml` `<lastmod>`** when the cached content changes.

Never edit the `ssr:*` regions by hand. Change `js/data.js` and rebuild instead.

To run it automatically before every commit, enable the bundled hook once per clone:

```bash
git config core.hooksPath .githooks
```

### Sharing links

`https://hassan-aamer.github.io/My_Portfolio/#project/<id>` opens the portfolio with that project's modal already open. The modal's **Copy Link** button copies this URL.

### Analytics (optional)

`js/analytics.js` supports [GoatCounter](https://www.goatcounter.com), which uses no cookies and collects no personal data. It is disabled until you set `GOATCOUNTER_CODE` in that file. Once enabled, it counts page views, CV downloads, outbound GitHub/LinkedIn/WhatsApp clicks, contact copies and project opens. Visits from localhost are never counted.

### Contact form spam protection

The form carries a FormSubmit `_honey` honeypot and a minimum fill-time check. Automated submissions are shown a fake success message and never sent.

### CI

`.github/workflows/ci.yml` runs on every push and PR. It checks that generated files are in sync, that JS syntax and the manifest are valid, and that every local file referenced by the pages and the service worker exists.

The social preview card (`images/og-cover.png`, 1200×630) is generated with `python3 scripts/og-image.py` (requires Pillow).

## Local Preview

Serve the directory over HTTP (recommended so ES/Service Worker features operate cleanly):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
