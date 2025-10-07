// js/animations.js

export function initFadeInAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

export function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.floor(target * ease).toLocaleString('fi-FI');

        if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
}

export function initStatsAnimation(statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat__number').forEach(stat => {
                    animateCounter(stat, parseInt(stat.dataset.target, 10));
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    if (statsSection) observer.observe(statsSection);
}
