define([
    "modules/topics/topics_controller"
], function () {
    Application.module("Topics", function (Topics, Application, Backbone, Marionette, $, _) {
        Topics.rootRoute = "topics";
        Topics.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "topics": "show",
                "topics/": "show",
                "topics/:tabId": "show",
                "topics/:tabId/": "show",
//                "student/:id": "showStudent",
//                "student/:id/": "showStudent"
            }
        });

        var API = {
            show: function (tabId) {
                new Topics.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.TOPICS_SHOW);
            },

//            showStudent: function(studentId) {
//                new Topics.Controller({
//                    region: Application.pageContentRegion,
//                    studentId: studentId
//                });
//                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
//            }
        };

        Topics.setup = function () {
            new Topics.Router({
                controller: API
            });
//            Application.commands.execute(Application.MODULES_LOADED, Topics.rootRoute);
        };

        Topics.on(Application.START, function () {
            console.log("Topics start...");
//            Marionette.TemplateLoader.loadModuleTemplates(Topics.Show, function() {
////                Marionette.TemplateLoader.loadModuleTemplates(Topics.Content, function() {
//                Marionette.TemplateLoader.loadModuleTemplates(Topics.Content.All, function() {
//                    Marionette.TemplateLoader.loadModuleTemplates(Topics.Content.My, function() {
                        Marionette.TemplateLoader.loadModuleTemplates(Topics.List.All, function() {
                            Marionette.TemplateLoader.loadModuleTemplates(Topics, Topics.setup);
                        });
//                    });
//                });
////                });
//            });
        });

        Application.commands.setHandler(Application.TOPICS_SHOW, function (tabId) {
            API.show(tabId);
//            Application.navigate(Topics.rootRoute);
        });

    });
});