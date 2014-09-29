/*
 This file dependent on students_controller: defining all dependencies, make sure to add
 an entry in Nirvana/assets/js/app.js file under Application.addInitializer
 section to initialize the application and add under require  "modules/students/students_app". */


define([
    "modules/students/students_controller"
], function () {

//Name of the new module (students) and all other required modules.

    Application.module("Students", function (Students, Application, Backbone, Marionette, $, _) {

//Specify URL routes 'students'
        Students.rootRoute = "students";

//specify all other routes that will run a function, in below both students and students/ will run show method
        Students.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "students": "show",
                "students/": "show",
                "students/:tabId": "show",
                "students/:tabId/": "show",
                "student/:id": "showStudent",
                "student/:id/": "showStudent"
            }
        });


        var API = {
            show: function (tabId) {
                //specify controller along with the pageContent region.
                new Students.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });

                Application.commands.execute(Application.SET_SIDEBAR, Application.STUDENTS_SHOW);
            },

            showStudent: function (studentId) {
                new Students.Controller({
                    region: Application.pageContentRegion,
                    studentId: studentId
                });

                Application.commands.execute(Application.SET_SIDEBAR, Application.STUDENTS_SHOW);
            }
        };

        Students.setup = function () {
            new Students.Router({ controller: API });
            //Application.commands.execute(Application.SET_SIDEBAR, Students.rootRoute);

//            Application.commands.execute(Application.MODULES_LOADED, Students.rootRoute);
        };

        Students.on(Application.START, function () {
            console.log("Students start...");
            Marionette.TemplateLoader.loadModuleTemplates(Students.List.All, function () {
                Marionette.TemplateLoader.loadModuleTemplates(Students.Show, function () {
                    Marionette.TemplateLoader.loadModuleTemplates(Students, Students.setup);
                });
            });
        });

        Application.commands.setHandler(Application.STUDENTS_SHOW, function () {
            API.show();
            Application.navigate(Students.rootRoute);
        });
    });
});
