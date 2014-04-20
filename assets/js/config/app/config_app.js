define([
//    "modules/entities/user"
],
    function () {
        Application.module("Config", function (Config, Application, Backbone, Marionette, $, _) {

            Config.setApplicationConfig = function() {
                Config.setupDateTimePickerConfig();
                Config.setUpXEditableConfig();
            };

            Config.setupDateTimePickerConfig = function() {
                $.fn.datetimepicker.defaults = {
                    icons: {
                        time: "fa fa-clock-o",
                        date: "fa fa-calendar",
                        up: "fa fa-arrow-up",
                        down: "fa fa-arrow-down"
                    },
                    language: 'en',
                    pick12HourFormat: true,
                    pickSeconds: false,
//                    useStrict: true,
//                    maskInput: false
                };
            };

            Config.setUpXEditableConfig = function () {
                $.fn.editable.defaults.placement = 'bottom';
//                $.fn.editable.defaults.mode = 'inline';
//                $.fn.editable.defaults.ajaxOptions = {type: "PATCH", dataType: 'json'};

//                if (!Application.request(Application.IS_USER_ADMIN)) {
//                    $.fn.editable.defaults.disabled = 'true';
//                }

            };


        });
    });