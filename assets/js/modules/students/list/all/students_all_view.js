define([
], function () {
    Application.module("Students.List.All", function (List_All, Application, Backbone, Marionette, $, _) {

        this.prefix = "All";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        List_All.views.Layout = Application.Views.Layout.extend({
            template: "students/list/templates/list_layout",
            regions: {
                studentsRegion: "#students"
            }
        });


        List_All.views.Row = Application.Views.ItemView.extend({
            template: "students/list/templates/row",
            tagName: "tr",

            serializeData: function() {
                var data = this.model.toJSON();
                data.serviceNames = _.pluck(data.services, 'name').join(', ');
                data.staffNames = _.pluck(data.staff, 'name').join(', ');
                data.locationNames = _.pluck(data.locations, 'name').join(', ');
                return data;
            },

            events: {
                "click": "click",
//                "click .edit": "edit",
//                "click .delete": "delete"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.STUDENT_SHOW, this);
            },

//            edit: function(evt) {
//                evt.preventDefault();
//                this.trigger(Application.STUDENT_SHOW, this);
//            },
//
//            delete: function(evt) {
//                evt.preventDefault();
//                this.trigger(Application.DELETE);
//            }

        });

    });
});