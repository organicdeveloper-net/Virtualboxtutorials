jQuery(function(jQuery) {
    
    var file_frame,
    awl_grid_gallery = {
        ul: '',
        init: function() {
            this.ul = jQuery('.sbox');
            this.ul.sortable({
                items: '.gg-image-slide',
                handle: '.gg-move-handle',
                placeholder: 'gg-sortable-placeholder',
                forcePlaceholderSize: true,
                tolerance: 'pointer',
                opacity: 0.8,
                revert: false,
                scroll: true,
                scrollSensitivity: 100,
                scrollSpeed: 40,
                start: function(event, ui) {
                    ui.placeholder.height(ui.item.outerHeight());
                    ui.placeholder.width(ui.item.outerWidth());
                }
            });			
			
            /**
			 * Add Slide Callback Function
			 */
            jQuery('#add-new-slider').on('click', function(event) {
				var ggp_add_images_nonce = jQuery("#ggp_add_images_nonce").val();
                event.preventDefault();
                if (file_frame) {
                    file_frame.open();
                    return;
                }
                file_frame = wp.media.frames.file_frame = wp.media({
                    multiple: true
                });

                file_frame.on('select', function() {
                    var images = file_frame.state().get('selection').toJSON(),
                            length = images.length;
                    for (var i = 0; i < length; i++) {
                        awl_grid_gallery.get_thumbnail(images[i]['id'], '', ggp_add_images_nonce);
                    }
                });
                file_frame.open();
            });
			
			/**
			 * Delete Slide Callback Function
			 */
            this.ul.on('click', '.remove-slide', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this image?')) {
                    jQuery(this).closest('.gg-image-slide').fadeOut(300, function() {
                        jQuery(this).remove();
                    });
                }
                return false;
            });
			
			/**
			 * Delete All Slides Callback Function
			 */
			jQuery('#remove-all-slides').on('click', function() {
                if (confirm('Are you sure you want to delete all images?')) {
                    awl_grid_gallery.ul.empty();
                }
                return false;
            });

            /**
             * Copy Shortcode to Clipboard
             */
            jQuery(document).on('click', '.ggm-copy', function() {
                var targetId = jQuery(this).data('target');
                var $input = jQuery(targetId);
                if ($input.length) {
                    $input.select();
                    document.execCommand("copy");
                    jQuery("#ggm-copy-code").fadeIn().delay(2000).fadeOut();
                }
            });
           
        },
        get_thumbnail: function(id, cb, ggp_add_images_nonce) {
            cb = cb || function() {};
            var data = {
                action: 'grid_gallery_js',
                slideId: id,
				ggp_add_images_nonce: ggp_add_images_nonce,
            };
            jQuery.post(ajaxurl, data, function(response) {
                awl_grid_gallery.ul.append(response);
                cb();
            });
        }
    };
    awl_grid_gallery.init();

    window.SortSlides = function(order) {
        if (order == "ASC") {
            jQuery(".ggp-listitems .gg-image-slide").sort(sort_li).appendTo('.ggp-listitems');
            function sort_li(a, b) {
                return (jQuery(b).data('position')) > (jQuery(a).data('position')) ? 1 : -1;
            }
        }
        if (order == "DESC") {
            jQuery(".ggp-listitems .gg-image-slide").sort(sort_li).appendTo('.ggp-listitems');
            function sort_li(a, b) {
                return (jQuery(b).data('position')) < (jQuery(a).data('position')) ? 1 : -1;
            }
        }
        return false;
    };
});