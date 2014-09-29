/*
 This file dependent on staff_controller: defining all dependencies, make sure to add
 an entry in Nirvana/assets/js/app.js file under Application.addInitializer
 section to intialize the application and add under require  "modules/staff/staff_app". */


define([
    "modules/staff/staff_controller"
], function () {

//Name of the new module (staff) and all other required modules.

    Application.module("Staff", function (Staff, Application, Backbone, Marionette, $, _) {

//Specify URL routes 'staff'
        Staff.rootRoute = "staffs";

//specify all other routes that will run a function, in below both staff and staff/ will run show mehtod      
        Staff.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "staffs": "show",
                "staffs/": "show",
                "staffs/:tabId": "show",
                "staffs/:tabId/": "show",
                "staff/:id": "showStaff",
                "staff/:id/": "showStaff"
            }
        });

        var API = {
            show: function (tabId) {
                //specify controller along with the pageContent region.
                new Staff.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.STAFF_SHOW);
            },

            showStaff: function (staffId) {
                new Staff.Controller({
                    region: Application.pageContentRegion,
                    staffId: staffId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.STAFF_SHOW);
            }
        };

        Staff.setup = function () {
            new Staff.Router({ controller: API });
        };

        Staff.on(Application.START, function () {
            console.log("Staff start...");
            Marionette.TemplateLoader.loadModuleTemplates(Staff.List, function () {
                Marionette.TemplateLoader.loadModuleTemplates(Staff.Show, function () {
                    Marionette.TemplateLoader.loadModuleTemplates(Staff, Staff.setup);
                });
            });
        });

        Application.commands.setHandler(Application.STAFF_SHOW, function () {
            API.show();
            Application.navigate(Staff.rootRoute);
        });
    });
});
