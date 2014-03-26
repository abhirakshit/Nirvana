define([
    "modules/enquiries/enquiries_controller"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {
        Enquiries.rootRoute = "enquiries";
        var API = {
            show: function () {
                if (!Enquiries.controller) {
                    Enquiries.controller = new Enquiries.Controller({
                        region: Application.pageContentRegion
                    });
                }
            }
        };

        Enquiries.setup = function () {
            API.show();
            Application.commands.execute(Application.MODULES_LOADED, Enquiries.rootRoute);
        };

        Enquiries.on(Application.START, function () {
            console.log("Enquiries start...");
//            Marionette.TemplateLoader.loadModuleTemplates(Enquiries.Navbar, function() {
                Marionette.TemplateLoader.loadModuleTemplates(Enquiries, Enquiries.setup);
//            });
        });

        Application.commands.setHandler(Application.ENQUIRIES_SHOW, function(){
            API.show();
            Application.navigate(Enquiries.rootRoute);
        });

    });
});