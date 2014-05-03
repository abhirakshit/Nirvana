define([
    "modules/enquiries/content/all/all_controller"
], function () {
    Application.module("Enquiries.Content.All", function (All, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (enqContentRegion, byDate) {
                new All.Controller({
                    region: enqContentRegion,
                    byDate: byDate
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_CONTENT_ALL, function (enqContentRegion) {
            API.show(enqContentRegion);
        });

        Application.commands.setHandler(Application.ENQUIRIES_CONTENT_ALL_BY_DATE, function (enqContentRegion) {
            API.show(enqContentRegion, true);
        });

    });
});