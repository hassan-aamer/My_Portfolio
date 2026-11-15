/**
 * Single-Page Application controller for Hassan Mohamed's 3D Backend Portfolio.
 * Orchestrates DOM rendering, 3D tilt physics, scroll-spy, interactive modals,
 * command palette, and form uplink without external frameworks.
 */
(function (global) {
    'use strict';

    const {
        PROFILE,
        TOPOLOGIES,
        EXPERIENCE,
        PROJECTS,
        SKILL_DOMAINS,
        SPHERE_TAGS,
        CREDENTIALS
    } = global.PortfolioData;

    const AppState = {
        ecoMode: false,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        activeExperienceId: EXPERIENCE[0].id,
        activeProjectFilter: 'all',
        activeSkillDomain: null,
        skillSearchQuery: '',
        universeScene: null,
        topology3d: null,
        sphere3d: null,
        lastFocusedElement: null
    };

    /* ----------------------------------------------------------------------
       DOM & Safety Helpers
       ---------------------------------------------------------------------- */

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            setTimeout(() => toast.remove(), 220);
        }, 2600);
    }

    async function copyToClipboard(text, label) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const helper = document.createElement('textarea');
                helper.value = text;
                helper.style.position = 'fixed';
                helper.style.left = '-9999px';
                document.body.appendChild(helper);
                helper.select();
                const copied = document.execCommand('copy');
                helper.remove();
                if (!copied) {
                    throw new Error('Clipboard copy command was rejected');
                }
            }
            showToast(`Copied ${label || text} to clipboard`);
        } catch (err) {
            showToast(`Could not copy automatically: ${text}`);
        }
    }

    /* ----------------------------------------------------------------------
       3D Spatial Tilt Physics for [data-tilt-3d]
       ---------------------------------------------------------------------- */

    function bindTilt3D(root) {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const targets = (root || document).querySelectorAll('[data-tilt-3d]');
        targets.forEach((el) => {
            if (el.dataset.tiltBound === '1') return;
            el.dataset.tiltBound = '1';

            const maxDeg = Number(el.dataset.tiltMax || 8);
            let tiltRafId = 0;
            let lastX = 0;
            let lastY = 0;

            el.addEventListener('pointermove', (e) => {
                if (AppState.ecoMode || AppState.reducedMotion) return;
                lastX = e.clientX;
                lastY = e.clientY;
                if (tiltRafId) return;

                tiltRafId = requestAnimationFrame(() => {
                    tiltRafId = 0;
                    const rect = el.getBoundingClientRect();
                    if (!rect.width || !rect.height) return;

                    const px = (lastX - rect.left) / rect.width;
                    const py = (lastY - rect.top) / rect.height;

                    const rotateY = (px - 0.5) * 2 * maxDeg;
                    const rotateX = (0.5 - py) * 2 * maxDeg;

                    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
                    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
                    el.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
                });
            });

            el.addEventListener('pointerleave', () => {
                if (tiltRafId) {
                    cancelAnimationFrame(tiltRafId);
                    tiltRafId = 0;
                }
                el.style.transform = '';
            });
        });
    }

    /* ----------------------------------------------------------------------
       Hero Metrics & Interactive Backend Terminal
       ---------------------------------------------------------------------- */

    function renderHeroMetrics() {
        const host = document.getElementById('heroMetrics');
        if (!host) return;

        host.innerHTML = PROFILE.metrics
            .map(
                (m) => `
                <article class="metric-card card-3d" data-tilt-3d data-tilt-max="10">
                    <span class="metric-value">${escapeHtml(m.value)}</span>
                    <span class="metric-label">${escapeHtml(m.label)}</span>
                    <span class="metric-meta">${escapeHtml(m.meta)}</span>
                </article>
            `
            )
            .join('');
    }

    function formatHighlightedJson(obj) {
        const raw = JSON.stringify(obj, null, 2);
        return escapeHtml(raw).replace(
            /(&quot;(?:\\.|(?!&quot;).)*&quot;)(\s*:)?|\b(\d+(?:\.\d+)?)\b/g,
            (match, strToken, colonSuffix, numToken) => {
                if (strToken) {
                    const cls = colonSuffix ? 'json-key' : 'json-str';
                    return `<span class="${cls}">${strToken}</span>${colonSuffix || ''}`;
                }
                if (numToken) {
                    return `<span class="json-num">${numToken}</span>`;
                }
                return match;
            }
        );
    }

    function initTerminalConsole() {
        const tabs = document.querySelectorAll('.term-tab');
        const endpointEl = document.getElementById('termEndpoint');
        const statusEl = document.getElementById('termStatus');
        const outputEl = document.getElementById('termOutput');
        if (!endpointEl || !statusEl || !outputEl) return;

        function setCommand(key) {
            const entry = PROFILE.terminalCommands[key] || PROFILE.terminalCommands.whoami;
            endpointEl.textContent = entry.endpoint;
            statusEl.textContent = entry.status;
            outputEl.innerHTML = formatHighlightedJson(entry.payload);

            tabs.forEach((btn) => {
                const active = btn.dataset.term === key;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', String(active));
            });
        }

        tabs.forEach((btn) => {
            btn.addEventListener('click', () => setCommand(btn.dataset.term));
        });

        setCommand('whoami');
    }

    /* ----------------------------------------------------------------------
       Interactive 3D System Architecture Lab
       ---------------------------------------------------------------------- */

    function initTopologyLab() {
        const canvas = document.getElementById('topology-canvas');
        if (!canvas || !global.TopologyVisualizer3D) return;

        const badgeEl = document.getElementById('topoBadge');
        const titleEl = document.getElementById('topoTitle');
        const taglineEl = document.getElementById('topoTagline');
        const stackEl = document.getElementById('topoStack');
        const nodeListEl = document.getElementById('topoNodeList');
        const footerEl = document.getElementById('topoFooter');

        const nodeShortEl = document.getElementById('nodeShortCode');
        const nodeTitleEl = document.getElementById('nodeTitle');
        const nodeRoleEl = document.getElementById('nodeRole');
        const nodeDetailsEl = document.getElementById('nodeDetails');

        function updateNodeInspector(node, topology) {
            if (!nodeShortEl || !nodeTitleEl || !nodeRoleEl || !nodeDetailsEl || !nodeListEl) return;

            nodeShortEl.textContent = node.short;
            nodeShortEl.style.borderColor = node.color;
            nodeShortEl.style.color = node.color;
            nodeTitleEl.textContent = node.label;
            nodeRoleEl.textContent = node.role;
            nodeDetailsEl.textContent = node.details;

            const chips = nodeListEl.querySelectorAll('.node-chip');
            chips.forEach((chip) => {
                chip.classList.toggle('is-active', chip.dataset.nodeId === node.id);
            });

            if (badgeEl) {
                badgeEl.textContent = `${topology.badge} // ${node.label}`;
            }
        }

        const visualizer = new global.TopologyVisualizer3D(canvas, updateNodeInspector);
        AppState.topology3d = visualizer;

        function loadTopology(key) {
            const topo = TOPOLOGIES[key] || TOPOLOGIES.ewallet;
            if (!titleEl || !taglineEl || !stackEl || !nodeListEl || !footerEl) return;

            document.querySelectorAll('.topo-btn').forEach((btn) => {
                const active = btn.dataset.topology === topo.id;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', String(active));
            });

            titleEl.textContent = topo.name;
            taglineEl.textContent = topo.tagline;
            stackEl.innerHTML = topo.stack
                .map((item) => `<span class="tech-pill">${escapeHtml(item)}</span>`)
                .join('');

            nodeListEl.innerHTML = topo.nodes
                .map(
                    (n, i) => `
                    <button type="button" class="node-chip ${i === 0 ? 'is-active' : ''}" data-node-id="${escapeHtml(n.id)}">
                        ${escapeHtml(n.label)}
                    </button>
                `
                )
                .join('');

            nodeListEl.querySelectorAll('.node-chip').forEach((chip) => {
                chip.addEventListener('click', () => {
                    visualizer.selectNode(chip.dataset.nodeId);
                });
            });

            footerEl.innerHTML = topo.repoUrl
                ? `<a href="${escapeHtml(topo.repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-glass">View Source on GitHub</a>`
                : `<span class="mono-label">PRODUCTION CLIENT ARCHITECTURE</span>`;

            visualizer.setTopology(topo);
        }

        document.querySelectorAll('.topo-btn').forEach((btn) => {
            btn.addEventListener('click', () => loadTopology(btn.dataset.topology));
        });

        const traceBtn = document.getElementById('topoTraceBtn');
        const orbitBtn = document.getElementById('topoOrbitBtn');
        const zoomInBtn = document.getElementById('topoZoomIn');
        const zoomOutBtn = document.getElementById('topoZoomOut');
        const resetBtn = document.getElementById('topoReset');

        if (traceBtn) {
            traceBtn.addEventListener('click', () => visualizer.triggerFlow());
        }
        if (orbitBtn) {
            orbitBtn.addEventListener('click', () => {
                const next = !visualizer.autoOrbit;
                visualizer.setAutoOrbit(next);
                orbitBtn.classList.toggle('is-active', next);
                orbitBtn.setAttribute('aria-pressed', String(next));
            });
        }
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => visualizer.zoomBy(-55));
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => visualizer.zoomBy(55));
        if (resetBtn) resetBtn.addEventListener('click', () => visualizer.resetView());

        loadTopology('ewallet');
        AppState.loadTopology = loadTopology;
    }

    /* ----------------------------------------------------------------------
       Professional Experience Section
       ---------------------------------------------------------------------- */

    function renderExperience() {
        const selectorEl = document.getElementById('expSelector');
        const stageEl = document.getElementById('expStage');
        if (!selectorEl || !stageEl) return;

        const selectorItems = [
            ...EXPERIENCE.map((exp) => ({
                id: exp.id,
                company: exp.company,
                badge: exp.badge,
                role: `${exp.role} • ${exp.location}`,
                period: exp.period
            })),
            {
                id: 'all',
                company: 'Full Career Timeline',
                badge: 'ALL 3 ROLES',
                role: 'Visual Innovate + Future Sword + Freelance',
                period: 'Aug 2022 – Present'
            }
        ];

        selectorEl.innerHTML = selectorItems
            .map(
                (item) => `
                <button
                    type="button"
                    class="exp-tab ${item.id === AppState.activeExperienceId ? 'is-active' : ''}"
                    data-exp-id="${escapeHtml(item.id)}"
                    role="tab"
                    aria-selected="${item.id === AppState.activeExperienceId}"
                >
                    <div class="exp-tab-top">
                        <span class="exp-tab-company">${escapeHtml(item.company)}</span>
                        <span class="exp-tab-badge">${escapeHtml(item.badge)}</span>
                    </div>
                    <span class="exp-tab-role">${escapeHtml(item.role)}</span>
                    <span class="exp-tab-period">${escapeHtml(item.period)}</span>
                </button>
            `
            )
            .join('');

        function renderStage(selectedId) {
            AppState.activeExperienceId = selectedId;

            selectorEl.querySelectorAll('.exp-tab').forEach((btn) => {
                const active = btn.dataset.expId === selectedId;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', String(active));
            });

            const list = selectedId === 'all'
                ? EXPERIENCE
                : EXPERIENCE.filter((exp) => exp.id === selectedId);

            stageEl.innerHTML = list
                .map(
                    (exp) => `
                    <article class="exp-role-panel glass-panel">
                        <div class="exp-role-header">
                            <div>
                                <h3>${escapeHtml(exp.company)}</h3>
                                <span class="exp-role-sub">${escapeHtml(exp.role)}</span>
                            </div>
                            <div class="exp-role-meta">
                                <div>${escapeHtml(exp.period)}</div>
                                <div>${escapeHtml(exp.location)}</div>
                            </div>
                        </div>
                        <p class="exp-summary">${escapeHtml(exp.summary)}</p>
                        <div class="exp-deliverables">
                            ${exp.highlights
                                .map(
                                    (h) => `
                                    <div class="deliverable-card card-3d" data-tilt-3d data-tilt-max="6">
                                        <h4>${escapeHtml(h.title)}</h4>
                                        <span class="deliverable-stack">${escapeHtml(h.stack)}</span>
                                        <p>${escapeHtml(h.description)}</p>
                                        ${
                                            h.projectId
                                                ? `<button type="button" class="deliverable-link" data-open-project="${escapeHtml(h.projectId)}">Inspect Architecture &rarr;</button>`
                                                : ''
                                        }
                                    </div>
                                `
                                )
                                .join('')}
                        </div>
                    </article>
                `
                )
                .join('');

            stageEl.querySelectorAll('[data-open-project]').forEach((btn) => {
                btn.addEventListener('click', () => openProjectModal(btn.dataset.openProject));
            });

            bindTilt3D(stageEl);
        }

        selectorEl.querySelectorAll('.exp-tab').forEach((btn) => {
            btn.addEventListener('click', () => renderStage(btn.dataset.expId));
        });

        renderStage(AppState.activeExperienceId);
    }

    /* ----------------------------------------------------------------------
       Projects Showcase & Case Study Modal
       ---------------------------------------------------------------------- */

    function renderProjects(filterKey) {
        AppState.activeProjectFilter = filterKey || 'all';
        const gridEl = document.getElementById('projectsGrid');
        if (!gridEl) return;

        document.querySelectorAll('#projectFilters .filter-pill').forEach((pill) => {
            const isActive = pill.dataset.filter === AppState.activeProjectFilter;
            pill.classList.toggle('is-active', isActive);
            pill.setAttribute('aria-pressed', String(isActive));
        });

        const visible = AppState.activeProjectFilter === 'all'
            ? PROJECTS
            : PROJECTS.filter((p) => p.categories.includes(AppState.activeProjectFilter));

        gridEl.innerHTML = visible
            .map(
                (project, idx) => `
                <article class="project-card glass-panel card-3d" data-tilt-3d data-tilt-max="8">
                    <div class="project-card-top">
                        <span class="project-index">SYS-${String(idx + 1).padStart(2, '0')}</span>
                        ${project.featured ? '<span class="project-featured-tag">CORE SYSTEM</span>' : ''}
                    </div>

                    <div>
                        <h3>${escapeHtml(project.title)}</h3>
                        <span class="project-subtitle">${escapeHtml(project.subtitle)}</span>
                    </div>

                    <p class="project-summary">${escapeHtml(project.summary)}</p>

                    <div class="project-stack-line">${escapeHtml(project.primaryStack)}</div>

                    <div class="project-actions">
                        <button type="button" class="ctrl-btn ctrl-btn-accent" data-inspect-project="${escapeHtml(project.id)}">
                            Inspect Architecture
                        </button>
                        ${project.links
                            .map(
                                (link) => `
                                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="ctrl-btn">
                                    ${escapeHtml(link.label)} &nearr;
                                </a>
                            `
                            )
                            .join('')}
                    </div>
                </article>
            `
            )
            .join('');

        gridEl.querySelectorAll('[data-inspect-project]').forEach((btn) => {
            btn.addEventListener('click', () => openProjectModal(btn.dataset.inspectProject));
        });

        bindTilt3D(gridEl);
    }

    function initProjectFilters() {
        const bar = document.getElementById('projectFilters');
        if (!bar) return;

        bar.querySelectorAll('.filter-pill').forEach((pill) => {
            pill.addEventListener('click', () => renderProjects(pill.dataset.filter));
        });

        renderProjects('all');
    }

    function resolveSafeFocusTarget(preferredEl) {
        if (!preferredEl) return null;
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.contains(preferredEl)) {
            return document.getElementById('mobileMenuBtn');
        }
        return preferredEl;
    }

    function openProjectModal(projectId) {
        const project = PROJECTS.find((p) => p.id === projectId);
        const modal = document.getElementById('projectModal');
        const subtitleEl = document.getElementById('modalSubtitle');
        const titleEl = document.getElementById('modalTitle');
        const bodyEl = document.getElementById('modalBody');
        if (!project || !modal || !subtitleEl || !titleEl || !bodyEl) return;

        const previousFocus = resolveSafeFocusTarget(document.activeElement);
        if (AppState.closeMobileDrawer) {
            AppState.closeMobileDrawer({ restoreFocus: false });
        }
        if (AppState.closePalette) {
            AppState.closePalette({ restoreFocus: false });
        }
        AppState.lastFocusedElement = previousFocus;
        subtitleEl.textContent = project.subtitle;
        titleEl.textContent = project.title;

        bodyEl.innerHTML = `
            <p class="panel-copy">${escapeHtml(project.summary)}</p>

            <div class="modal-section-box">
                <h4>Architecture Pattern</h4>
                <p style="margin:0;color:var(--text-primary);font-weight:600;">${escapeHtml(project.architecture.pattern)}</p>
            </div>

            <div class="modal-section-box">
                <h4>Core Modules &amp; Services</h4>
                <div class="inspector-stack">
                    ${project.architecture.services
                        .map((svc) => `<span class="tech-pill">${escapeHtml(svc)}</span>`)
                        .join('')}
                </div>
            </div>

            <div class="modal-section-box">
                <h4>Key Engineering Decisions</h4>
                <ul class="modal-decisions">
                    ${project.architecture.engineeringDecisions
                        .map((item) => `<li>${escapeHtml(item)}</li>`)
                        .join('')}
                </ul>
            </div>

            <div class="modal-section-box">
                <h4>Technology Stack</h4>
                <div class="project-stack-line">${escapeHtml(project.primaryStack)}</div>
            </div>

            ${
                project.links.length
                    ? `<div class="hero-cta-row" style="margin-bottom:0;">
                        ${project.links
                            .map(
                                (link) => `
                                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                                    <span>${escapeHtml(link.label)}</span>
                                    <span>&nearr;</span>
                                </a>
                            `
                            )
                            .join('')}
                    </div>`
                    : ''
            }
        `;

        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) closeBtn.focus();
    }

    function closeProjectModal(options) {
        const modal = document.getElementById('projectModal');
        if (!modal || modal.hidden) return;
        const shouldRestoreFocus = !options || options.restoreFocus !== false;
        modal.hidden = true;
        document.body.style.overflow = '';
        if (
            shouldRestoreFocus &&
            AppState.lastFocusedElement &&
            document.contains(AppState.lastFocusedElement) &&
            typeof AppState.lastFocusedElement.focus === 'function'
        ) {
            AppState.lastFocusedElement.focus();
        }
    }

    /* ----------------------------------------------------------------------
       3D Tech Sphere & 12-Domain Engineering Matrix
       ---------------------------------------------------------------------- */

    function renderSkillsGrid() {
        const gridEl = document.getElementById('skillsGrid');
        const activeLabelEl = document.getElementById('activeDomainLabel');
        const resetBtn = document.getElementById('resetDomainBtn');
        if (!gridEl) return;

        const rawQuery = AppState.skillSearchQuery.trim();
        const query = rawQuery.toLowerCase();
        const activeDomainId = AppState.activeSkillDomain;
        let queryMatchCount = 0;

        const cardsHtml = SKILL_DOMAINS.map((domain) => {
            const matchedItems = query
                ? domain.items.filter((item) => item.toLowerCase().includes(query))
                : domain.items;
            const titleMatches = Boolean(query && domain.title.toLowerCase().includes(query));
            const hasQueryMatch = Boolean(query && (matchedItems.length > 0 || titleMatches));
            if (hasQueryMatch) {
                queryMatchCount += 1;
            }

            // Keep highlight and dim classes strictly mutually exclusive.
            const isHighlighted = query
                ? hasQueryMatch
                : Boolean(activeDomainId && domain.id === activeDomainId);
            const isDimmed = query
                ? !hasQueryMatch
                : Boolean(activeDomainId && domain.id !== activeDomainId);

            return `
                <article
                    class="skill-domain-card glass-panel ${isHighlighted ? 'is-highlighted' : ''} ${isDimmed ? 'is-dimmed' : ''}"
                    data-domain-id="${escapeHtml(domain.id)}"
                >
                    <div class="skill-domain-head">
                        <h3>${escapeHtml(domain.title)}</h3>
                        <span class="skill-count">${domain.items.length}</span>
                    </div>
                    <div class="skill-pills">
                        ${domain.items
                            .map((skill) => {
                                const match = Boolean(query && skill.toLowerCase().includes(query));
                                return `<span class="skill-pill ${match ? 'is-match' : ''}">${escapeHtml(skill)}</span>`;
                            })
                            .join('')}
                    </div>
                </article>
            `;
        }).join('');

        if (activeLabelEl && resetBtn) {
            if (query) {
                activeLabelEl.textContent = `Search: "${rawQuery}" (${queryMatchCount} ${queryMatchCount === 1 ? 'domain' : 'domains'})`;
                resetBtn.hidden = false;
            } else if (activeDomainId) {
                const domainObj = SKILL_DOMAINS.find((d) => d.id === activeDomainId);
                activeLabelEl.textContent = domainObj ? domainObj.title : 'Filtered Domain';
                resetBtn.hidden = false;
            } else {
                activeLabelEl.textContent = 'All 12 Engineering Domains';
                resetBtn.hidden = true;
            }
        }

        gridEl.innerHTML = cardsHtml;
    }

    function initSkillsObservatory() {
        const sphereStage = document.getElementById('sphereStage');
        const searchInput = document.getElementById('skillsSearch');
        const resetBtn = document.getElementById('resetDomainBtn');

        renderSkillsGrid();

        if (sphereStage && global.TechSphere3D) {
            AppState.sphere3d = new global.TechSphere3D(sphereStage, SPHERE_TAGS, (tag) => {
                AppState.activeSkillDomain = tag.domain;
                renderSkillsGrid();
                const domainSelector = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
                    ? CSS.escape(tag.domain)
                    : tag.domain;
                const targetCard = document.querySelector(`.skill-domain-card[data-domain-id="${domainSelector}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                AppState.skillSearchQuery = e.target.value;
                renderSkillsGrid();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                AppState.activeSkillDomain = null;
                if (searchInput) {
                    searchInput.value = '';
                    AppState.skillSearchQuery = '';
                }
                document.querySelectorAll('.sphere-tag.is-selected').forEach((el) => el.classList.remove('is-selected'));
                renderSkillsGrid();
            });
        }
    }

    /* ----------------------------------------------------------------------
       Credentials (Education, Certifications & Languages)
       ---------------------------------------------------------------------- */

    function renderCredentials() {
        const gridEl = document.getElementById('credentialsGrid');
        if (!gridEl) return;

        const { education, certifications, languages } = CREDENTIALS;

        gridEl.innerHTML = `
            <article class="cred-education glass-panel card-3d" data-tilt-3d data-tilt-max="6">
                <span class="mono-label">EDUCATION // ${escapeHtml(education.period)}</span>
                <h3 class="cred-title">${escapeHtml(education.institution)}</h3>
                <p class="cred-sub">${escapeHtml(education.degree)}</p>
                <span class="mono-label" style="color:var(--text-muted);">${escapeHtml(education.location)}</span>
                <div class="cred-coursework">
                    ${education.coursework.map((c) => `<span class="tech-pill">${escapeHtml(c)}</span>`).join('')}
                </div>
            </article>

            <article class="cred-languages glass-panel card-3d" data-tilt-3d data-tilt-max="6">
                <span class="mono-label">LANGUAGES &amp; COMMUNICATION</span>
                <h3 class="cred-title">Bilingual Engineering Collaboration</h3>
                <div class="lang-list">
                    ${languages
                        .map(
                            (lang) => `
                            <div class="lang-item">
                                <div class="lang-top">
                                    <strong>${escapeHtml(lang.name)}</strong>
                                    <span>${escapeHtml(lang.level)}</span>
                                </div>
                                <p>${escapeHtml(lang.detail)}</p>
                            </div>
                        `
                        )
                        .join('')}
                </div>
            </article>

            <article class="cred-certs glass-panel">
                <span class="mono-label">VERIFIED CERTIFICATIONS (${certifications.length})</span>
                <h3 class="cred-title">Continuous Architecture &amp; AI Engineering Growth</h3>
                <div class="certs-cards">
                    ${certifications
                        .map(
                            (cert) => `
                            <div class="cert-card card-3d" data-tilt-3d data-tilt-max="8">
                                <span class="cert-track">${escapeHtml(cert.track)}</span>
                                <h4>${escapeHtml(cert.title)}</h4>
                                <div class="cert-meta">
                                    <span>${escapeHtml(cert.issuer)}</span>
                                    <span>${escapeHtml(cert.date)}</span>
                                </div>
                            </div>
                        `
                        )
                        .join('')}
                </div>
            </article>
        `;

        bindTilt3D(gridEl);
    }

    /* ----------------------------------------------------------------------
       Contact Uplink & Clipboard Actions
       ---------------------------------------------------------------------- */

    function initContact() {
        document.querySelectorAll('.copy-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                copyToClipboard(btn.dataset.copy, btn.dataset.copy);
            });
        });

        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const statusText = document.getElementById('formStatusText');
        if (!form || !submitBtn || !statusText) return;

        function setFieldError(inputEl, hasError) {
            const group = inputEl.closest('.field-group');
            if (group) {
                group.classList.toggle('has-error', hasError);
            }
        }

        function validateForm() {
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');
            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                return false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let valid = true;

            const nameBad = nameInput.value.trim().length < 2;
            setFieldError(nameInput, nameBad);
            if (nameBad) valid = false;

            const emailBad = !emailPattern.test(emailInput.value.trim());
            setFieldError(emailInput, emailBad);
            if (emailBad) valid = false;

            const subjectBad = subjectInput.value.trim().length < 3;
            setFieldError(subjectInput, subjectBad);
            if (subjectBad) valid = false;

            const msgBad = messageInput.value.trim().length < 10;
            setFieldError(messageInput, msgBad);
            if (msgBad) valid = false;

            return valid;
        }

        form.querySelectorAll('input, textarea').forEach((el) => {
            el.addEventListener('input', () => setFieldError(el, false));
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusText.classList.remove('is-error');
            statusText.textContent = '';

            if (!validateForm()) {
                statusText.classList.add('is-error');
                statusText.textContent = 'Please complete all required fields.';
                return;
            }

            submitBtn.disabled = true;
            const originalLabel = submitBtn.innerHTML;
            submitBtn.textContent = 'Transmitting...';

            try {
                const payload = new FormData(form);
                const response = await fetch('https://formsubmit.co/ajax/hassanaamer048@gmail.com', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: payload
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = typeof response.json === 'function'
                    ? await response.json().catch(() => null)
                    : null;
                if (result && (result.success === false || result.success === 'false')) {
                    throw new Error(result.message || 'Submission rejected');
                }

                form.reset();
                statusText.textContent = '200 OK — Message transmitted successfully.';
                showToast('Message sent! Hassan will respond shortly.');
            } catch (error) {
                statusText.classList.add('is-error');
                statusText.textContent = `Transmission failed (${error.message}). Please email hassanaamer048@gmail.com directly.`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalLabel;
            }
        });
    }

    /* ----------------------------------------------------------------------
       SPA Navigation, Depth Rail, Mobile Drawer & 3D Camera Sync
       ---------------------------------------------------------------------- */

    function initNavigationAndScrollSpy() {
        const sections = document.querySelectorAll('section[data-section]');
        const navLinks = document.querySelectorAll('[data-nav]');
        const depthReadout = document.getElementById('depthReadout');
        const progressBar = document.getElementById('scroll-progress');

        const mobileDrawer = document.getElementById('mobileDrawer');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileDrawerClose = document.getElementById('mobileDrawerClose');

        function setMobileDrawer(open, options) {
            if (!mobileDrawer || !mobileMenuBtn) return;
            const targetOpen = Boolean(open);
            const wasOpen = mobileDrawer.classList.contains('is-open');
            if (wasOpen === targetOpen) return;

            if (targetOpen) {
                closeProjectModal({ restoreFocus: false });
                if (AppState.closePalette) AppState.closePalette({ restoreFocus: false });
            }

            mobileDrawer.classList.toggle('is-open', targetOpen);
            mobileDrawer.setAttribute('aria-hidden', String(!targetOpen));
            mobileMenuBtn.setAttribute('aria-expanded', String(targetOpen));
            document.body.style.overflow = targetOpen ? 'hidden' : '';

            if (!targetOpen && options && options.restoreFocus) {
                mobileMenuBtn.focus();
            }
        }

        AppState.closeMobileDrawer = (options) => setMobileDrawer(false, options);

        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => setMobileDrawer(true));
        if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', () => setMobileDrawer(false, { restoreFocus: true }));
        if (mobileDrawer) {
            mobileDrawer.addEventListener('click', (e) => {
                if (e.target === mobileDrawer) setMobileDrawer(false, { restoreFocus: true });
            });
        }

        function setActiveSection(sectionId, depthCode) {
            navLinks.forEach((link) => {
                link.classList.toggle('is-active', link.dataset.nav === sectionId);
            });
            if (depthReadout && depthCode) {
                depthReadout.textContent = `Z: ${depthCode}`;
            }
            if (AppState.universeScene) {
                AppState.universeScene.setSection(sectionId);
            }
        }

        // Smooth SPA hash routing
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.dataset.nav;
                const targetEl = document.getElementById(targetId);
                if (!targetEl) return;

                e.preventDefault();
                setMobileDrawer(false);
                targetEl.scrollIntoView({ behavior: AppState.reducedMotion ? 'auto' : 'smooth' });
                if (history.replaceState) {
                    history.replaceState(null, '', `#${targetId}`);
                }
            });
        });

        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(entry.target.dataset.section, entry.target.dataset.depth);
                        }
                    });
                },
                { rootMargin: '-38% 0px -48% 0px', threshold: 0.01 }
            );
            sections.forEach((sec) => observer.observe(sec));
        }

        function syncScrollProgress() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0
                ? Math.min(1, Math.max(0, window.scrollY / docHeight))
                : 0;
            if (progressBar) {
                progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
            }
            if (AppState.universeScene) {
                AppState.universeScene.setScrollProgress(progress);
            }
        }

        let scrollTicking = false;
        function scheduleScrollSync() {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
                scrollTicking = false;
                syncScrollProgress();
            });
        }

        syncScrollProgress();
        window.addEventListener('scroll', scheduleScrollSync, { passive: true });
        window.addEventListener('resize', scheduleScrollSync, { passive: true });
    }

    /* ----------------------------------------------------------------------
       Command Palette (Ctrl+K / Cmd+K)
       ---------------------------------------------------------------------- */

    function initCommandPalette() {
        const palette = document.getElementById('commandPalette');
        const inputEl = document.getElementById('cmdInput');
        const listEl = document.getElementById('cmdList');
        const triggerBtn = document.getElementById('cmdTrigger');
        const mobileCmdBtn = document.getElementById('mobileCmdBtn');
        const closeBtn = document.getElementById('cmdCloseBtn');
        if (!palette || !inputEl || !listEl) return;

        const commands = [
            { title: 'Go to Overview & Terminal', tag: 'SECTION', run: () => navigateTo('overview') },
            { title: 'Open 3D System Architecture Lab', tag: 'SECTION', run: () => navigateTo('architecture') },
            { title: 'Load 3D Blueprint: E-Wallet 7-Service Saga', tag: '3D LAB', run: () => loadBlueprint('ewallet') },
            { title: 'Load 3D Blueprint: Gasly IoT & Spatial DB', tag: '3D LAB', run: () => loadBlueprint('gasly') },
            { title: 'Load 3D Blueprint: Paw & Claw UUID v7 SaaS', tag: '3D LAB', run: () => loadBlueprint('pawclaw') },
            { title: 'Go to Production Experience', tag: 'SECTION', run: () => navigateTo('experience') },
            { title: 'Go to Production Systems & Projects', tag: 'SECTION', run: () => navigateTo('projects') },
            { title: 'Filter Java & Spring Boot Systems', tag: 'FILTER', run: () => filterAndScroll('java') },
            { title: 'Filter PHP & Laravel Systems', tag: 'FILTER', run: () => filterAndScroll('php') },
            { title: 'Go to 3D Stack Observatory', tag: 'SECTION', run: () => navigateTo('skills') },
            { title: 'Go to Education & Certifications', tag: 'SECTION', run: () => navigateTo('credentials') },
            { title: 'Go to Direct Uplink / Contact', tag: 'SECTION', run: () => navigateTo('contact') },
            { title: 'Copy Email Address (hassanaamer048@gmail.com)', tag: 'ACTION', run: () => copyToClipboard(PROFILE.email, 'Email') },
            { title: 'Copy Phone / WhatsApp (+20 1129730475)', tag: 'ACTION', run: () => copyToClipboard(PROFILE.phone, 'Phone') },
            { title: 'Download CV (PDF)', tag: 'FILE', run: () => window.open(encodeURI(PROFILE.cvPath), '_blank', 'noopener,noreferrer') }
        ];

        let focusedIdx = 0;
        let filteredCommands = commands;

        function navigateTo(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: AppState.reducedMotion ? 'auto' : 'smooth' });
        }

        function loadBlueprint(key) {
            navigateTo('architecture');
            if (AppState.loadTopology) AppState.loadTopology(key);
        }

        function filterAndScroll(filterKey) {
            renderProjects(filterKey);
            navigateTo('projects');
        }

        function renderList() {
            const q = inputEl.value.trim().toLowerCase();
            filteredCommands = q
                ? commands.filter((c) => c.title.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q))
                : commands;
            focusedIdx = 0;

            listEl.innerHTML = filteredCommands.length
                ? filteredCommands
                      .map(
                          (cmd, i) => `
                          <li>
                              <button type="button" class="cmd-item ${i === focusedIdx ? 'is-focused' : ''}" data-cmd-index="${i}">
                                  <span>${escapeHtml(cmd.title)}</span>
                                  <span class="cmd-item-tag">${escapeHtml(cmd.tag)}</span>
                              </button>
                          </li>
                      `
                      )
                      .join('')
                : '<li class="cmd-item" style="color:var(--text-muted);cursor:default;">No matching commands</li>';

            listEl.querySelectorAll('[data-cmd-index]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const idx = Number(btn.dataset.cmdIndex);
                    closePalette();
                    if (filteredCommands[idx]) filteredCommands[idx].run();
                });
            });
        }

        function openPalette() {
            const previousFocus = resolveSafeFocusTarget(document.activeElement);
            if (AppState.closeMobileDrawer) {
                AppState.closeMobileDrawer({ restoreFocus: false });
            }
            closeProjectModal({ restoreFocus: false });
            AppState.lastFocusedElement = previousFocus;
            palette.hidden = false;
            document.body.style.overflow = 'hidden';
            inputEl.value = '';
            renderList();
            inputEl.focus();
        }

        function closePalette(options) {
            if (palette.hidden) return;
            const shouldRestoreFocus = !options || options.restoreFocus !== false;
            palette.hidden = true;
            document.body.style.overflow = '';
            if (
                shouldRestoreFocus &&
                AppState.lastFocusedElement &&
                document.contains(AppState.lastFocusedElement) &&
                typeof AppState.lastFocusedElement.focus === 'function'
            ) {
                AppState.lastFocusedElement.focus();
            }
        }

        AppState.closePalette = closePalette;

        if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
        if (mobileCmdBtn) mobileCmdBtn.addEventListener('click', openPalette);
        if (closeBtn) closeBtn.addEventListener('click', closePalette);
        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });

        inputEl.addEventListener('input', renderList);
        inputEl.addEventListener('keydown', (e) => {
            if (!filteredCommands.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusedIdx = (focusedIdx + 1) % filteredCommands.length;
                updateFocused();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusedIdx = (focusedIdx - 1 + filteredCommands.length) % filteredCommands.length;
                updateFocused();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const cmd = filteredCommands[focusedIdx];
                closePalette();
                if (cmd) cmd.run();
            }
        });

        function updateFocused() {
            listEl.querySelectorAll('[data-cmd-index]').forEach((btn) => {
                btn.classList.toggle('is-focused', Number(btn.dataset.cmdIndex) === focusedIdx);
            });
        }

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (palette.hidden) {
                    openPalette();
                } else {
                    closePalette();
                }
            } else if (e.key === 'Escape') {
                closePalette();
                closeProjectModal();
                if (AppState.closeMobileDrawer) AppState.closeMobileDrawer({ restoreFocus: true });
            }
        });
    }

    /* ----------------------------------------------------------------------
       FX Toggle, Modals, Boot Dismiss & Service Worker
       ---------------------------------------------------------------------- */

    function initGlobalControls() {
        const fxToggle = document.getElementById('fxToggle');
        const fxLabel = document.getElementById('fxLabel');

        if (fxToggle && fxLabel) {
            fxToggle.addEventListener('click', () => {
                AppState.ecoMode = !AppState.ecoMode;
                fxToggle.setAttribute('aria-pressed', String(AppState.ecoMode));
                fxLabel.textContent = AppState.ecoMode ? '3D: ECO' : '3D: HIGH';
                if (AppState.universeScene) {
                    AppState.universeScene.setEcoMode(AppState.ecoMode);
                }
                if (AppState.topology3d) {
                    AppState.topology3d.setEcoMode(AppState.ecoMode);
                }
                if (AppState.sphere3d) {
                    AppState.sphere3d.setEcoMode(AppState.ecoMode);
                }
                if (AppState.ecoMode) {
                    document.querySelectorAll('[data-tilt-3d]').forEach((el) => {
                        el.style.transform = '';
                    });
                }
                showToast(AppState.ecoMode ? 'Switched 3D engine to Eco mode' : 'Switched 3D engine to High fidelity');
            });
        }

        const modal = document.getElementById('projectModal');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeProjectModal();
            });
        }
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        const isHttp = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (!isHttp) return;

        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').catch(() => {
                // Service worker registration is progressive; safe to ignore when unavailable.
            });
        });
    }

    function bootstrap() {
        const universeCanvas = document.getElementById('universe-canvas');
        if (universeCanvas && global.UniverseScene3D) {
            AppState.universeScene = new global.UniverseScene3D(universeCanvas);
        }

        renderHeroMetrics();
        initTerminalConsole();
        initTopologyLab();
        renderExperience();
        initProjectFilters();
        initSkillsObservatory();
        renderCredentials();
        initContact();
        initNavigationAndScrollSpy();
        initCommandPalette();
        initGlobalControls();
        bindTilt3D(document);
        registerServiceWorker();

        // Dismiss preloader immediately once initial frame mounts
        const loader = document.getElementById('boot-loader');
        if (loader) {
            requestAnimationFrame(() => loader.classList.add('is-done'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})(window);
