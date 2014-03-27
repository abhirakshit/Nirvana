define([
    "modules/enquiries/navbar/navbar_controller"
], function () {
    Application.module("Enquiries.Navbar", function (Navbar, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (navRegion) {
                new Navbar.Controller({
                    region: navRegion
                });
            }
        };

        Application.commands.setHandler(Application.ENQUIRIES_NAV_SHOW, function (navRegion) {
            API.show(navRegion);
        });

    });
});