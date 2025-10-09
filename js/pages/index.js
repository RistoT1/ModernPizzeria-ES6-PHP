import { validateIndexDom } from '../helpers/domValid.js';
import { initFadeInAnimations, initStatsAnimation } from '../helpers/animations.js';
import { ScrollManager } from '../helpers/ScrollManager.js';

export default class IndexPage {
    constructor() {
        this.DOM = validateIndexDom();
        if (!this.DOM) return console.error('IndexPage DOM validation failed');

        this.init();
    }

    init() {
        const { menuSection, statsSection, menuButton } = this.DOM;

        // Smooth scroll buttons
        document.addEventListener('click', e => {
            const btn = e.target.closest('[data-scroll]');
            if (btn) {
                e.preventDefault();
                const target = document.getElementById(btn.dataset.scroll);
                target?.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Initialize animations
        initFadeInAnimations();
        initStatsAnimation(statsSection);

        // Menu hover effect
        const items = menuSection.querySelectorAll('.menu-item');
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                items.forEach(other => other.style.opacity = other === item ? '1' : '0.4');
            });
            item.addEventListener('mouseleave', () => {
                items.forEach(other => other.style.opacity = '1');
            });
        });

        // --- ScrollManager with menu button as virtual section ---
        const mainSections = Array.from(document.querySelectorAll('main > section'));
        const sections = [];

        mainSections.forEach(section => {
            sections.push(section);
            // Insert menu button after the menu section
            if (section.id === 'menu' && menuButton) {
                sections.push(menuButton);
            }
        });

        this.scrollManager = new ScrollManager(sections, menuButton);
    }
}

// Wait for DOM before initializing
const waitForDOM = () =>
    document.readyState === 'loading'
        ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
        : Promise.resolve();

waitForDOM().then(() => new IndexPage());
