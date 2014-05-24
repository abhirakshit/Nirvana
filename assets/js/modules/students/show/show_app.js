define([
    "modules/students/show/show_controller"
], function () {
    Application.module("Students.Show", function (Show, Application, Backbone, Marionette, $, _) {

         Show.rootRoute = "student";
       // Student.Router = Marionette.AppRouter.extend({
       //     appRoutes: {
       //         "student/:id": "show"
       //     }
       // });

        var API = {
            show: function (enqContentRegion, studentId) {
                new Show.Controller({
                    region: enqContentRegion,
                    studentId: studentId
                });
            }
        };



        Application.commands.setHandler(Application.STUDENT_SHOW, function (enqContentRegion, studentId) {
            console.log("Student: " + studentId);
            API.show(enqContentRegion, studentId);
            Application.navigate(Show.rootRoute + "/" +studentId);
        });

    });
});




