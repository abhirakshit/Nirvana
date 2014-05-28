define([
    "modules/enquiries/enquiries_controller"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {
        Enquiries.rootRoute = "enquiries";
        Enquiries.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "enquiries": "show",
                "enquiries/": "show",
                "enquiries/:tabId": "show",
                "enquiries/:tabId/": "show",
                "enquiry/:id": "showEnquiry",
                "enquiry/:id/": "showEnquiry"
            }
        });

        var API = {
            show: function (tabId) {
                new Enquiries.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
            },

            showEnquiry: function(studentId) {
                new Enquiries.Controller({
                    region: Application.pageContentRegion,
                    studentId: studentId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.ENQUIRIES_SHOW);
            }
        };

        Enquiries.setup = function () {
            new Enquiries.Router({
                controller: API
            });
//            API.show();
            Application.commands.execute(Application.MODULES_LOADED, Enquiries.rootRoute);
        };

        Enquiries.on(Application.START, function () {
            console.log("Enquiries start...");
            Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Show, function() {
//                Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Content, function() {
                    Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Content.All, function() {
                        Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Content.My, function() {
                            Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Content.Closed, function() {
                                Marionette.TemplateLoader.loadModuleTemplates(Enquiries, Enquiries.setup);
                            });
                        });
                    });
//                });
            });
        });

        Application.commands.setHandler(Application.ENQUIRIES_SHOW, function (tabId) {
            API.show(tabId);
//            Application.navigate(Enquiries.rootRoute);
        });

    });
});