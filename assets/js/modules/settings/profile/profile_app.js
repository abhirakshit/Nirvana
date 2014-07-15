define([
    "modules/settings/profile/profile_controller"
], function () {
    Application.module("Settings.Profile", function (Profile, Application, Backbone, Marionette, $, _) {
        var API = {
            show: function (contentRegion) {
                new Profile.Controller({
                    region: contentRegion
                });
            }
        };
        Application.commands.setHandler(Application.SETTINGS_PROFILE, function(contentRegion){
            API.show(contentRegion);
        });
    })
});