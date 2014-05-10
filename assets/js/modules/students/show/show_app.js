define([
    "modules/students/show/show_controller"
], function () {
    Application.module("Students.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.rootRoute = "students";
       // Show.Router = Marionette.AppRouter.extend({
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



        Application.commands.setHandler(Application.SELECTED_STUDENT, function (enqContentRegion, studentId) {
            console.log("Show student: " + studentId);

            API.show(enqContentRegion, studentId);
            Application.navigate(Show.rootRoute + "/" +studentId);
        });

    });
});