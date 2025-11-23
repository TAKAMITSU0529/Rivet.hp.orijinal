// About Page Animations

// Wait for load
window.addEventListener('load', () => {
    // Hero Animation
    const tl = gsap.timeline();

    tl.from('.breadcrumb', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
    })
        .from('.page-title .block-reveal', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        }, "-=0.4")
        .from('.hero-description', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.8");

    // Philosophy Animation
    gsap.from('.philosophy-header', {
        scrollTrigger: {
            trigger: '.philosophy',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.philosophy-body p', {
        scrollTrigger: {
            trigger: '.philosophy',
            start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.2,
        ease: 'power3.out'
    });

    // MVV Animation
    gsap.utils.toArray('.mvv-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.mvv-grid',
                start: 'top 75%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Company Profile Animation
    gsap.from('.profile-item', {
        scrollTrigger: {
            trigger: '.profile-list',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // CTA Animation
    gsap.from('.cta-inner > *', {
        scrollTrigger: {
            trigger: '.about-cta',
            start: 'top 70%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    });
});
