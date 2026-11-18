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

To run it automatically before every commit, enable the bundled hook once per clone:

```bash
git config core.hooksPath .githooks
```

The social preview card (`images/og-cover.png`, 1200×630) is generated with `python3 scripts/og-image.py` (requires Pillow).

## Local Preview

Serve the directory over HTTP (recommended so ES/Service Worker features operate cleanly):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
