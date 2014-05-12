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
                var user = Application.request(Application.GET_STUDENTS);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    

                   // this.showStudent(user);
                    this.showStudents(user);

                   // this.showUserInfoSection(user);
                    //this.showChangePasswordSection(user);


                    if (Application.USER_IS_ADMIN) {
                        this.showAdminSection(user);
                    }

                });

                //Load layout

                this.show(this.layout, {
                    loading: { entities: user }
                });

            },


            
            showStudents: function(user){
                var studentsView = new Students.views.StudentsCollection({ collection: user});
            
                this.layout.changePasswordRegion.show(studentsView);



                    var that = this;
                this.listenTo(studentsView, Application.SELECTED_STUDENT, function(studentId){
                   // console.log(Application.SELECTED_STUDENT);
                    Application.execute(Application.ENQUIRY_SHOW, that.options.region, studentId);
                   //console.log('***********Its Working!******************');

                });

            },







            getLayout: function () {
                return new Students.views.Layout();
            }
        });
    })
});