// Self-contained theme system.
// Loaded synchronously in <head> so it runs before first paint and before
// the user can possibly click anything. Handles persistence, system-pref
// fallback, click handling via event delegation, and active-state sync.
(function () {
    var KEY = 'profile-theme';
    var THEMES = ['cream', 'snow', 'dark'];

    function syncButtons(name) {
        var btns = document.querySelectorAll('[data-theme-set]');
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            var on = btn.getAttribute('data-theme-set') === name;
            if (on) btn.classList.add('active'); else btn.classList.remove('active');
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
    }

    function apply(name, persist) {
        if (THEMES.indexOf(name) < 0) name = 'cream';
        document.documentElement.dataset.theme = name;
        if (persist) {
            try { localStorage.setItem(KEY, name); } catch (e) { /* private mode */ }
        }
        // Buttons may not exist yet during the first apply (running in <head>).
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { syncButtons(name); }, { once: true });
        } else {
            syncButtons(name);
        }
    }

    // Initial apply — saved choice wins; otherwise follow OS pref.
    try {
        var saved = localStorage.getItem(KEY);
        if (saved && THEMES.indexOf(saved) >= 0) {
            apply(saved, false);
        } else {
            apply(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'cream', false);
        }
    } catch (e) {
        apply('cream', false);
    }

    // Click handling via event delegation — works as soon as buttons appear.
    document.addEventListener('click', function (e) {
        var target = e.target && e.target.closest ? e.target.closest('[data-theme-set]') : null;
        if (!target) return;
        apply(target.getAttribute('data-theme-set'), true);
    });

    // Follow OS pref changes only when the user has not made an explicit choice.
    try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function (e) {
            try {
                if (localStorage.getItem(KEY)) return;
            } catch (err) { /* ignore */ }
            apply(e.matches ? 'dark' : 'cream', false);
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    } catch (e) { /* ignore */ }
})();
