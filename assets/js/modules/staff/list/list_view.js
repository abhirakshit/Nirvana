define([], function(){
    Application.module("Staff.List", function(List, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Staff.List";
        this.templatePath = "js/modules/";
        this.views = {};

        Application.SELECTED_STAFF = 'staffs:show';

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        //*************

        List.views.Layout = Application.Views.Layout.extend({
            template: "staff/list/templates/layout",
            regions: {
                staffListRegion: "#staff-list"
            }
        });

        List.views.Show = Application.Views.ItemView.extend({
            className: 'staffClass',
            template: 'staff/templates/show_staff',
            events: {
                "click": "selectedStaff"
            },

             selectedStaff: function(evt) {
                evt.preventDefault();
                console.log("Show selected staff: " + this.model);
                this.trigger('staffs:show', this.model);
            }

        });

        List.views.Row = Application.Views.ItemView.extend({
            template: "staff/list/templates/row",
            tagName: "tr",

            events: {
                "click": "click"
            },

            click: function(evt) {
                evt.preventDefault();
                this.trigger(Application.SELECTED_STAFF, this);
            }
        });

        List.views.StaffCollection = Application.Views.CollectionView.extend({
            itemView: List.views.Show,
            template: 'staff/templates/show_all_staff',

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Application.SELECTED_STAFF, function(childView){
                    that.trigger(Application.SELECTED_STAFF, childView.model.get('id'));

                });
            }
        });
    })
});