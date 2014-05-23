define([
    "modules/topics/list/all/topics_all_controller"
], function () {
    Application.module("Topics.List.All", function (List_All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new List_All.Controller({
                    region: contentRegion
//                    byDate: byDate
                });
            }
        };

        Application.commands.setHandler(Application.TOPICS_LIST_ALL, function (contentRegion) {
            API.show(contentRegion);
        });

    });
});