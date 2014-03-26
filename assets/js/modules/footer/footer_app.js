define([
    "modules/footer/show/show_controller"
], function () {
    Application.module("Footer", function (Footer, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function () {
                new Footer.Show.Controller({
                    region: Application.footerRegion
                });
            }
        };

        Footer.setup = function () {
            API.show();
        };

        Footer.on(Application.START, function () {
            console.log("Footer start...")
            Marionette.TemplateLoader.loadModuleTemplates(Footer.Show, Footer.setup);
        });

    });
});