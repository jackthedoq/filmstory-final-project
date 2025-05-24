// File: scripts/utils/view-transition.js

// Helper functions for View Transition API
export function supportsViewTransitions() {
    return 'startViewTransition' in document;
}

export function navigateWithTransition(url) {
    if (supportsViewTransitions()) {
        document.startViewTransition(() => {
            window.location.href = url;
        });
    } else {
        window.location.href = url;
    }
}