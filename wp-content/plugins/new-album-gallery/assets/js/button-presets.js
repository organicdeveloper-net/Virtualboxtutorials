(function($) {
    'use strict';

    $(document).ready(function() {
        const presets = {
            solid: {
                bg: '#6366f1',
                hover: '#4f46e5',
                text: '#ffffff',
                px: 22,
                py: 10,
                radius: 50
            },
            outline: {
                bg: '#6366f1',
                hover: '#6366f1',
                text: '#ffffff',
                px: 22,
                py: 10,
                radius: 6
            },
            glass: {
                bg: '#6366f1',
                hover: '#818cf8',
                text: '#ffffff',
                px: 25,
                py: 12,
                radius: 12
            },
            neon: {
                bg: '#a855f7',
                hover: '#c084fc',
                text: '#a855f7',
                px: 25,
                py: 12,
                radius: 30
            },
            gradient: {
                bg: '#6366f1',
                hover: '#a855f7',
                text: '#ffffff',
                px: 25,
                py: 12,
                radius: 30
            },
            minimal: {
                bg: '#f8fafc',
                hover: '#f1f5f9',
                text: '#1e293b',
                px: 18,
                py: 6,
                radius: 0
            }
        };

        $('.ag-preset-card').on('click', function() {
            const presetKey = $(this).data('preset');
            const data = presets[presetKey];

            if (!data) return;

            // UI Update
            $('.ag-preset-card').removeClass('active');
            $(this).addClass('active');
            
            // Update the hidden input
            $('input[name="ags_button_preset"], input[name="agal_btn_preset"]').val(presetKey);

            // Apply Colors
            if (presetKey === 'gradient') {
                applyColor('agal_btn_bg_color', 'linear-gradient(135deg, #6366f1, #a855f7)');
                applyColor('agal_btn_hover_bg_color', '#6366f1');
                applyColor('agal_btn_text_color', '#ffffff');
            } else {
                applyColor('agal_btn_bg_color', data.bg);
                applyColor('agal_btn_hover_bg_color', data.hover);
                applyColor('agal_btn_text_color', data.text);
            }
            applyColor('ags_redirect_bg_color', data.bg);
            applyColor('ags_redirect_hover_bg_color', data.hover);
            applyColor('ags_redirect_text_color', data.text);

            // Apply Ranges
            applyRange('agal_btn_px', data.px);
            applyRange('agal_btn_py', data.py);
            applyRange('agal_btn_radius', data.radius);
            applyRange('ags_button_px', data.px);
            applyRange('ags_button_py', data.py);
            applyRange('ags_button_radius', data.radius);
            
            // Visual feedback
            $(this).css('transform', 'scale(0.95)');
            setTimeout(() => {
                $(this).css('transform', '');
            }, 150);
        });

        function applyColor(name, color) {
            const $input = $('input[name="' + name + '"]');
            if ($input.data('wpColorPicker')) {
                $input.wpColorPicker('color', color);
            } else {
                $input.val(color).trigger('change');
            }
        }

        function applyRange(name, value) {
            const $input = $('input[name="' + name + '"]');
            $input.val(value).trigger('input').trigger('change');
            // Update the span value next to slider
            $input.next('.range-slider__value').text(value);
        }
    });
})(jQuery);
