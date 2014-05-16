define([
    "modules/batches/batches_controller"
], function () {
    Application.module("Batches", function (Batches, Application, Backbone, Marionette, $, _) {
        Batches.rootRoute = "batches";
        Batches.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "batches": "show",
                "batches/": "show",
//                "batches/:tabId": "show",
//                "batches/:tabId/": "show",
//                "student/:id": "showStudent",
//                "student/:id/": "showStudent"
            }
        });

        var API = {
            show: function (tabId) {
                new Batches.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.BATCHES_SHOW);
            },

//            showStudent: function(studentId) {
//                new Batches.Controller({
//                    region: Application.pageContentRegion,
//                    studentId: studentId
//                });
//                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
//            }
        };

        Batches.setup = function () {
            new Batches.Router({
                controller: API
            });
//            Application.commands.execute(Application.MODULES_LOADED, Batches.rootRoute);
        };

        Batches.on(Application.START, function () {
            console.log("Batches start...");
//            Marionette.TemplateLoader.loadModuleTemplates(Batches.Show, function() {
////                Marionette.TemplateLoader.loadModuleTemplates(Batches.Content, function() {
//                Marionette.TemplateLoader.loadModuleTemplates(Batches.Content.All, function() {
//                    Marionette.TemplateLoader.loadModuleTemplates(Batches.Content.My, function() {
//                        Marionette.TemplateLoader.loadModuleTemplates(Batches.Content.Closed, function() {
                            Marionette.TemplateLoader.loadModuleTemplates(Batches, Batches.setup);
//                        });
//                    });
//                });
////                });
//            });
        });

        Application.commands.setHandler(Application.BATCHES_SHOW, function (tabId) {
            API.show(tabId);
//            Application.navigate(Batches.rootRoute);
        });

    });
});