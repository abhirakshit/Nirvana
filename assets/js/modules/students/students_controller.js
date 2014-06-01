define([
    "modules/students/students_view",
    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country",
    "modules/students/show/show_app"
    
], function () {
    Application.module("Students", function (Students, Application, Backbone, Marionette, $, _) {


        Students.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_STUDENTS_ENROLLED);
                this.layout = this.getLayout();

                  var studentId = this.options.studentId;

                this.listenTo(this.layout, Application.SHOW, function () {
                    
                    if(studentId){

                        //this is coming from URL
                        Application.execute(Application.STUDENT_SHOW, this.options.region, studentId);
                    
                    } else {
                              this.showStudents(user);
                    }

                });



                // this.listenTo(this.layout, Application.SHOW, function () {
                    




                //    // this.showStudent(user);
                   

                //    // this.showUserInfoSection(user);
                //     //this.showChangePasswordSection(user);


                //     if (Application.USER_IS_ADMIN) {
                //         this.showAdminSection(user);
                //     }

                // });

                //Load layout

                this.show(this.layout, {
                    loading: { entities: user }
                });

            },


            
            showStudents: function(user){
                var studentsView = new Students.views.StudentsCollection({ collection: user});
            
                this.layout.changePasswordRegion.show(studentsView);

    // var that = this;
    //             this.listenTo(allStaffView, Application.SELECTED_STAFF, function(staffId){
                    
    //                 Application.execute(Application.SELECTED_STAFF, that.options.region, staffId);

    //             });

                    var that = this;
                this.listenTo(studentsView, Application.STUDENT_SHOW, function(studentId){
                   // console.log(Application.SELECTED_STUDENT);
                    Application.execute(Application.STUDENT_SHOW, this.layout.enqContentRegion, studentId);
                   //console.log('***********Its Working!******************');

            //            showEnquiry: function(studentId) {
            //     Application.execute(Application.ENQUIRY_SHOW, this.layout.enqContentRegion, studentId);
            // },

                });

            },







            getLayout: function () {
                return new Students.views.Layout();
            }
        });
    })
});