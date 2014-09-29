define([
    "modules/sidebar/list/list_controller"
], function () {
    Application.module("Sidebar", function (Sidebar, Application, Backbone, Marionette, $, _) {
        var API = {
            list: function () {
                if (!Sidebar.controller) {
                    Sidebar.controller = new Sidebar.List.Controller({
                        region: Application.sidebarRegion
                    });
                }
            },

            setSidebar: function(sidebarId) {
                Sidebar.controller.activateSidebarTab(sidebarId);
            }
        };

        Sidebar.setup = function () {
            API.list();
        };

        Sidebar.on(Application.START, function () {
            console.log("Sidebar start...");
            Marionette.TemplateLoader.loadModuleTemplates(Sidebar.List, Sidebar.setup);
        });

        Application.commands.setHandler(Application.SET_SIDEBAR, function(sidebarId){
            API.setSidebar(sidebarId);
        });

    });
});