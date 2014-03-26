define([
    "modules/settings/settings_view",
    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country"
], function () {
    Application.module("Settings", function (Settings, Application, Backbone, Marionette, $, _) {

        Settings.changePasswordEvt = "changePassword";
        Settings.createAdminEvt = "createAdmin";
        Settings.createSchoolEvt = "createSchool";
        Settings.createCountryEvt = "createCountry";

        Settings.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                this.layout = this.getLayout();
                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showUserInfoSection(user);
                    this.showChangePasswordSection(user);


                    if (Application.USER_IS_ADMIN) {
                        this.showAdminSection(user);
                    }

                });
                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });

            },

            showAdminSection: function (user) {
                this.adminLayout = new Settings.views.Admin_Layout();
                this.layout.adminRegion.show(this.adminLayout);
                this.showAddAdminView();
                this.showAddSchoolView();
                this.showAddCountryView();
            },

            showAddCountryView: function () {
                var createCountryView = new Settings.views.CreateCountry({
                    model: Application.request(Application.COUNTRY_GET)
                });
                this.adminLayout.addCountryRegion.show(createCountryView);
                this.listenTo(createCountryView, Settings.createCountryEvt, function (view) {
                    var data = Backbone.Syphon.serialize(view);
                    view.model.save(data, {
                        wait: true,
                        success: function (model) {
                            $.jGrowl("New Country added: " + model.get("title"), {theme: 'jGrowlSuccess'});
                        },

                        error: function (model, response) {
                            $.jGrowl("Error saving " + model.get("title"), {theme: 'jGrowlError'});
                            console.error("Error Model: " + model.toJSON());
                            console.error("Error Response: " + response.statusText);
                        }
                    });
                });

            },

            showAddSchoolView: function () {
                var createSchoolView = new Settings.views.CreateSchool({
                    model: Application.request(Application.SCHOOL_GET)
                });
                this.adminLayout.addSchoolRegion.show(createSchoolView);
                this.listenTo(createSchoolView, Settings.createSchoolEvt, function (view) {
                    var data = Backbone.Syphon.serialize(view);
                    view.model.save(data, {
                        wait: true,
                        success: function (model) {
                            $.jGrowl("New School added: " + model.get("title"), {theme: 'jGrowlSuccess'});
                        },

                        error: function (model, response) {
                            $.jGrowl("Error saving " + model.get("title"), {theme: 'jGrowlError'});
                            console.error("Error Model: " + model.toJSON());
                            console.error("Error Response: " + response.statusText);
                        }
                    });
                });

            },

            showAddAdminView: function () {
                var createAdminView = new Settings.views.CreateAdmin({
                    model: Application.request(Application.USER_GET)
                });
                this.adminLayout.addAdminRegion.show(createAdminView);
                this.listenTo(createAdminView, Settings.createAdminEvt, function (view) {
                    var data = Backbone.Syphon.serialize(view);
                    data.role = Application.ADMIN_ROLE;

                    view.model.save(data, {
                        wait: true,
                        success: function (model) {
                            console.log("Got success!!!")
                            $.jGrowl("New Admin created: " + model.get("firstName"), {theme: 'jGrowlSuccess'});
//                            Settings.showProfile();
                        },

                        error: function (model, response) {
                            $.jGrowl("Error saving " + model.get("firstName"), {theme: 'jGrowlError'});
                            console.error("Error Model: " + model.toJSON());
                            console.error("Error Response: " + response.statusText);
//                            Settings.showProfile();
                        }
                    });
                });

            },


            showUserInfoSection: function (user) {
//                console.dir(user);
                var userInfoView = new Settings.views.UserInfo({
                    model: user
                });
                this.layout.profileRegion.show(userInfoView);
            },

            showChangePasswordSection: function (user) {
                var changePasswordView = new Settings.views.ChangePassword({
                    model: Application.request(Application.GET_PASSWORD)
                });
                this.layout.changePasswordRegion.show(changePasswordView);

                this.listenTo(changePasswordView, Settings.changePasswordEvt, function (view) {
                    var data = Backbone.Syphon.serialize(view);

                    console.log(data);
                    user.save(data, {
                        wait: true,
                        patch: true,
                        success: function (model) {
                            $.jGrowl("Password Changed!!!", {theme: 'jGrowlSuccess'});
                        },

                        error: function (model, response) {
                            $.jGrowl("Error changing password", {theme: 'jGrowlError'});
                            console.error("Error Model: " + model.toJSON());
                            console.error("Error Response: " + response.statusText);
                        }
                    });
                });
            },

            getLayout: function () {
                return new Settings.views.Layout();
            }
        });
    })
});