/*
This file dependent on staff_controller: defining all dependencies, make sure to add 
an entry in Nirvana/assets/js/app.js file under Application.addInitializer 
section to intialize the application and add under require  "modules/staff/staff_app". */


define([
    "modules/staff/staff_controller"
], function(){

//Name of the new module (staff) and all other required modules.

    Application.module("Staff", function(Staff, Application, Backbone, Marionette, $, _) {

//Specify URL routes 'staff'
        Staff.rootRoute = "staff";

//specify all other routes that will run a function, in below both staff and staff/ will run show mehtod      
        Staff.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "staff": "show",
                "staff/": "show",
                "staff/:id": "showStaff",
                "staff/:id/": "showStaff"
            }
        });


        var API = {
            show: function() {
                console.log("Show All Staff");
//specify controller along with the pageContent region.
                
                new Staff.Controller({ region: Application.pageContentRegion });


                Application.commands.execute(Application.SET_SIDEBAR, "staff:show");
            },

                  showStaff: function(staffId) {
                new Staff.Controller({
                    region: Application.pageContentRegion,
                    staffId: staffId
                });
                Application.commands.execute(Application.SET_SIDEBAR, "staff:show");
            }
        };

        Staff.setup = function() {
            new Staff.Router({ controller: API });

  
           // Application.commands.execute(Application.MODULES_LOADED, Staff.rootRoute);

//            Application.commands.execute(Application.MODULES_LOADED, Staff.rootRoute);
        };

        Staff.on(Application.START, function () {
            console.log("Staff start...");
            Marionette.TemplateLoader.loadModuleTemplates(Staff.Show, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Staff, Staff.setup);
            });
        });

        Application.commands.setHandler("staff:show", function(){
            API.show();
            Application.navigate(Staff.rootRoute);
        });
    });
});
