/**
 * Portfolio Main JavaScript
 * Handles custom cursor and security features
 */

(function() {
    'use strict';

    /**
     * Custom Cursor Functionality
     */
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (!cursorDot || !cursorOutline) {
            console.warn('Custom cursor elements not found');
            return;
        }

        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { 
                duration: 500, 
                fill: 'forwards' 
            });
        });

        // Add hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .social-icon-link');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    /**
     * Security Features
     * Prevents right-click and F12/DevTools shortcuts
     */
    function initSecurityFeatures() {
        // Prevent right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Prevent F12 and Ctrl+Shift+I (DevTools shortcuts)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
            }
        });
    }

    /**
     * Initialize all features when DOM is ready
     */
    function init() {
        initCustomCursor();
        initSecurityFeatures();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
