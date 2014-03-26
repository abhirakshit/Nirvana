define([
    "modules/profile/counselor/counselor_controller",
    "modules/loading/loading_controller"
], function(){
    Application.module("Profile.Counselor", function(Counselor, Application, Backbone, Marionette, $, _) {

        var API = {
            show: function() {
                console.log("Show Counselors Profile");
                new Counselor.Controller({
                    region: Application.pageContentRegion
                });
            }
        };

        Application.commands.setHandler(Application.PROFILES_SHOW, function(){
            API.show();
        });
    })
});
