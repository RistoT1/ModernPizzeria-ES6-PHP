// js/scrollManager.js
export class ScrollManager {
    constructor(sections, menuButton) {
        this.sections = [...sections];
        this.menuButton = menuButton;
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.scrollTimeout = null;
        this.wheelEventCount = 0;
        this.wheelTimeout = null;
        this.lastWheelDirection = 0;

        // Insert menuButton as a virtual section after the menu
        this.sections.forEach((section, index) => {
            if (section.id === 'menu' && this.menuButton) {
                this.sections.splice(index + 1, 0, this.menuButton);
            }
        });

        this.init();
    }

    init() {
        window.addEventListener('wheel', e => this.handleWheel(e), { passive: false });
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: true });
        window.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: true });
        window.addEventListener('keydown', e => this.handleKeydown(e));

        this.currentSection = this.findClosestSection();
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) return;
        this.isScrolling = true;
        this.currentSection = index;
        const target = this.sections[index];

        if (target === this.menuButton) {
            const rect = target.getBoundingClientRect();
            // Adjusted offset to make it easier to scroll out
            const absoluteTop = window.pageYOffset + rect.top - window.innerHeight * 0.8;
            window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => (this.isScrolling = false), 1000);
    }

    findClosestSection() {
        let closest = 0;
        let minDistance = Infinity;

        this.sections.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            let distance;

            // Treat menu button specially, avoid sticky snapping
            if (el === this.menuButton) {
                distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
                // If already current section, make distance bigger to allow scrolling out
                if (idx === this.currentSection) distance += 200;
            } else {
                distance = Math.abs(rect.top);
            }

            if (distance < minDistance) {
                minDistance = distance;
                closest = idx;
            }
        });

        return closest;
    }

    isInSnapZone() {
        const vh = window.innerHeight;
        const topZone = vh * 0.3;
        const bottomZone = vh * 0.7;
        let snap = null;
        let minDistance = Infinity;

        this.sections.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            if ((rect.top >= 0 && rect.top <= topZone) || (rect.top >= bottomZone && rect.top <= vh)) {
                const distance = Math.min(Math.abs(rect.top), Math.abs(vh - rect.top));
                if (distance < minDistance) {
                    minDistance = distance;
                    snap = idx;
                }
            }
        });

        return snap;
    }

    handleWheel(e) {
        if (this.isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        if (this.lastWheelDirection !== direction) this.wheelEventCount = 0;
        this.lastWheelDirection = direction;
        this.wheelEventCount++;

        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
            this.wheelEventCount = 0;
            this.lastWheelDirection = 0;
        }, 300);

        if (this.wheelEventCount >= 3) {
            this.currentSection = this.findClosestSection();
            if (direction > 0 && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
            } else if (direction < 0 && this.currentSection > 0) {
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
            }
            this.wheelEventCount = 0;
        }
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        if (this.isScrolling) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diff = this.touchStartY - touchEndY;
        if (Math.abs(diff) > 100) {
            this.currentSection = this.findClosestSection();
            this.scrollToSection(this.currentSection + (diff > 0 ? 1 : -1));
        }
    }

    handleKeydown(e) {
        if (this.isScrolling) return;
        this.currentSection = this.findClosestSection();

        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && this.currentSection < this.sections.length - 1) {
            e.preventDefault();
            this.scrollToSection(this.currentSection + 1);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && this.currentSection > 0) {
            e.preventDefault();
            this.scrollToSection(this.currentSection - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.scrollToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            this.scrollToSection(this.sections.length - 1);
        }
    }

    handleScroll() {
        if (this.isScrolling) return;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            const snapTarget = this.isInSnapZone();
            if (snapTarget !== null) this.scrollToSection(snapTarget);
        }, 200);
    }
}
