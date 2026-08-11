/**
 * Album Gallery Premium - Frontend Skeleton Loader
 * Part of Phase 1: Skeleton Loading
 */

document.addEventListener('DOMContentLoaded', function() {
    ag_init_skeletons();
    
    // Support for Isotope and other dynamic layouts
    window.addEventListener('load', ag_init_skeletons);
});

function ag_init_skeletons() {
    const skeletons = document.querySelectorAll('.nag-skeleton.nag-loading');
    
    skeletons.forEach(skeleton => {
        const img = skeleton.querySelector('img');
        if (!img) return;

        // Check if image is already cached/loaded
        if (img.complete) {
            ag_mark_as_loaded(skeleton);
        } else {
            img.addEventListener('load', function() {
                ag_mark_as_loaded(skeleton);
            });
            
            // Backup - hide skeleton if loading fails
            img.addEventListener('error', function() {
                ag_mark_as_loaded(skeleton);
            });
        }
    });
}

function ag_mark_as_loaded(skeleton) {
    skeleton.classList.remove('nag-loading');
    skeleton.classList.add('nag-loaded');
}
