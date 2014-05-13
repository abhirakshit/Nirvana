define([
    "modules/student/student_controller"
], function () {
    Application.module("Student", function (Student, Application, Backbone, Marionette, $, _) {

        Student.rootRoute = "student";
//        Student.Router = Marionette.AppRouter.extend({
//            appRoutes: {
//                "student/:id": "show"
//            }
//        });

        var API = {
            show: function (enqContentRegion, studentId) {
                new Student.Controller({
                    region: enqContentRegion,
                    studentId: studentId
                });
            }
        };




               Student.on(Application.START, function () {
            console.log("Student start...");
            //Marionette.TemplateLoader.loadModuleTemplates(Student.Student, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Student, Student.setup);
            });
        //});

        Application.commands.setHandler(Application.STUDENT_SHOW, function (enqContentRegion, studentId) {
            console.log("Student: " + studentId);
            API.show(enqContentRegion, studentId);
            Application.navigate(Student.rootRoute + "/" +studentId);
        });

    });
});




