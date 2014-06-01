define([
    "modules/batches/show/batches_show_controller"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.rootRoute = "batch";

        var API = {
            show: function (contentRegion, batchId) {
                new Show.Controller({
                    region: contentRegion,
                    batchId: batchId
                });
            }
        };

        Application.commands.setHandler(Application.BATCH_SHOW, function (contentRegion, batchId) {
            API.show(contentRegion, batchId);
            Application.navigate(Show.rootRoute + "/" +batchId);
        });

    });
});