export class ErrorMessage {
    constructor(container) {
        this.container = container;
    }

    show(message) {
        if (!this.container) return;
        this.container.textContent = message;
        this.container.style.display = 'block';
    }

    hide() {
        if (!this.container) return;
        this.container.textContent = '';
        this.container.style.display = 'none';
    }
}
