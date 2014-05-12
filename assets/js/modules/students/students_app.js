/*
This file dependent on students_controller: defining all dependencies, make sure to add 
an entry in Nirvana/assets/js/app.js file under Application.addInitializer 
section to intialize the application and add under require  "modules/students/students_app". */


define([
    "modules/students/students_controller"
], function(){

//Name of the new module (students) and all other required modules.

    Application.module("Students", function(Students, Application, Backbone, Marionette, $, _) {

//Specify URL routes 'students'
        Students.rootRoute = "students";

//specify all other routes that will run a function, in below both students and students/ will run show mehtod      
        Students.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "students": "show",
                "students/": "show",
                 "student/:id": "showStudent",
                "student/:id/": "showStudent"
            }
        });


        var API = {
            show: function() {
                console.log("Show Students");
//specify controller along with the pageContent region.
                
                new Students.Controller({ region: Application.pageContentRegion });


                Application.commands.execute(Application.SET_SIDEBAR, "students:show");
            },
            


            // showStudent: function(studentId) {
            //     new Students.Controller({
            //         region: Application.pageContentRegion,
            //         studentId: staffId
            //     });
            //     Application.commands.execute(Application.SET_SIDEBAR, "students:show");
            //    // Application.commands.execute()
            // },

            showStudent: function(studentId) {
                new Enquiries.Controller({
                    region: Application.pageContentRegion,
                    studentId: studentId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
            }


        };

        Students.setup = function() {
            new Students.Router({ controller: API });
//            Application.commands.execute(Application.MODULES_LOADED, Students.rootRoute);
        };

        Students.on(Application.START, function () {
            console.log("Students start...");
            Marionette.TemplateLoader.loadModuleTemplates(Students.Show, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Students, Students.setup);
            });
        });

        Application.commands.setHandler("students:show", function(){
            API.show();
            Application.navigate(Students.rootRoute);
        });
    });
});
