// main interactions: sticky navbar, scroll reveal, counters, sliders
document.addEventListener('DOMContentLoaded', () => {
    // sticky navbar blur
    const navbar = document.getElementById('navbar');
    const hero = document.querySelector('.hero');

    function onScroll() {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // smooth internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // scroll reveal
    const revealItems = document.querySelectorAll('.glass-card, .destination-card, .cat-card, .timeline-item, .event-card, .testi');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = 1;
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .15 });
    revealItems.forEach(i => {
        i.style.transform = 'translateY(20px)';
        i.style.opacity = 0;
        revealObserver.observe(i);
    });

    // counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                let start = 0;
                const dur = 1500;
                const startTime = performance.now();

                function step(now) {
                    const p = Math.min((now - startTime) / dur, 1);
                    el.textContent = Math.floor(p * target);
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: .5 });
    counters.forEach(c => counterObserver.observe(c));

    // events slider
    const eventsSlider = document.getElementById('eventsSlider');
    const prevBtn = document.getElementById('eventsPrev');
    const nextBtn = document.getElementById('eventsNext');
    if (eventsSlider && prevBtn && nextBtn) {
        let idx = 0;

        function show(i) { eventsSlider.style.transform = `translateX(${-i*(eventsSlider.children[0].offsetWidth+12)}px)` }
        nextBtn.addEventListener('click', () => {
            idx = Math.min(idx + 1, eventsSlider.children.length - 1);
            show(idx);
        });
        prevBtn.addEventListener('click', () => {
            idx = Math.max(idx - 1, 0);
            show(idx);
        });
        window.addEventListener('resize', () => show(idx));
    }

    // hero media rotation
    const heroSlides = Array.from(document.querySelectorAll('.hero-bg'));
    let heroSlideIndex = 0;
    if (heroSlides.length) {
        setInterval(() => {
            heroSlides[heroSlideIndex].classList.remove('active');
            heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
            heroSlides[heroSlideIndex].classList.add('active');
        }, 3000);
    }

    // toggle Explore selected state
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (event) => {
            exploreBtn.classList.toggle('active');
            if (!exploreBtn.classList.contains('active')) {
                exploreBtn.textContent = 'Explore';
            }
            event.preventDefault();
            const target = document.querySelector(exploreBtn.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // simple testimonial auto-loop
    const testi = document.getElementById('testiSlider');
    if (testi) {
        let tIdx = 0;
        setInterval(() => {
            tIdx = (tIdx + 1) % testi.children.length;
            testi.style.transform = `translateX(${-tIdx*(testi.children[0].offsetWidth+16)}px)`
        }, 4000);
    }

    // timeline progress hover auto-scroll small
    const timeline = document.getElementById('timelineTrack');
    if (timeline) {
        timeline.addEventListener('wheel', (e) => {
            e.preventDefault();
            timeline.scrollLeft += e.deltaY;
        });
    }

});