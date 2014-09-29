define([
    "modules/staff/show/show_controller"
], function () {
    Application.module("Staff.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.rootRoute = "staff";
       // Show.Router = Marionette.AppRouter.extend({
       //     appRoutes: {
       //         "staff/:id": "show"
       //     }
       // });

        var API = {
            show: function (contentRegion, staffId) {
                new Show.Controller({
                    region: contentRegion,
                    staffId: staffId
                });
            }
        };

        Application.commands.setHandler(Application.SELECTED_STAFF, function (contentRegion, staffId) {
            console.log("Show staff: " + staffId);
            API.show(contentRegion, staffId);
            Application.navigate(Show.rootRoute + "/" +staffId);
        });

    });
});