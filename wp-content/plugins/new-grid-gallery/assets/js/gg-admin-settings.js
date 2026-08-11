/**
 * Grid Gallery Admin Settings JS
 */
(function ($) {
    'use strict';

    // ===== Scroll to Top ==== 
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('#return-to-top').fadeIn(200);
        } else {
            $('#return-to-top').fadeOut(200);
        }
    });

    $(document).ready(function () {
        $('#return-to-top').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        // Initialize wpColorPicker
        if ($.fn.wpColorPicker) {
            $('#title_color, #load_button_color, #load_text_color, #load_button_hover, .ig-color-picker').wpColorPicker();
        }

        // Tab switching logic (shared between individual and global settings)
        $('.awl-gg-tabs-nav .nav-item').on('click', function (e) {
            e.preventDefault();
            var target = $(this).data('target');
            $('.awl-gg-tabs-nav .nav-item').removeClass('active');
            $(this).addClass('active');
            $('.awl-gg-tab-content').removeClass('active');
            $('#' + target).addClass('active');
        });

        // range slider display logic
        $('.ig-range').on('input', function () {
            $(this).next('.ig-range-value').find('span').text($(this).val());
        });

        var rangeSlider = function () {
            var slider = $('.range-slider'),
                range = $('.range-slider__range'),
                value = $('.range-slider__value');

            slider.each(function () {
                value.each(function () {
                    var val = $(this).prev().attr('value');
                    $(this).html(val);
                });
                range.on('input', function () {
                    $(this).next(value).html(this.value);
                });
            });
        };
        rangeSlider();

        // Button Preset Auto-Configuration
        var igPresetConfigs = {
            'solid': { px: 32, py: 12, radius: 50, bg: '#4f46e5', txt: '#ffffff', hvr: '#4338ca' },
            'outline': { px: 32, py: 12, radius: 50, bg: '#4f46e5', txt: '#4f46e5', hvr: '#4f46e5' },
            'glass': { px: 32, py: 12, radius: 12, bg: '#4f46e5', txt: '#4f46e5', hvr: '#4338ca' },
            'neon': { px: 40, py: 14, radius: 50, bg: '#000000', txt: '#00f2ff', hvr: '#00f2ff' },
            'gradient': { px: 32, py: 12, radius: 30, bg: '#4f46e5', txt: '#ffffff', hvr: '#7c3aed' }
        };

        $('input[name="load_btn_style"]').change(function () {
            var style = $(this).val();
            var config = igPresetConfigs[style];
            if (config) {
                // Dimensions
                $('input[name="load_btn_pad_x"]').val(config.px).trigger('input');
                $('input[name="load_btn_pad_y"]').val(config.py).trigger('input');
                $('input[name="load_btn_radius"]').val(config.radius).trigger('input');

                // Colors (Using wpColorPicker API if available)
                if ($.fn.wpColorPicker) {
                    $('#load_button_color').wpColorPicker('color', config.bg);
                    $('#load_text_color').wpColorPicker('color', config.txt);
                    $('#load_button_hover').wpColorPicker('color', config.hvr);
                }
            }
        });

        // hover effect type toggle
        $('input[name="image_hover_effect_type"]').change(function () {
            var effect_type = $(this).val();
            if (effect_type == "no") {
                $('.he_one, .he_two').slideUp(200);
            } else if (effect_type == "2d") {
                $('.he_one').slideDown(200);
                $('.he_two').slideUp(200);
            } else if (effect_type == "sg") {
                $('.he_one').slideUp(200);
                $('.he_two').slideDown(200);
            }
        });

        // title setting toggle
        $('input[name="title_setting"]').change(function () {
            var title = $(this).val();
            if (title == "hide") {
                $('.tfs').slideUp(200);
            } else {
                $('.tfs').slideDown(200);
            }
        });

        // image link toggle
        $('input[name="images_link"]').change(function () {
            var link = $(this).val();
            if (link == "none") {
                $('.ilu').slideUp(200);
            } else {
                $('.ilu').slideDown(200);
            }

            if (link == "text") {
                $('.gg-read-more-options-wrapper').slideDown(200);
            } else {
                $('.gg-read-more-options-wrapper').slideUp(200);
            }
        });


        // navigation buttons alignment toggle
        $('input[name="nbp_setting2"], input[id^="nbp_setting2_nav"]').change(function () {
            var align = $(this).val();
            $('input[name="nbp_setting2"][value="' + align + '"]').prop('checked', true);
            $('input[id^="nbp_setting2"][value="' + align + '"]').prop('checked', true);
        });

        // auto scroll toggle
        $('input[name="scroll_loading"], input[id^="scroll_loading_nav"]').change(function () {
            var scroll = $(this).val();
            $('input[name="scroll_loading"][value="' + scroll + '"]').prop('checked', true);
            $('input[id^="scroll_loading"][value="' + scroll + '"]').prop('checked', true);
        });



        // Toggle Loading Icon Color Picker visibility (global settings)
        $('input[name="gallery_loader"]').change(function () {
            if ($(this).val() === 'none') {
                $('.loader-color-row').slideUp(200);
            } else {
                $('.loader-color-row').slideDown(200);
            }
        });
    });

    $(document).ajaxComplete(function () {
        if ($.fn.wpColorPicker) {
            $('#title_color, #border_color, #load_button_color, #load_text_color, #load_button_hover, .ig-color-picker').wpColorPicker();
        }
    });

    // Settings Page Loader Transition
    function revealSettingsPage() {
        $('.gg-settings-loader').fadeOut(250, function () {
            $(this).remove();
            $('.gg-settings-main-content').fadeIn(250);
        });
    }
    if (document.readyState === 'complete') {
        revealSettingsPage();
    } else {
        $(window).on('load', revealSettingsPage);
    }
})(jQuery);
