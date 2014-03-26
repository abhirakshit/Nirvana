define([
    "modules/settings/settings_controller"
], function(){
    Application.module("Settings", function(Settings, Application, Backbone, Marionette, $, _) {

        Settings.rootRoute = "settings";
        Settings.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "settings": "show",
                "settings/": "show"
            }
        });

        var API = {
            show: function() {
                console.log("Show Settings");
                new Settings.Controller({
                    region: Application.pageContentRegion
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.SETTINGS_SHOW);
            }
        };

        Settings.setup = function() {
            new Settings.Router({
                controller: API
            })
            Application.commands.execute(Application.MODULES_LOADED, Settings.rootRoute);
        };

        Settings.on(Application.START, function () {
            console.log("Settings start...");
//            Marionette.TemplateLoader.loadModuleTemplates(Settings.User, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Settings, Settings.setup);
//            });
        });

        Application.commands.setHandler(Application.SETTINGS_SHOW, function(){
            API.show();
            Application.navigate(Settings.rootRoute);
        });
    });
});
