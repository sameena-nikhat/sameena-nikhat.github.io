// Sticky nav shadow on scroll
const nav = document.querySelector('.nav');
if (nav) {
    const onScroll = () => {
        if (window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const expanded = navLinks.classList.contains('open');
        navToggle.setAttribute('aria-expanded', String(expanded));
    });
    navLinks.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// Reveal-on-scroll
const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealItems.forEach((el) => io.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add('visible'));
}

// Animated counters on stats
const counters = document.querySelectorAll('.stat-num[data-target]');
if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const plus = el.dataset.plus === 'true';
        const suffix = plus ? '+' : '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.floor(target * eased);
            el.textContent = value + (t === 1 ? suffix : '');
            if (t < 1) requestAnimationFrame(step);
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

// Footer year
const yearSlot = document.querySelector('[data-year]');
if (yearSlot) yearSlot.textContent = new Date().getFullYear();
