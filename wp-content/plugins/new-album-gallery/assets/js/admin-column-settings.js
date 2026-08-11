(function($) {
    'use strict';

    $(document).ready(function() {
        // Range Slider value update
        $(document).on('input', '.range-slider__range', function() {
            $(this).next('.range-slider__value').text($(this).val());
        });

        // Re-init color pickers
        if ($.isFunction($.fn.wpColorPicker)) {
            $('.awl-ag-color-picker').wpColorPicker();
        }

        // Save Settings via Button Click
        $(document).on('click', '.ag-btn-primary-lg', function() {
            agpSaveSettings();
        });
    });

    /**
     * Save Global Column Settings via AJAX
     */
    function agpSaveSettings() {
        var $loader = $('#ag-save-loader');
        var $success = $('#ag-save-success');
        var data = $('#agp-column-settings').serialize();
        var nonce = $('#ag_column_nonce_field').val();
        
        $loader.css('display', 'flex');
        $success.hide();
        
        $.post(ajaxurl, {
            action: 'ag_save_column_settings',
            data: data,
            nonce: nonce
        }, function(response) {
            $loader.hide();
            if(response.success) {
                $success.css('display', 'flex').fadeIn().delay(3000).fadeOut();
            } else {
                alert('Error: ' + (response.data || 'Unknown error'));
            }
        });
    }

})(jQuery);
