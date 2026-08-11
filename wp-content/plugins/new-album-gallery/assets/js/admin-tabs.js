(function($) {
    'use strict';

    /**
     * Tab Switching Logic
     */
    function switchTab(tabIndex, clickedEl) {
        console.log('Tab switched to: ' + tabIndex);

        // Toggle Nav active state
        $('.awl-ag-tab-nav-item').removeClass('active');
        $(clickedEl).addClass('active');

        // Toggle Content active state - use both class AND inline display
        $('.awl-ag-tab-content').removeClass('active').css('display', 'none');
        $('#tab-' + tabIndex).addClass('active').css('display', 'block');
    }

    $(document).ready(function() {
        // Tab switching via event listener
        $(document).on('click', '.awl-ag-tab-nav-item', function() {
            var tabIndex = $(this).data('tab');
            switchTab(tabIndex, this);
        });

        console.log('Album Gallery Premium Admin JS Loaded');

        // Ensure only the first tab content is visible on load
        $('.awl-ag-tab-content').css('display', 'none');
        $('.awl-ag-tab-content.active').css('display', 'block');

        // Range Slider Value Label and Fill Updates
        function updateRangeSlider($input) {
            var val = $input.val();
            var min = $input.attr('min') || 0;
            var max = $input.attr('max') || 100;
            var percent = (val - min) / (max - min) * 100;
            
            // Update value label
            $input.next('.range-slider__value').text(val);
            
            // Update fill gradient with premium Indigo-to-Violet transition
            $input.css('background', 'linear-gradient(to right, var(--ag-primary) 0%, var(--ag-secondary) ' + percent + '%, #f1f5f9 ' + percent + '%, #f1f5f9 100%)');
        }

        $(document).on('input', '.range-slider__range', function() {
            updateRangeSlider($(this));
        });

        // Initialize all range sliders on load
        $('.range-slider__range').each(function() {
            updateRangeSlider($(this));
        });

        // Conditional Visibility: Global Settings
        function toggleColumnIndividualSettings() {
            var isUniform = $('input[name="column_settings"]').is(':checked');
            if (!isUniform) {
                $('.column_individual_settings').show();
            } else {
                $('.column_individual_settings').hide();
            }
        }
        
        $(document).on('change', 'input[name="column_settings"]', toggleColumnIndividualSettings);
        toggleColumnIndividualSettings();

        // Modern Switch Status Text Updates
        function updateSwitchStatus($input) {
            var $status = $input.closest('.ag-switch-wrapper').find('.ag-toggle-status');
            var name = $input.attr('name');
            var isChecked = $input.is(':checked');

            if ($status.length && typeof agp_i18n !== 'undefined') {
                if (name === 'loop_lightbox') {
                    $status.text(isChecked ? agp_i18n.enabled : agp_i18n.disabled);
                } else if (name === 'column_settings') {
                    $status.text(isChecked ? agp_i18n.uniform : agp_i18n.individual);
                } else if (name === 'ags_auto_play') {
                    $status.text(isChecked ? agp_i18n.active : agp_i18n.off);
                } else if (name === 'album_title') {
                    $status.text(isChecked ? agp_i18n.title_on : agp_i18n.title_off);
                } else if (name.startsWith('ags_') || name === 'image_title') {
                    $status.text(isChecked ? agp_i18n.on_txt : agp_i18n.off_txt);
                }
            }
        }

        $(document).on('change', '.ag-toggle-switch input', function() {
            updateSwitchStatus($(this));
        });

        // Conditional Visibility: Autoplay Delay
        function toggleAutoplaySettings() {
            var $autoplay = $('input[name="ags_auto_play"]');
            if ($autoplay.is(':checked')) {
                $('.autoplay_delay_settings').show();
            } else {
                $('.autoplay_delay_settings').hide();
            }
        }

        $(document).on('change', 'input[name="ags_auto_play"]', toggleAutoplaySettings);
        toggleAutoplaySettings();

        // Initialize all switches status text on load
        $('.ag-toggle-switch input').each(function() {
            updateSwitchStatus($(this));
        });


        // WP Color Picker Initialization
        if ($.isFunction($.fn.wpColorPicker)) {
            $('.awl-ag-color-picker').wpColorPicker();
        }

        $(document).ajaxComplete(function() {
            if ($.isFunction($.fn.wpColorPicker)) {
                $('.awl-ag-color-picker').wpColorPicker();
            }
        });
        // Return to Top logic
        $(window).scroll(function() {
            if ($(this).scrollTop() >= 300) {
                $('#return-to-top').fadeIn(200);
            } else {
                $('#return-to-top').fadeOut(200);
            }
        });
        $('#return-to-top').on('click', function(e) {
            e.preventDefault();
            $('body,html').animate({
                scrollTop : 0
            }, 500);
        });
    });

    // Settings Page Loader Transition
    function revealSettingsPage() {
        $('.ag-settings-loader').fadeOut(250, function() {
            $(this).remove();
            $('.ag-settings-main-content').fadeIn(250);
        });
    }

    if (document.readyState === 'complete') {
        revealSettingsPage();
    } else {
        $(window).on('load', revealSettingsPage);
    }

})(jQuery);
