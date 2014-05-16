define([
    "modules/batches/list/all/all_controller"
], function () {
    Application.module("Batches.List.All", function (All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new All.Controller({
                    region: contentRegion
//                    byDate: byDate
                });
            }
        };

        Application.commands.setHandler(Application.BATCHES_LIST_ALL, function (contentRegion) {
            API.show(contentRegion);
        });

    });
});