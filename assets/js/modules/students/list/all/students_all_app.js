define([
    "modules/students/list/all/students_all_controller"
], function () {
    Application.module("Students.List.All", function (List_All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new List_All.Controller({
                    region: contentRegion
                });
            }
        };

        Application.commands.setHandler(Application.STUDENTS_LIST_ALL, function (contentRegion) {
            API.show(contentRegion);
        });

    });
});