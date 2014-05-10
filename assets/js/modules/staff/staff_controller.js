define([
    "modules/staff/staff_view",
    "modules/entities/user",
    "modules/staff/show/show_app"
], function () {
    Application.module("Staff", function (Staff, Application, Backbone, Marionette, $, _) {


        Staff.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_ALL_STAFF);
                this.layout = this.getLayout();
                var staffId = this.options.staffId;

                this.listenTo(this.layout, Application.SHOW, function () {
                    
                    if(staffId){

                        //this is coming from URL
                        Application.execute(Application.SELECTED_STAFF, this.options.region, staffId);
                    
                    } else {
                         this.showAllStaff(user);
                    }

                });



                //Load layout

                this.show(this.layout, {
                    loading: { entities: user }
                });

            },


            
            showAllStaff: function(user){

                var allStaffView = new Staff.views.StaffCollection({ collection: user});
            
                this.layout.changePasswordRegion.show(allStaffView);

                var that = this;
                this.listenTo(allStaffView, Application.SELECTED_STAFF, function(staffId){
                    
                    Application.execute(Application.SELECTED_STAFF, that.options.region, staffId);

                });




            },

            showSelectedStaff: function(userId){


                // var that = this;
                // this.listenTo(showAllStaff.allStaffView, Application.SELECTED_STAFF, function(staffId){
                //     Application.execute(Application.SELECTED_STAFF, that.options.region, staffId);
                //     console.log('Its Working!');
                // });



            },




            getLayout: function () {
                return new Staff.views.Layout();
            }


        });
    })
});