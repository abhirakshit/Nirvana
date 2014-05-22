define([
], function () {
    Application.module("Topics.List.All", function (List_All, Application, Backbone, Marionette, $, _) {

        this.prefix = "All";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        List_All.views.Layout = Application.Views.Layout.extend({
            template: "batches/list/templates/list_layout",
            regions: {
                topicsRegion: "#topics"
            }
        });


        List_All.views.Row = Application.Views.ItemView.extend({
            template: "batches/list/templates/row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceName = data.service.name;
                return data;
            },

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.TOPIC_SHOW, this);
            }
        });

    });
});