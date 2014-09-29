define([
    "modules/staff/list/list_controller"
], function () {
    Application.module("Staff.List", function (List, Application, Backbone, Marionette, $, _) {

//        List.rootRoute = "staff";
       // Show.Router = Marionette.AppRouter.extend({
       //     appRoutes: {
       //         "staff/:id": "show"
       //     }
       // });

        var API = {
            show: function (contentRegion, tabId) {
                new List.Controller({
                    region: contentRegion,
                    tabId: tabId
                });
            }
        };

        Application.commands.setHandler(Application.STAFF_LIST, function (contentRegion, tabId) {
            API.show(contentRegion, tabId);
//            Application.navigate(Show.rootRoute + "/" +tabId);
        });

    });
});