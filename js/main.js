/**
 * Portfolio Main JavaScript - Enhanced Version
 * Handles animations, counters, form validation, and interactive features
 */

(function () {
    'use strict';

    /**
     * Progressive Loading - Top Progress Bar
     */
    function initProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        // Show progress bar immediately
        progressBar.classList.add('active');
        progressBar.style.width = '0%';

        // Simulate initial loading progress
        setTimeout(() => {
            progressBar.style.width = '30%';
        }, 100);

        // Progress to 60% when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                progressBar.style.width = '60%';
            });
        } else {
            progressBar.style.width = '60%';
        }

        // Complete when page fully loads
        window.addEventListener('load', () => {
            progressBar.style.width = '90%';

            setTimeout(() => {
                progressBar.classList.add('complete');
                progressBar.style.width = '100%';

                // Hide after completion
                setTimeout(() => {
                    progressBar.classList.add('hide');
                    progressBar.classList.remove('active');

                    // Reset for next navigation
                    setTimeout(() => {
                        progressBar.classList.remove('complete', 'hide');
                        progressBar.style.width = '0%';
                    }, 500);
                }, 300);
            }, 200);
        });
    }

    /**
     * Navigation Progress Bar (for page transitions)
     */
    function initNavigationProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        // Add click listeners to all navigation links
        const navLinks = document.querySelectorAll('a[href$=".html"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Show progress bar for navigation
                progressBar.classList.add('active');
                progressBar.style.width = '0%';

                setTimeout(() => {
                    progressBar.style.width = '70%';
                }, 50);
            });
        });
    }

    /**
     * Custom Cursor Functionality
     */
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (!cursorDot || !cursorOutline) return;

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
        const hoverElements = document.querySelectorAll('a, button, .social-icon-link, .filter-btn, .project-btn');

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
     * Scroll Animations using Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Statistics Counter Animation
     */
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    animateCounter(target, finalValue);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, stepTime);
    }

    /**
     * Skills Progress Bar Animation
     */
    function initSkillsAnimation() {
        const skillBars = document.querySelectorAll('.progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    /**
     * Project Filtering System
     */
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    /**
     * Contact Form Validation
     */
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = form.querySelector('.submit-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validate name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'الرجاء إدخال الاسم / Please enter your name');
                isValid = false;
            } else {
                removeError(nameInput);
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, 'الرجاء إدخال بريد إلكتروني صحيح / Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // Validate subject
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, 'الرجاء إدخال الموضوع / Please enter a subject');
                isValid = false;
            } else {
                removeError(subjectInput);
            }

            // Validate message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'الرجاء إدخال الرسالة / Please enter your message');
                isValid = false;
            } else {
                removeError(messageInput);
            }

            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Simulate form submission (replace with actual EmailJS or backend call)
                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    showSuccess();
                }, 1500);
            }
        });
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function removeError(input) {
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.style.display = 'none';
        }
    }

    function showSuccess() {
        const successMessage = document.querySelector('.form-success');
        if (successMessage) {
            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        }
    }

    /**
     * Smooth Scroll for Navigation Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    /**
     * Security Features
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
     * Back to Top Button
     */
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Initialize all features when DOM is ready
     */
    function init() {
        initTypewriter();
        initProgressBar();
        initNavigationProgress();
        initCustomCursor();
        initScrollAnimations();
        initStatsCounter();
        initSkillsAnimation();
        initProjectFilters();
        initFormValidation();
        initSmoothScroll();
        initSecurityFeatures();
        initBackToTop();
        // New UI/UX features
        initScrollProgress();
        initPageTransitions();
        initSectionReveal();
    }

    /**
     * Scroll Progress Indicator
     */
    function initScrollProgress() {
        // Create the progress bar element
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);

        // Update on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    /**
     * Page Transitions
     */
    function initPageTransitions() {
        // Add page transition class to body on load
        document.body.classList.add('page-transition');

        // Handle link clicks for smooth page exit
        const internalLinks = document.querySelectorAll('a[href$=".html"]');

        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only animate for internal links
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    e.preventDefault();
                    document.body.classList.add('page-exit');

                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    /**
     * Section Reveal on Scroll
     */
    function initSectionReveal() {
        const sections = document.querySelectorAll('section');

        // Immediately reveal sections that are in viewport on load
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                section.classList.add('revealed');
            }
        });

        // Create intersection observer for remaining sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Typewriter Effect
     */
    function initTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;

        const words = ['Full Stack Developer', 'Software Engineer', 'Laravel Expert', 'Problem Solver'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster deletion
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
