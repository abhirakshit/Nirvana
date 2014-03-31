define([
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/show/templates/show_layout",
            className: "someClass"
//            regions: {
//                enquiriesRegion: "#enquiries"
//            }
        });



    });
});