define([
    "modules/enquiries/enquiries_setup"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {

        Enquiries.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/templates/enquiries_layout",
            regions: {
                enqTabRegion: "#enqTabs",
                enqContentRegion: "#enqContent"
            }
        });
    });
});