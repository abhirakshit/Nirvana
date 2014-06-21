define([
    "modules/payments/list/all/payments_all_controller"
], function () {
    Application.module("Payments.List.All", function (List_All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new List_All.Controller({
                    region: contentRegion
//                    byDate: byDate
                });
            }
        };

        Application.commands.setHandler(Application.PAYMENTS_LIST_ALL, function (contentRegion) {
            API.show(contentRegion);
        });

    });
});