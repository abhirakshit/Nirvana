define([
    "modules/enquiries/content/my/my_controller"
], function () {
    Application.module("Enquiries.Content.My", function (My, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (enqContentRegion) {
                new My.Controller({
                    region: enqContentRegion
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_CONTENT_MY, function (enqContentRegion) {
            API.show(enqContentRegion);
        });


    });
});