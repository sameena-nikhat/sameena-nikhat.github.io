// ===== Theme switching =====
// Pre-paint application of the saved/preferred theme happens via an inline
// snippet in each page's <head> to avoid a flash. This script keeps the
// switcher buttons in sync and persists user choice.

const THEME_KEY = 'profile-theme';
const THEMES = ['cream', 'snow', 'dark'];

function currentTheme() {
    const attr = document.documentElement.dataset.theme;
    return THEMES.includes(attr) ? attr : 'cream';
}

function applyTheme(name, { persist = true } = {}) {
    if (!THEMES.includes(name)) return;
    document.documentElement.dataset.theme = name;
    if (persist) {
        try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* ignore */ }
    }
    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
        const isActive = btn.dataset.themeSet === name;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
}

document.querySelectorAll('[data-theme-set]').forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeSet));
});

// Sync active state to whatever was set before this script ran.
applyTheme(currentTheme(), { persist: false });

// Follow system preference changes when the user hasn't explicitly chosen.
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const onSystemChange = (e) => {
    try {
        if (localStorage.getItem(THEME_KEY)) return; // user override wins
    } catch (err) { /* ignore */ }
    applyTheme(e.matches ? 'dark' : 'cream', { persist: false });
};
if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onSystemChange);
else if (typeof mq.addListener === 'function') mq.addListener(onSystemChange);

// ===== Sticky nav shadow on scroll =====
const nav = document.querySelector('.nav');
if (nav) {
    const onScroll = () => {
        if (window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });
    navLinks.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ===== Reveal-on-scroll =====
const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealItems.forEach((el) => io.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add('visible'));
}

// ===== Animated counters on stats =====
const counters = document.querySelectorAll('[data-target]');
if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10);
        if (Number.isNaN(target)) return;
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(target * eased);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    };
    const io2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                io2.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach((el) => io2.observe(el));
}

// ===== Footer year =====
document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
});
