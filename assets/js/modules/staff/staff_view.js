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
               // console.dir(this.model);

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
            template: 'staff/templates/show_all_staff',
            initialize: function(){

                // console.log('Hello from collection view');
                //var that = this;
                this.on('itemview:staffs:show', function(childView){
                    console.log('Hello from collection view');

                    //that.trigger('staff:show', childView.model.get('id'));
                });
            }

        });




// colView.on("itemview:do:something", function(childView, msg){
//   alert("I said, '" + msg + "'");
// });

// // hack, to get the child view and trigger from it
// var childView = colView.children[myModel.cid];
// childView.trigger("do:something", "do something!");




    })
});