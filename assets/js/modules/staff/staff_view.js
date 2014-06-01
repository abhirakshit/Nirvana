define([], function(){
    Application.module("Staff", function(Staff, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Staff";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        // This has been added to only keep class naming consistent with views.
        this.models = {};
        this.collections = {};
        //*************


        Staff.views.Layout = Application.Views.Layout.extend({
            template: "staff/templates/staff_layout",

            regions : {
                profileRegion: "#profileSection",
                changePasswordRegion: "#changePasswordSection",
                adminRegion: "#adminSection"
            }
        });




        Staff.views.Show = Application.Views.ItemView.extend({
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


 Application.SELECTED_STAFF = 'staffs:show';

        Staff.views.StaffCollection = Application.Views.CollectionView.extend({
            itemView: Staff.views.Show,
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