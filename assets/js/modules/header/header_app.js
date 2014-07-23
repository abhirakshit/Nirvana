define([
    "modules/header/show/show_controller"
], function () {
    Application.module("Header", function (Header, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function () {
                new Header.Show.Controller({
                    region: Application.headerRegion
                });
            }
        };

        Header.setup = function () {
            API.show();
        };

        Header.on(Application.START, function () {
            console.log("Header start...");
            Marionette.TemplateLoader.loadModuleTemplates(Header.Show, Header.setup);
        });

    });
});