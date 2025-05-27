// File: scripts/utils/accessibility.js

// Accessibility utilities
export function initAccessibility() {
    // Add aria-labels to buttons without text
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });

    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        img.setAttribute('alt', '');
    });

    // Add focus styles for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility when DOM is loaded
document.addEventListener('DOMContentLoaded', initAccessibility);