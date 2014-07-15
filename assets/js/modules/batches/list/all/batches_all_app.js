define([
    "modules/batches/list/all/batches_all_controller"
], function () {
    Application.module("Batches.List.All", function (All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion, showAll) {
                new All.Controller({
                    region: contentRegion,
                    showAll: showAll
                });
            }
        };

        Application.commands.setHandler(Application.BATCHES_LIST_ALL, function (contentRegion) {
            API.show(contentRegion, true);
        });

        Application.commands.setHandler(Application.BATCHES_LIST_CURRENT, function (contentRegion) {
            API.show(contentRegion, false);
        });

    });
});