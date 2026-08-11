(function($) {
    'use strict';

    /**
     * Unified LightGallery v1.10.0 Initializer for Album Gallery
     * Handles opening the gallery in dynamic mode using JSON data.
     */
    $(document).on('click', '.nag-gallery-container', function(e) {
        var $target = $(this);
        var galleryData = $target.data('gallery-json');
        var lgConfig = $target.data('lg-config') || {};
        
        // Ensure galleryData is an array
        if (typeof galleryData === 'string') {
            try {
                galleryData = JSON.parse(galleryData);
            } catch (err) {
                console.error('[NAG] Failed to parse gallery JSON:', err);
                return;
            }
        }

        if (!galleryData || !Array.isArray(galleryData) || galleryData.length === 0) {
            console.error('[NAG] No valid gallery data found.');
            return;
        }

        // Initialize LightGallery v1
        $target.lightGallery({
            dynamic: true,
            dynamicEl: galleryData,
            loop: !!lgConfig.loop,
            thumbnail: !!lgConfig.thumbnail,
            autoplay: !!lgConfig.autoplay,
            pause: parseInt(lgConfig.pause) || 3000,
            download: false,
            fullScreen: false,
            zoom: false,
            actualSize: false,
            // v1 Specifics
            mode: 'lg-slide',
            speed: 600,
            closable: true,
            escKey: true,
            keyPress: true,
            controls: true,
            showAfterLoad: true,
            selector: false, // Important for dynamic mode
            hash: false,
            // Ensure bottom thumbnails are configured
            toogleThumb: true,
            pullCaptionUp: true,
            thumbWidth: 100,
            thumbContHeight: 100,
            thumbMargin: 5
        });
        
        e.preventDefault();
    });

})(jQuery);

