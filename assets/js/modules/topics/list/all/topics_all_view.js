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
            template: "topics/list/templates/list_layout",
            regions: {
                topicsRegion: "#topics"
            }
        });


        List_All.views.Row = Application.Views.ItemView.extend({
            template: "topics/list/templates/row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceName = data.service.name;
                return data;
            },

            events: {
//                "click": "click",
                "click .edit": "edit",
                "click .delete": "delete"
            },

//            click: function(evt) {
//                evt.preventDefault();
//                this.trigger(Application.TOPIC_SHOW, this);
//            },

            edit: function(evt) {
                evt.preventDefault();
                this.trigger(Application.TOPIC_SHOW, this);
            },

            delete: function(evt) {
                evt.preventDefault();
                this.trigger(Application.DELETE);
            }

        });

    });
});