define([
    "modules/enquiries/content/closed/closed_controller"
], function () {
    Application.module("Enquiries.Content.Closed", function (Closed, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (enqContentRegion) {
                new Closed.Controller({
                    region: enqContentRegion
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_CONTENT_CLOSED, function (enqContentRegion) {
            API.show(enqContentRegion);
        });

    });
});