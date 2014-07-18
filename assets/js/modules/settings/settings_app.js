define([
    "modules/settings/settings_controller"
], function(){
    Application.module("Settings", function(Settings, Application, Backbone, Marionette, $, _) {

        Settings.rootRoute = "settings";
        Settings.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "settings": "show",
                "settings/": "show",
                "settings/:tabId": "show",
                "settings/:tabId/": "show"
            }
        });

        var API = {
            show: function(tabId) {
                console.log("Show Settings");
                new Settings.Controller({
                    region: Application.pageContentRegion,
                    tabId: tabId
                });
                Application.commands.execute(Application.SET_SIDEBAR, Application.SETTINGS_SHOW);
            }
        };

        Settings.setup = function() {
            new Settings.Router({
                controller: API
            });
//            Application.commands.execute(Application.MODULES_LOADED, Settings.rootRoute);
        };

        Settings.on(Application.START, function () {
            console.log("Settings start...");
            Marionette.TemplateLoader.loadModuleTemplates(Settings.Profile, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Settings.Admin, function(){
                    Marionette.TemplateLoader.loadModuleTemplates(Settings, Settings.setup);
                });
            })
        });

        Application.commands.setHandler(Application.SETTINGS_SHOW, function(){
            console.log("Settings show...");
            API.show();
            Application.navigate(Settings.rootRoute);
        });
    });
});
