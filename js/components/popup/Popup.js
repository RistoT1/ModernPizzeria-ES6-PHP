import { validatePopupDom } from '../../helpers/domValid.js';

export class Popup {
    constructor() {
        this.DOM = {};
        this.popup = null;
        this.closeBtn = null;
        this.popupBody = null;
        this.popupHeader = null;
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
    }

    /** ---------- DOM Caching ---------- */
    cacheDOM() {
        const DOM = validatePopupDom();
        if (!DOM) throw new Error('Popup DOM not found');
        
        this.DOM = DOM;
        
        // Cache only the common elements all popups need
        this.popup = DOM.popup;
        this.closeBtn = DOM.closeBtn;
        this.popupBody = DOM.popupBody;
        this.popupHeader = DOM.popupHeader;
        this.popupTitle = DOM.popupTitle;
        this.popupInfoMain = DOM.popupInfoMain;
    }

    /** ---------- Event Binding ---------- */
    bindEvents() {
        if (!this.popup) return;

        this.popup.addEventListener('click', e => {
            if (e.target === this.popup) this.close();
        });

        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());
    }

    /** ---------- Popup Controls ---------- */
    open(data) {
        if (!data) return;
        this.popup.classList.add('active');
    }

    close() {
        this.popup.classList.remove('active');
        // Child classes can override to add cleanup logic
    }

    /** ---------- Helper Methods ---------- */
    setHeaderImage(imagePath) {
        if (this.popupHeader) {
            this.popupHeader.style.backgroundImage = `url(${imagePath})`;
        }
    }

    setTitle(title) {
        if (this.popupTitle) {
            this.popupTitle.textContent = title;
        }
    }
}