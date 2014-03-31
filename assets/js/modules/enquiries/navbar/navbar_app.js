define([
    "modules/enquiries/navbar/navbar_controller"
], function () {
    Application.module("Enquiries.Navbar", function (Navbar, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (navRegion, tabCollection, activeTabId) {
                new Navbar.Controller({
                    region: navRegion,
                    tabCollection: tabCollection,
                    activeTabId: activeTabId
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_NAV_SHOW, function (navRegion, tabCollection, activeTabId) {
            API.show(navRegion, tabCollection, activeTabId);
        });

    });
});