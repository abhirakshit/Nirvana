define([
    "modules/payments/payments_controller"
], function () {
    Application.module("Payments", function (Payments, Application, Backbone, Marionette, $, _) {
        Payments.rootRoute = "payments";
        Payments.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "payments": "show",
                "payments/": "show",
                "payments/:tabId": "show",
                "payments/:tabId/": "show",
//                "student/:id": "showStudent",
//                "student/:id/": "showStudent"
            }
        });

        var API = {
            show: function (tabId) {
                new Payments.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.PAYMENTS_SHOW);
            },

//            showStudent: function(studentId) {
//                new Payments.Controller({
//                    region: Application.pageContentRegion,
//                    studentId: studentId
//                });
//                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
//            }
        };

        Payments.setup = function () {
            new Payments.Router({
                controller: API
            });
//            Application.commands.execute(Application.MODULES_LOADED, Payments.rootRoute);
        };

        Payments.on(Application.START, function () {
            console.log("Payments start...");
//            Marionette.TemplateLoader.loadModuleTemplates(Payments.Show, function() {
////                Marionette.TemplateLoader.loadModuleTemplates(Payments.Content, function() {
//                Marionette.TemplateLoader.loadModuleTemplates(Payments.Content.All, function() {
//                    Marionette.TemplateLoader.loadModuleTemplates(Payments.Content.My, function() {
                        Marionette.TemplateLoader.loadModuleTemplates(Payments.List.All, function() {
                            Marionette.TemplateLoader.loadModuleTemplates(Payments, Payments.setup);
                        });
//                    });
//                });
////                });
//            });
        });

        Application.commands.setHandler(Application.PAYMENTS_SHOW, function (tabId) {
            API.show(tabId);
//            Application.navigate(Payments.rootRoute);
        });

    });
});