define([
    "modules/header/show/show_view",
    "modules/entities/user"
], function () {
    Application.module("Header.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                this.layout = this.getLayout();
                this.listenTo(this.layout, Application.SHOW, function(){
                    this.showAppName();
                    this.showUserDropDown();
                });

                this.show(this.layout);
            },

            getLayout: function () {
                return new Show.views.Layout();
            },

            showAppName: function() {
                var appNameView = new Show.views.AppLabel({
                    model: new Application.Entities.Model({
                        appLabel: "Nirvana"
                    })
                });

                this.show(appNameView, {
                    region: this.layout.appLabelRegion
                })
            },

            showUserDropDown: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var userDropDownCollectionView = new Show.views.UserDropDownCollection({
                    collection: this.getDropDownOptions(),
                    model: user
                });

                this.show(userDropDownCollectionView, {
                    region: this.layout.userDropDownRegion
                })
            },

            getDropDownOptions: function() {
                if (Application.USER_IS_ADMIN)
                    return this.getAdminDropDownOptions();

                return this.getUserDropDownOptions();
            },

            getUserDropDownOptions: function() {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: "user"}),
                    new Application.Entities.Model({optionId:"logout", optionUrl: Application.LOGOUT, optionText: "Logout", iconClass: "off"})
                ])
            },

            getAdminDropDownOptions: function() {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: "user"}),
                    new Application.Entities.Model({optionId:"admin", optionUrl: "#admin", optionText: "Admin", iconClass: "cog"}),
                    new Application.Entities.Model({optionId:"logout", optionUrl: Application.LOGOUT, optionText: "Logout", iconClass: "off"})
                ])
            }
        })
    });
});