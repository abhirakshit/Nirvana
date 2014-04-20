define([
    "modules/staff/staff_view",
    "modules/entities/user"
], function () {
    Application.module("Staff", function (Staff, Application, Backbone, Marionette, $, _) {


        Staff.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_ALL_STAFF);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    
                    this.showAllStaff(user);

                });


    

//     //var staff = Application.request(Application.GET_STAFF, this.options.staffId);

 var allStaffView = new Staff.views.StaffCollection({ collection: user});

//     allStaffView.on("itemview:selectedStaff:show", function(childView,model){
//     console.log('I am here!!!');
// //ContactManager.ContactsApp.Show.Controller.showContact(model);

// });

                var that = this;
                this.listenTo(allStaffView, 'selectedStaff:show', function(staffId){
                    //Application.execute(Application.ENQUIRY_SHOW, that.options.region, studentId);
                    console.log('I am here!!')
// var staff = Application.request(Application.GET_STAFF, this.options.staffId);
//                     this.showSelectedStaff(staffId);
                });

            var selectedStaff = Application.request(Application.GET_STAFF);

            this.layout = this.getLayout();

            this.listenTo(this.layout, 'selectedStaff:show', function(childView, model){
                this.showSelectedStaff(selectedStaff(model.get.id));
                console.log(model.get.id);
            });


                //Load layout

                this.show(this.layout, {
                    loading: { entities: user }
                });

            },


            
            showAllStaff: function(user){

                var allStaffView = new Staff.views.StaffCollection({ collection: user});
            
                this.layout.changePasswordRegion.show(allStaffView);




            },

            showSelectedStaff: function(userId){

console.log('Showing........');
               // var selectedStaffView = new Staff.views.Staff
            },




            getLayout: function () {
                return new Staff.views.Layout();
            }


        });
    })
});