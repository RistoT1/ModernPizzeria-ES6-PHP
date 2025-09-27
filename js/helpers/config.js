export const getApiPath = () => {
    const path = window.location.pathname;
    const segments = path.split('/');

    // Remove last segment if it's a .php file
    if (segments[segments.length - 1].endsWith('.php')) {
        segments.pop();
    }

    // Remove 'pages' folder if present
    const pagesIndex = segments.indexOf('pages');
    if (pagesIndex !== -1) {
        segments.splice(pagesIndex, 1);
    }

    const basePath = segments.join('/').replace(/\/+$/, '');
    return `${basePath}/api/main.php`;
};
