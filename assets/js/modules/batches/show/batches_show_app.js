define([
    "modules/batches/show/show_controller"
], function () {
    Application.module("Batches.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.rootRoute = "batches";
//        Show.Router = Marionette.AppRouter.extend({
//            appRoutes: {
//                "student/:id": "show"
//            }
//        });

        var API = {
            show: function (contentRegion, studentId) {
                new Show.Controller({
                    region: contentRegion,
                    studentId: studentId
                });
            }
        };

        Application.commands.setHandler(Application.BATCH_SHOW, function (contentRegion, batchId) {
//            console.log("Show Batch: " + studentId);
            API.show(contentRegion, batchId);
            Application.navigate(Show.rootRoute + "/" +batchId);
        });

    });
});