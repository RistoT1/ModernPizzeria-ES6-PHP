import { logoutUser, fetchCartQuantity } from '../helpers/api.js';
import { getPath } from '../helpers/config.js';
import { validateNavDom } from '../helpers/domValid.js';
import { updateCartCounter } from '../helpers/utils.js';

class NavInclude {
    constructor() {
        this.DOM = null;
        this.cartQuantity = 0;
        this.init();
    }
    async init() {
        this.DOM = validateNavDom();
        if (!this.DOM) {
            console.error('Required DOM elements not found');
            return;
        }
        this.setupEventListeners();
        this.applyHashActive();
        this.cartQuantity = await fetchCartQuantity();
        updateCartCounter(this.cartQuantity);
    }

    applyHashActive() {
        try {
            const links = Array.from(document.querySelectorAll('.nav-links a'));
            const currentPath = window.location.pathname.replace(/\/+$/, '');
            const currentHash = window.location.hash || '';
            // Score each link and choose the best match. Score: path+hash=3, path=2, hash=1
            let best = { score: 0, element: null };
            links.forEach(a => {
                a.classList.remove('active');
                a.removeAttribute('aria-current');
                try {
                    // Resolve relative hrefs against current location so '#about' becomes current path + hash
                    const url = new URL(a.getAttribute('href'), window.location.href);
                    const linkPath = url.pathname.replace(/\/+$/, '');
                    const linkHash = url.hash || '';

                    let score = 0;
                    if (linkPath && currentPath && linkPath === currentPath) score += 2;
                    if (linkHash && linkHash === currentHash) score += 1;

                    // small heuristic: if both are zero but href equals current full URL, count as exact
                    if (score === 0) {
                        const fullHref = url.href.replace(/\/+$/, '');
                        const currFull = (window.location.href || '').replace(/\/+$/, '');
                        if (fullHref === currFull) score = 3;
                    }

                    if (score > best.score) {
                        best = { score, element: a };
                    }
                } catch (e) {
                    // ignore invalid URLs
                }
            });

            if (best.element) {
                best.element.classList.add('active');
                best.element.setAttribute('aria-current', 'page');
            }
        } catch (err) {
            console.error('applyHashActive error', err);
        }
    }
    setupEventListeners() {
        const logoutBtn = this.DOM.logoutBtn;
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (!confirm('Are you sure you want to logout?')) return;

                const success = await logoutUser();
                if (success) {
                    window.location.href = `${getPath(false)}/index.php`;
                } else {
                    alert('Logout failed. Please try again.');
                }
            });
        }

        const Navbar = this.DOM.nav;
        if (!Navbar) { return; }
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                Navbar.classList.add('scrolled');
            } else {
                Navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const mobileToggle = this.DOM.mobileToggle;
        const navLinks = this.DOM.navLinks;
        console.log(mobileToggle, navLinks);
        if (mobileToggle && navLinks) {
            const closeMobileMenu = () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            };

            mobileToggle.addEventListener('click', (e) => {
                console.log('toggle menu');
                const isOpen = mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('active', isOpen);
                mobileToggle.setAttribute('aria-expanded', String(isOpen));
                document.body.classList.toggle('nav-open', isOpen);
                // move focus to first nav link when opened
                if (isOpen) {
                    const firstLink = navLinks.querySelector('a, button');
                    firstLink?.focus();
                } else {
                    mobileToggle.focus();
                }
            });

            // Close menu when a nav link is clicked (mobile)
            navLinks.addEventListener('click', (ev) => {
                const target = ev.target.closest('a');
                if (!target) return;
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });

            const orderBtn = this.DOM.orderBtn;
            if (orderBtn) {
                orderBtn.addEventListener('click', () => {
                    window.location.href = './pages/menu.php';
                });
            }

            // Close when clicking outside the navLinks while open
            const outsideClickHandler = (ev) => {
                if (!navLinks.classList.contains('active')) return;
                const isInside = ev.target.closest && (ev.target.closest('.nav-links') || ev.target.closest('.mobile-menu-toggle'));
                if (!isInside) closeMobileMenu();
            };
            document.addEventListener('click', outsideClickHandler);

            // Close on Escape
            document.addEventListener('keydown', (ev) => {
                if (ev.key === 'Escape') {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileToggle.classList.remove('active');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        document.body.classList.remove('nav-open');
                        mobileToggle.focus();
                    }
                }
            });
        }

        // Update active link when hash changes (for index section links)
        window.addEventListener('hashchange', () => this.applyHashActive());
    }
}

const waitForDOM = () => {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
};

waitForDOM().then(() => {
    new NavInclude();
});
