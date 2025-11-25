// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Setup
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-card, .blog-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovered');
    });
});

// Loading Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
    })
        .to('.loader', {
            y: '-100%',
            duration: 1,
            ease: 'power4.inOut',
            delay: 0.2,
            onComplete: () => {
                document.body.classList.add('loaded');
            }
        })
        .to('main', {
            opacity: 1,
            duration: 0.5
        }, '-=0.5')
        .to('.hero-title .word', {
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.5')
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.8');
});

// Hero Canvas Animation (Organic Gradient Smoke)
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let orbs = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Orb {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        // Much larger radius for diffuse, cloud-like effect
        const baseSize = Math.min(width, height);
        this.radius = baseSize * (0.4 + Math.random() * 0.3);
        this.baseRadius = this.radius;

        // More vibrant, stylish colors with higher opacity for impact
        const colors = [
            'rgba(16, 185, 129, 0.4)',  // Vibrant Emerald
            'rgba(5, 150, 105, 0.35)',  // Deep Green
            'rgba(245, 158, 11, 0.35)', // Rich Amber
            'rgba(251, 191, 36, 0.4)',  // Bright Yellow
            'rgba(59, 130, 246, 0.2)'   // Subtle Blue accent for depth
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Organic movement parameters
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 0.3 + 0.1; // Slightly faster for more life
        this.angleSpeed = (Math.random() - 0.5) * 0.005;

        // Breathing/Fluctuation parameters
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.01;
    }

    update() {
        // Slow drift
        this.x += Math.cos(this.angle) * this.velocity;
        this.y += Math.sin(this.angle) * this.velocity;
        this.angle += this.angleSpeed;

        // Repel from center (Text area protection)
        const centerX = width / 2;
        const centerY = height / 2;
        // Define a safe zone radius based on screen size (roughly covering the text area)
        const safeRadius = Math.min(width, height) * 0.35;

        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If orb is within the safe zone, push it away gently
        if (distance < safeRadius) {
            const angleToOrb = Math.atan2(dy, dx);
            // The closer to center, the stronger the push
            const pushForce = (safeRadius - distance) * 0.02;

            this.x += Math.cos(angleToOrb) * pushForce;
            this.y += Math.sin(angleToOrb) * pushForce;
        }

        // Pulse/Breathe (Fluctuate size)
        this.pulseAngle += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * (this.baseRadius * 0.15);

        // Wrap around screen smoothly but respect the center repulsion
        // We only wrap if they go too far off screen, to keep them in the "surrounding" area
        const buffer = this.radius;
        if (this.x < -buffer) this.x = width + buffer;
        if (this.x > width + buffer) this.x = -buffer;
        if (this.y < -buffer) this.y = height + buffer;
        if (this.y > height + buffer) this.y = -buffer;
    }

    draw() {
        // Create gradient from center
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initOrbs() {
    orbs = [];
    // Fewer orbs but larger to prevent muddying
    const orbCount = 8;
    for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb());
    }
}

function animateCanvas() {
    // Clear with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Soft blending
    ctx.globalCompositeOperation = 'source-over';

    orbs.forEach(orb => {
        orb.update();
        orb.draw();
    });

    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', () => {
    resize();
    initOrbs();
});

resize();
initOrbs();
animateCanvas();

// Scroll Animations
const splitTypes = document.querySelectorAll('.split-text');

