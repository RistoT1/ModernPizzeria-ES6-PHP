export const getPath = (isApi = false) => {
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

    // Construct base path
    const basePath = segments.join('/').replace(/\/+$/, '');

    // Return base path, optionally with API
    return isApi ? `${basePath}/api/main.php` : basePath;
};
