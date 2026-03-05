/*!
 * Neon Prop Studio — main.js v2.0
 * Handles: Theme, RTL, Navbar Scroll, Reveal Animations,
 *          Stats Counters, Scroll-to-Top, Form Validation
 */

(function () {
    'use strict';

    /* ───────────────────────────────────────────
       1. THEME MANAGEMENT
    ─────────────────────────────────────────── */
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function getTheme() {
        return localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
            }
        }
        localStorage.setItem('theme', theme);
    }

    applyTheme(getTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }

    /* ───────────────────────────────────────────
       2. RTL TOGGLE
    ─────────────────────────────────────────── */
    const rtlToggle = document.getElementById('rtl-toggle');

    function applyRTL(dir) {
        html.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);
    }

    // Restore saved direction
    const savedDir = localStorage.getItem('dir') || 'ltr';
    applyRTL(savedDir);

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const current = html.getAttribute('dir') || 'ltr';
            applyRTL(current === 'ltr' ? 'rtl' : 'ltr');
        });
    }

    /* ───────────────────────────────────────────
       3. NAVBAR SCROLL
    ─────────────────────────────────────────── */
    const navbar = document.querySelector('.navbar-custom');

    function onNavbarScroll() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', onNavbarScroll, { passive: true });
    onNavbarScroll();

    /* ───────────────────────────────────────────
       4. SCROLL REVEAL ANIMATIONS
    ─────────────────────────────────────────── */
    function setupReveal() {
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        if (!revealEls.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    /* ───────────────────────────────────────────
       5. STATS COUNTER ANIMATION
    ─────────────────────────────────────────── */
    function setupCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1800;
                const step = 16;
                const increment = target / (duration / step);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current).toLocaleString();
                }, step);

                observer.unobserve(el);
            });
        }, { threshold: 0.4 });

        counters.forEach(c => observer.observe(c));
    }

    /* ───────────────────────────────────────────
       6. SCROLL TO TOP
    ─────────────────────────────────────────── */
    function setupScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ───────────────────────────────────────────
       7. ACTIVE NAV LINK
    ─────────────────────────────────────────── */
    function setActiveNavLink() {
        const links = document.querySelectorAll('.nav-link');
        const path = window.location.pathname.split('/').pop() || 'index.html';

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === path || href.endsWith(path) || (path === '' && href.includes('index.html')))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    /* ───────────────────────────────────────────
       8. FORM VALIDATION (Enhanced)
    ─────────────────────────────────────────── */
    function setupForms() {
        const forms = document.querySelectorAll('.needs-validation');
        forms.forEach(form => {
            form.addEventListener('submit', e => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    form.classList.add('was-validated');
                    return;
                }
                e.preventDefault();

                // Show success toast
                const toastEl = document.getElementById('authToast');
                const toastMsg = document.getElementById('toastMessage');
                if (toastEl && toastMsg) {
                    toastMsg.textContent = 'Message sent successfully!';
                    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
                    toast.show();
                }
                form.reset();
                form.classList.remove('was-validated');
            });
        });
    }

    /* ───────────────────────────────────────────
       9. LOADING STATE (Body)
    ─────────────────────────────────────────── */
    function onLoad() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    /* ───────────────────────────────────────────
       INIT
    ─────────────────────────────────────────── */
    onLoad();
    setupReveal();
    setupCounters();
    setupScrollTop();
    setActiveNavLink();
    setupForms();
})();
