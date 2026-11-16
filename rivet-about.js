// The page remains readable and the native menu works without JavaScript.
(() => {
    const menu = document.querySelector('.mobile-menu');
    const summary = menu?.querySelector('summary');
    if (menu) {
        menu.addEventListener('click', event => {
            if (event.target.closest('a')) menu.open = false;
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menu.open) {
                menu.open = false;
                summary.focus();
            }
        });
        document.addEventListener('click', event => {
            if (menu.open && !menu.contains(event.target)) menu.open = false;
        });
        const desktop = window.matchMedia('(min-width: 721px)');
        desktop.addEventListener('change', event => {
            if (event.matches) menu.open = false;
        });
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            if (reducedMotion.matches) return;
            entry.target.animate([
                { transform: 'translateY(16px)', opacity: 0.65 },
                { transform: 'translateY(0)', opacity: 1 }
            ], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' });
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
})();
