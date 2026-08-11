jQuery(function(jQuery) {
    
    var file_frame,
    awl_album_gallery = {
        ul: '',
        init: function() {
            this.ul = jQuery('.ag-image-slides-list');
            
            // Initialize Sortable
            if (this.ul.length > 0) {
                this.ul.sortable({
                    items: '.ag-image-slide-card',
                    placeholder: 'ag-slide-placeholder',
                    handle: '.ag-drag-handle',
                    revert: 250,
                    tolerance: 'pointer',
                    opacity: 0.8,
                    forcePlaceholderSize: true,
                    cursor: 'grabbing',
                    start: function(e, ui) {
                        ui.placeholder.css({
                            'height': ui.item.outerHeight(),
                            'width': ui.item.outerWidth(),
                            'border-radius': '12px'
                        });
                    }
                });
            }
			
            /**
             * Initialize Media Frame
             */
            this.init_media_frame = function() {
                if (file_frame) return;
                
                if (typeof wp !== 'undefined' && wp.media) {
                    file_frame = wp.media({
                        title: 'Select or Upload Images',
                        button: { text: 'Add to Gallery' },
                        multiple: true
                    });

                    file_frame.on('select', function() {
                        var images = file_frame.state().get('selection').toJSON(),
                            length = images.length;
                        
                        if (length === 0) return;
                        
                        var imageIds = [];
                        for (var i = 0; i < length; i++) {
                            imageIds.push(images[i]['id']);
                        }
                        
                        awl_album_gallery.get_thumbnails_batch(imageIds);
                    });
                }
            };

            // Pre-init to warm up the media library
            this.init_media_frame();

            /**
             * Open Uploader Logic
             */
            const openUploader = function(e) {
                if (e) e.preventDefault();
                
                if (!file_frame) {
                    awl_album_gallery.init_media_frame();
                }
                
                if (file_frame) {
                    file_frame.open();
                }
            };

            // Direct event binding for better performance
            jQuery(document).on('click', '.ag-upload-card, #add-new-image-slides', openUploader);

			
			/**
			 * Delete Slide Callback Function
			 */
            this.ul.on('click', '.remove-single-image-slide', function() {
                var $slide = jQuery(this).closest('.ag-image-slide-card');
                if (confirm('Are you sure you want to delete this image?')) {
                    $slide.css('transform', 'scale(0.8)');
                    $slide.fadeOut(400, function() {
                        jQuery(this).remove();
                    });
                }
                return false;
            });
			
			/**
			 * Delete All Slides Callback Function
			 */
			jQuery('#remove-all-image-slides').on('click', function() {
                if (confirm('Are you sure you want to delete ALL images? This cannot be undone.')) {
                    awl_album_gallery.ul.addClass('ag-removing-all');
                    awl_album_gallery.ul.fadeOut(500, function() {
                        jQuery(this).empty().show().removeClass('ag-removing-all');
                    });
                }
                return false;
            });

            /**
             * Video Link Toggle
             */
            this.ul.on('change', '.ag-slide-type-select', function() {
                var $select = jQuery(this);
                var $card = $select.closest('.ag-image-slide-card');
                var $videoField = $card.find('.ag-video-link-field');
                var $badgeIcon = $card.find('.ag-slide-badge .dashicons');
                var $fetchWrapper = $card.find('.ag-poster-fetch-wrapper');

                if ($select.val() === 'v') {
                    $badgeIcon.removeClass('dashicons-format-image').addClass('dashicons-video-alt3');
                    $videoField.show();
                    $videoField.find('input').attr('placeholder', 'Youtube video URL');
                    $fetchWrapper.show().css('display', 'flex');
                } else {
                    $badgeIcon.removeClass('dashicons-video-alt3').addClass('dashicons-format-image');
                    $videoField.hide();
                    $videoField.find('input').attr('placeholder', 'Video URL or Redirect Link');
                    $fetchWrapper.hide();
                }
            });

            /**
             * Fetch Poster Button Click Event (YouTube only)
             */
            this.ul.on('click', '.ag-btn-fetch-poster', function(e) {
                e.preventDefault();
                var $btn = jQuery(this);
                var $card = $btn.closest('.ag-image-slide-card');
                var linkVal = $card.find('input[name="image-slide-link[]"]').val().trim();

                if (!linkVal) {
                    alert('Please enter a video URL first.');
                    return;
                }

                // YouTube Poster Fetch
                var ytReg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
                var ytMatch = linkVal.match(ytReg);
                if (ytMatch && ytMatch[1]) {
                    var posterUrl = 'https://img.youtube.com/vi/' + ytMatch[1] + '/hqdefault.jpg';
                    $card.find('.ag-slide-poster-input').val(posterUrl);
                    $card.find('.ag-slide-thumb-img').attr('src', posterUrl);
                    $card.find('.ag-btn-revert-poster').css('display', 'flex');
                    return;
                }

                alert('Please enter a valid YouTube URL to fetch the poster.');
            });

            /**
             * Revert Poster Button Click Event
             */
            this.ul.on('click', '.ag-btn-revert-poster', function(e) {
                e.preventDefault();
                var $btn = jQuery(this);
                var $card = $btn.closest('.ag-image-slide-card');
                var origSrc = $card.find('.ag-slide-thumb-img').data('original-src');

                $card.find('.ag-slide-poster-input').val('');
                $card.find('.ag-slide-thumb-img').attr('src', origSrc);
                $btn.hide();
            });
           
        },
        showLoading: function(count) {
            if (jQuery('#ag-loading-indicator').length) return;

            var loadingHtml = '<div id="ag-loading-indicator" style="' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'gap: 12px;' +
                'padding: 16px 24px;' +
                'background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);' +
                'color: #ffffff;' +
                'border-radius: 12px;' +
                'margin: 20px 0;' +
                'box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);' +
                'font-family: -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, sans-serif;' +
                'font-weight: 600;' +
                'font-size: 14px;' +
                ' transition: all 0.3s ease;' +
                '">' +
                '<div class="ag-uploader-spinner" style="' +
                'width: 20px;' +
                'height: 20px;' +
                'border: 3px solid rgba(255, 255, 255, 0.3);' +
                'border-radius: 50%;' +
                'border-top-color: #ffffff;' +
                'animation: ag-spin 0.8s linear infinite;' +
                '"></div>' +
                '<span>Adding ' + count + ' image(s) to gallery...</span>' +
                '<style>' +
                '@keyframes ag-spin {' +
                '  to { transform: rotate(360deg); }' +
                '}' +
                '</style>' +
                '</div>';
            this.ul.before(loadingHtml);
        },
        hideLoading: function() {
            jQuery('#ag-loading-indicator').fadeOut(300, function() {
                jQuery(this).remove();
            });
        },
        get_thumbnails_batch: function(ids) {
            var self = this;
            
            self.showLoading(ids.length);
            
            var data = {
                action: 'album_gallery_js_batch',
                slideIds: ids,
                security: awl_ag_ajax_obj.nonce
            };
            
            jQuery.post(
                awl_ag_ajax_obj.ajaxurl,
                data,
                function(response) {
                    self.hideLoading();
                    if (response && response.success && response.data) {
                        var $newElements = jQuery(response.data);
                        $newElements.hide().appendTo(self.ul).fadeIn(500);
                    }
                }
            ).fail(function() {
                self.hideLoading();
                alert('Error loading images. Please try again.');
            });
        },
        get_thumbnail: function(id, cb) {
            cb = cb || function() {};
            var data = {
                action: 'album_gallery_js',
                slideId: id,
                security: awl_ag_ajax_obj.nonce
            };
            
            jQuery.post(awl_ag_ajax_obj.ajaxurl, data, function(response) {
                var $newSlide = jQuery(response);
                $newSlide.hide().appendTo(awl_album_gallery.ul).fadeIn(500);
                cb();
            }).fail(function(xhr, status, error) {
                // Silently fail or handle gracefully
            });
        }
    };
    awl_album_gallery.init();
});