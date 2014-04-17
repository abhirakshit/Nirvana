define([
    "modules/students/students_view",
    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country"
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

//    showStudent: function(user){

// console.log(user.get('email'));
// console.log(user.get('name'));
// console.log(user);

//     // to show one item
//               var showView = new Students.views.Show({ model:user });

//               this.layout.profileRegion.show(showView);
//             },

            // to show collection of students
            
            showStudents: function(user){
                var studentsView = new Students.views.StudentsCollection({ collection: user});
            
                this.layout.changePasswordRegion.show(studentsView);
            },







            getLayout: function () {
                return new Students.views.Layout();
            }
        });
    })
});