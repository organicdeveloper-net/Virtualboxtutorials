jQuery(document).ready(function($){
    if ($.fn.wpColorPicker) {
        $('.ig-color-picker, .ags-color-picker, .awl-ag-color-picker').wpColorPicker();
        
        var CpickerOptions = {
            defaultColor: false,
            change: function(event, ui){},
            clear: function() {},
            hide: true,
            palettes: true
        };
        $('.ig-color-picker, .ags-color-picker, .awl-ag-color-picker').wpColorPicker(CpickerOptions);
    }
});