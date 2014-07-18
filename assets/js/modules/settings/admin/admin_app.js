define([
    "modules/settings/admin/admin_controller"
], function () {
    Application.module("Settings.Admin", function (Admin, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new Admin.Controller({
                    region: contentRegion
                });
            }
        };

        Application.commands.setHandler(Application.SETTINGS_ADMIN, function (contentRegion) {
            API.show(contentRegion);
        });

    })
});