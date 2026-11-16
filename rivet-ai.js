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

// A quiet network behind the page, with no dependency on external libraries.
(() => {
    const canvas = document.getElementById('ai-network');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let width = 0;
    let height = 0;
    let points = [];
    function resize() {
        width = innerWidth;
        height = innerHeight;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        points = Array.from({ length: width < 720 ? 18 : 36 }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .13, vy: (Math.random() - .5) * .13 }));
        draw(false);
    }
    function draw(move) {
        context.clearRect(0, 0, width, height);
        for (const p of points) {
            if (move) { p.x = (p.x + p.vx + width) % width; p.y = (p.y + p.vy + height) % height; }
            context.fillStyle = 'rgba(5,150,105,.45)';
            context.beginPath(); context.arc(p.x, p.y, 1.2, 0, Math.PI * 2); context.fill();
        }
        for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
            const a = points[i], b = points[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 150) { context.strokeStyle = `rgba(5,150,105,${.1 * (1 - distance / 150)})`; context.lineWidth = .6; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); }
        }
    }
    function tick() { draw(true); frame = requestAnimationFrame(tick); }
    function sync() {
        cancelAnimationFrame(frame);
        document.body.classList.toggle('page-paused', document.hidden);
        if (!document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
        else if (!document.hidden) draw(false);
    }
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    resize(); sync();
})();
