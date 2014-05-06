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
            show: function (enqContentRegion, staffId) {
                new Show.Controller({
                    region: enqContentRegion,
                    staffId: staffId
                });
            }
        };



        Application.commands.setHandler(Show.parent.SELECTED_STAFF, function (enqContentRegion, staffId) {
            console.log("Show staff: " + staffId);
            API.show(enqContentRegion, staffId);
            Application.navigate(Show.rootRoute + "/" +staffId);
        });

    });
});