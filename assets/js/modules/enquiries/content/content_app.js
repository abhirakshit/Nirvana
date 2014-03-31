define([
    "modules/enquiries/content/content_controller"
], function () {
    Application.module("Enquiries.Content", function (Content, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (enqContentRegion, tabId) {
                new Content.Controller({
                    region: enqContentRegion,
                    tabId: tabId
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_CONTENT_SHOW, function (enqContentRegion, tabId) {
            API.show(enqContentRegion, tabId);
        });

    });
});