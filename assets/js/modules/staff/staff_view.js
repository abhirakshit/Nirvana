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
                this.trigger('selectedStaff:show', this.model);
                console.dir(this.model);

            }
            // ,

            // serializeData: function(){
            //     var data = this.model.toJSON();
            //     console.log(data);
            //     data.locationName = data.location.get('name');

            //     return data;
            // }

        });

        Staff.views.StaffCollection = Application.Views.CollectionView.extend({
            itemView: Staff.views.Show,
            template: 'staff/templates/show_all_staff'

        });



    })
});