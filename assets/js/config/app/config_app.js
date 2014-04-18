define([
//    "modules/entities/user"
],
    function () {
        Application.module("Config", function (Config, Application, Backbone, Marionette, $, _) {
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