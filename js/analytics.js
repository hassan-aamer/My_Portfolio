/**
 * Privacy-friendly, opt-in analytics (GoatCounter: no cookies, no personal data, GDPR-friendly).
 *
 * Disabled until GOATCOUNTER_CODE is set. To enable:
 *   1. Create a free site at https://www.goatcounter.com/signup (e.g. code "hassan-portfolio").
 *   2. Put that code below, then rebuild (node scripts/build.mjs) and deploy.
 *
 * Tracked automatically: page views, CV downloads, outbound GitHub/LinkedIn/WhatsApp clicks,
 * and email/phone copy actions. app.js additionally reports project modal opens.
 */
(function (global) {
    'use strict';

    const GOATCOUNTER_CODE = 'hassan-portfolio';

    const noop = { track: function () {} };
    if (!GOATCOUNTER_CODE || !/^[a-z0-9-]+$/i.test(GOATCOUNTER_CODE)) {
        global.PortfolioAnalytics = noop;
        return;
    }

    // Skip local development so test visits never pollute the numbers.
    if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:') {
        global.PortfolioAnalytics = noop;
        return;
    }

    const queue = [];

    function track(name) {
        const payload = { path: `event/${name}`, title: name, event: true };
        if (global.goatcounter && typeof global.goatcounter.count === 'function') {
            global.goatcounter.count(payload);
        } else {
            queue.push(payload);
        }
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
    script.addEventListener('load', () => {
        while (queue.length && global.goatcounter && global.goatcounter.count) {
            global.goatcounter.count(queue.shift());
        }
    });
    document.head.appendChild(script);

    document.addEventListener(
        'click',
        (e) => {
            const el = e.target instanceof Element ? e.target.closest('a, button') : null;
            if (!el) return;

            if (el.matches('a[download]')) {
                track('cv-download');
            } else if (el.matches('a[href*="github.com"]')) {
                track('outbound-github');
            } else if (el.matches('a[href*="linkedin.com"]')) {
                track('outbound-linkedin');
            } else if (el.matches('a[href*="wa.me"]')) {
                track('outbound-whatsapp');
            } else if (el.matches('a[href^="mailto:"]')) {
                track('email-click');
            } else if (el.matches('[data-copy]')) {
                track('copy-contact');
            }
        },
        { capture: true, passive: true }
    );

    global.PortfolioAnalytics = { track: track };
})(window);