splitTypes.forEach((char, i) => {
    // Simple fade up for text blocks
    gsap.from(char, {
        scrollTrigger: {
            trigger: char,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Section Titles & Headers Animation
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach(header => {
    gsap.from(header.children, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
});

// Service Cards Animation
gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i % 3 * 0.1, // Stagger effect based on column
        ease: 'power3.out'
    });
});

// Work Cards Animation
gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Blog Infinite Auto-Scroll
const blogTrack = document.querySelector('.blog-track');
const blogCards = document.querySelectorAll('.blog-card');

// Clone cards for seamless loop
blogCards.forEach(card => {
    const clone = card.cloneNode(true);
    blogTrack.appendChild(clone);
});

// Auto-scroll animation (Flowing to the right: -50% -> 0%)
// If you want it to flow left, change to: 0% -> -50%
gsap.fromTo(blogTrack, {
    xPercent: -50
}, {
    xPercent: 0,
    duration: 20, // Adjust speed here
    ease: "none",
    repeat: -1
});

// Pause on hover
blogTrack.addEventListener('mouseenter', () => {
    gsap.to(blogTrack, { timeScale: 0, duration: 0.5 });
});
blogTrack.addEventListener('mouseleave', () => {
    gsap.to(blogTrack, { timeScale: 1, duration: 0.5 });
});

// Recruit Content Animation
gsap.from('.recruit-content > *', {
    scrollTrigger: {
        trigger: '.recruit',
        start: 'top 70%',
    },
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
});

// About Content Animation
gsap.from('.about-content > *', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
});

// Service Cards Hover Effect (Mouse tracking gradient)
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// Parallax for About Image
gsap.to('.visual-box', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    },
    y: -50,
    rotation: 5
});

// Network Animation (Digital Constellation)
const netCanvas = document.getElementById('network-canvas');
const netCtx = netCanvas.getContext('2d');

let netWidth, netHeight;
let netParticles = [];
let netParticleCount = 80; // Default
let netConnectionDist = 150; // Default

function initNetwork() {
    netWidth = netCanvas.width = window.innerWidth;
    netHeight = netCanvas.height = window.innerHeight;
    netParticles = [];

    // Adjust for mobile
    if (window.innerWidth < 768) {
        netParticleCount = 30; // Fewer particles on mobile
        netConnectionDist = 100; // Shorter connection distance
    } else {
        netParticleCount = 80;
        netConnectionDist = 150;
    }

    for (let i = 0; i < netParticleCount; i++) {
        netParticles.push(new NetParticle());
    }
}

class NetParticle {
    constructor() {
        this.x = Math.random() * netWidth;
        this.y = Math.random() * netHeight;
        this.vx = (Math.random() - 0.5) * 0.5; // Very slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.5; // Small dots
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > netWidth) this.vx *= -1;
        if (this.y < 0 || this.y > netHeight) this.vy *= -1;
    }

    draw() {
        netCtx.beginPath();
        netCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        netCtx.fillStyle = 'rgba(16, 185, 129, 0.6)'; // Emerald Green
        netCtx.fill();
    }
}

function animateNetwork() {
    netCtx.clearRect(0, 0, netWidth, netHeight);

    for (let i = 0; i < netParticles.length; i++) {
        netParticles[i].update();
        netParticles[i].draw();

        // Connect particles
        for (let j = i; j < netParticles.length; j++) {
            let dx = netParticles[i].x - netParticles[j].x;
            let dy = netParticles[i].y - netParticles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < netConnectionDist) {
                netCtx.beginPath();
                // Fade out line as distance increases
                let opacity = 1 - (distance / netConnectionDist);
                // Very subtle line (max opacity 0.2)
                netCtx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.2})`;
                netCtx.lineWidth = 0.5;
                netCtx.moveTo(netParticles[i].x, netParticles[i].y);
                netCtx.lineTo(netParticles[j].x, netParticles[j].y);
                netCtx.stroke();
            }
        }
    }

    requestAnimationFrame(animateNetwork);
}

window.addEventListener('resize', initNetwork);
initNetwork();
animateNetwork();

// Work Tabs Logic
document.addEventListener('DOMContentLoaded', () => {
    const workTabs = document.querySelectorAll('.work-tab');
    const workCards = document.querySelectorAll('.work-card');

    if (workTabs.length > 0) {
        // Initial setup: Ensure correct visibility based on active tab (default AI)
        // HTML already has 'hidden' class on creative cards, but let's be safe

        workTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Active tab styling
                workTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                workCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        // Simple fade in
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        // Use requestAnimationFrame for smoother transition start
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                card.style.transition = 'all 0.4s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        });
                    } else {
                        card.classList.add('hidden');
                    }
                });

                // Refresh ScrollTrigger to recalculate positions
                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(() => ScrollTrigger.refresh(), 100);
                }
            });
        });
    }
});
