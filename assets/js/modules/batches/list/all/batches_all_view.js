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


        All.views.Row = Application.Views.ItemView.extend({
            template: "batches/list/templates/row",
            tagName: "tr",

//            serializeData: function() {
//                var data = this.model.toJSON();
//                var service = data.service;
//                if (service.name) {
//                    data.serviceName = service.name;
//                } else {
//                    console.log(service);
//                }
////                data.serviceName = data.service.name;
//                return data;
//            },

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.BATCH_SHOW, this);
            }
        });

    });
});