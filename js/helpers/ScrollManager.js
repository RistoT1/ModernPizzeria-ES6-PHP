export class ScrollManager {
    constructor(sections) {
        this.sections = [...sections];
        this.currentSection = 0;
        this.isScrolling = false;

        // Bind keydown immediately
        this._keydownHandler = e => this.handleKeydown(e);
        window.addEventListener('keydown', this._keydownHandler);
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) return;
        this.isScrolling = true;
        this.currentSection = index;
        const target = this.sections[index];
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => (this.isScrolling = false), 500);
    }

    findClosestSection() {
        let closest = 0;
        let minDistance = Infinity;

        this.sections.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < minDistance) {
                minDistance = distance;
                closest = idx;
            }
        });

        return closest;
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
}
