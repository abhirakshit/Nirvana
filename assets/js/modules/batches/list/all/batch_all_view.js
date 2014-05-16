define([
], function () {
    Application.module("Batches.List.All", function (All, Application, Backbone, Marionette, $, _) {

        this.prefix = "All";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        All.views.Layout = Application.Views.Layout.extend({
            template: "batches/list/templates/list_layout",
            regions: {
                batchesRegion: "#batches"
            }
        });

    });
});