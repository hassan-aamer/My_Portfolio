/**
 * Component Loader - Loads reusable HTML components
 * Professional approach for static HTML sites
 * Works with both file:// protocol (offline) and http:// (server)
 */

(function () {
    'use strict';

    // Inline components as fallback for file:// protocol
    const HEADER_HTML = `
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <i class="bi-terminal me-2"></i>Hassan
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html" data-page="index">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="about.html" data-page="about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="projects.html" data-page="projects">Projects</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="contact.html" data-page="contact">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>`;

    const FOOTER_HTML = `
    <footer class="site-footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-12 text-center">
                    <p class="copyright-text mb-3">Copyright © 2026 <a href="#">Hassan Mohamed</a>. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>`;

    /**
     * Load HTML component - tries fetch first, falls back to inline
     */
    async function loadComponent(componentPath, targetSelector, fallbackHtml, callback) {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        // Check if we're on file:// protocol
        const isFileProtocol = window.location.protocol === 'file:';

        if (isFileProtocol) {
            // Use inline fallback for file:// protocol
            target.innerHTML = fallbackHtml;
            if (callback) callback();
        } else {
            // Try fetch for http:// protocol
            try {
                const response = await fetch(componentPath);
                if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
                target.innerHTML = await response.text();
                if (callback) callback();
            } catch (error) {
                // Fallback to inline if fetch fails
                target.innerHTML = fallbackHtml;
                if (callback) callback();
            }
        }
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavLink() {
        const pathname = window.location.pathname;
        const currentPage = pathname.split('/').pop().replace('.html', '') || 'index';
        const navLinks = document.querySelectorAll('.nav-link[data-page]');

        navLinks.forEach(link => {
            const pageName = link.getAttribute('data-page');
            if (pageName === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Initialize Bootstrap offcanvas after loading
     */
    function initBootstrapComponents() {
        const offcanvasElement = document.getElementById('offcanvasNavbar');
        if (offcanvasElement && typeof bootstrap !== 'undefined') {
            new bootstrap.Offcanvas(offcanvasElement);
        }
    }

    /**
     * Initialize all components
     */
    async function initComponents() {
        // Load Header
        await loadComponent('components/header.html', '#header-placeholder', HEADER_HTML, () => {
            setActiveNavLink();
            initBootstrapComponents();
        });

        // Load Footer
        await loadComponent('components/footer.html', '#footer-placeholder', FOOTER_HTML);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }

})();
