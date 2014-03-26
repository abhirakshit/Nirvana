define([
    "modules/profile/counselor/counselor_app",
    "modules/profile/profile_controller",
    "modules/loading/loading_controller"
], function(){
    Application.module("Profile", function(Profile, Application, Backbone, Marionette, $, _) {

        Profile.studentRootRoute = "profile";
        Profile.counselorRootRoute = "profiles";
        Profile.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "profile": "show",
                "profile/": "show",
                "profiles": "showProfiles",
                "profiles/": "showProfiles"
            }
        });

        var API = {
            show: function() {
                console.log("Show Profile");
                new Profile.Controller({
                    region: Application.pageContentRegion
                });
            },

            showProfiles: function() {
                Application.commands.execute(Application.PROFILES_SHOW);
            }
        };

        Profile.setup = function() {
            console.log("Profile setup");
            new Profile.Router({
                controller: API
            })

        };

        Profile.on(Application.START, function () {
            console.log("Profile start...");

            Marionette.TemplateLoader.loadModuleTemplates(Profile.Counselor, function(){
                Marionette.TemplateLoader.loadModuleTemplates(Profile, Profile.setup);
            });
        });

        Application.commands.setHandler(Application.PROFILE_SHOW, function(){
            if (Application.request(Application.IS_STUDENT)) {
                API.show();
                Application.navigate(Profile.studentRootRoute);
            } else {
                API.showProfiles();
                Application.navigate(Profile.counselorRootRoute);
            }
            Application.commands.execute(Application.SET_SIDEBAR, Application.PROFILE_SHOW);
        });
    });
});
