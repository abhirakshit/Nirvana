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


        //Event
        Settings.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Settings.PROFILE_TAB = "profile";
        Settings.ADMIN_TAB = "admin";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Profile", id: Settings.PROFILE_TAB})
//            new Application.Entities.Model({text:"Admin", id: Settings.ADMIN_TAB})
        ]);

//        Settings.ChangePassword = Application.Entities.Model.extend({
//            validation: {
//                currentPassword: {
//                    required: true
//                },
//
//                newPassword: {
//                    required: true
//                },
//
//                confirmPassword: {
//                    equalTo: 'newPassword'
//                }
//            }
//        });

        Settings.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showNavTabs();
                    this.showProfile(user);


//                    this.showUserInfoSection(user);
//                    this.showChangePasswordSection(user);
//
//
//                    if (Application.USER_IS_ADMIN) {
//                        this.showAdminSection(user);
//                    }

                });

                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });

            },

            showProfile: function (user) {

                var profileView = new Settings.views.Profile({
                    model: user,
                    modalId: Settings.changePasswordModalFormId
                });

                this.listenTo(profileView, Application.CHANGE_PASSWORD, this.showChangePasswordModal);

                this.layout.settingContentRegion.show(profileView);
            },


            showChangePasswordModal: function(user) {
                var changePassword = Application.request(Application.GET_CHANGE_PASSWORD_USER, user.get('user').id);
                changePassword.attributes.modalId = Settings.changePasswordModalFormId;
                var changePasswordModalView = new Settings.views.ChangePassword({
                    model: changePassword
                });

                var that = this;
                changePasswordModalView.on(Settings.changePasswordEvt, function(modalFormView, data){
                    console.log(data);
                    var userModel = modalFormView.model;
                    userModel.urlRoot = userModel.urlRoot + "/changePassword"
                    userModel.save(data, {
                        wait: true,
                        patch: true,
                        success: function(newUser){
//                            console.log("Saved on server!!");
                            Application.Views.showSuccessMsg("Password updated successfully!");
//                            console.dir(newUser);
//                            that.showUser(newUser, data.role);
                        },

                        error: function(oldModel, response) {
                            Application.Views.showErrorMsg(response.responseJSON.validationErrors);
                            console.log("Error on server!! -- " + response.responseText);
                            return oldModel;
                        }
                    });
                });
                Application.modalRegion.show(changePasswordModalView);
            },

            showNavTabs: function (tabId) {
                var tabContainerView = new Settings.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.settingTabRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Settings.rootRoute + "/" +tabId);
                }

//                var that = this;
//                this.listenTo(tabContainerView, Enquiries.TAB_SELECTED, function(tabId){
//                    that.showTab(tabId);
//                    tabContainerView.selectTabView(tabId);
//                    Application.navigate(Enquiries.rootRoute + "/" +tabId);
//                });
            },

//            showAdminSection: function (user) {
//                this.adminLayout = new Settings.views.Admin_Layout();
//                this.layout.adminRegion.show(this.adminLayout);
//                this.showAddAdminView();
//                this.showAddSchoolView();
//                this.showAddCountryView();
//            },
//
//            showAddCountryView: function () {
//                var createCountryView = new Settings.views.CreateCountry({
//                    model: Application.request(Application.GET_COUNTRY)
//                });
//                this.adminLayout.addCountryRegion.show(createCountryView);
//                this.listenTo(createCountryView, Settings.createCountryEvt, function (view) {
//                    var data = Backbone.Syphon.serialize(view);
//                    view.model.save(data, {
//                        wait: true,
//                        success: function (model) {
//                            $.jGrowl("New Country added: " + model.get("title"), {theme: 'jGrowlSuccess'});
//                        },
//
//                        error: function (model, response) {
//                            $.jGrowl("Error saving " + model.get("title"), {theme: 'jGrowlError'});
//                            console.error("Error Model: " + model.toJSON());
//                            console.error("Error Response: " + response.statusText);
//                        }
//                    });
//                });
//
//            },
//
//            showAddSchoolView: function () {
//                var createSchoolView = new Settings.views.CreateSchool({
//                    model: Application.request(Application.SCHOOL_GET)
//                });
//                this.adminLayout.addSchoolRegion.show(createSchoolView);
//                this.listenTo(createSchoolView, Settings.createSchoolEvt, function (view) {
//                    var data = Backbone.Syphon.serialize(view);
//                    view.model.save(data, {
//                        wait: true,
//                        success: function (model) {
//                            $.jGrowl("New School added: " + model.get("title"), {theme: 'jGrowlSuccess'});
//                        },
//
//                        error: function (model, response) {
//                            $.jGrowl("Error saving " + model.get("title"), {theme: 'jGrowlError'});
//                            console.error("Error Model: " + model.toJSON());
//                            console.error("Error Response: " + response.statusText);
//                        }
//                    });
//                });
//
//            },
//
//            showAddAdminView: function () {
//                var createAdminView = new Settings.views.CreateAdmin({
//                    model: Application.request(Application.GET_STUDENT)
//                });
//                this.adminLayout.addAdminRegion.show(createAdminView);
//                this.listenTo(createAdminView, Settings.createAdminEvt, function (view) {
//                    var data = Backbone.Syphon.serialize(view);
//                    data.role = Application.ADMIN_ROLE;
//
//                    view.model.save(data, {
//                        wait: true,
//                        success: function (model) {
//                            console.log("Got success!!!")
//                            $.jGrowl("New Admin created: " + model.get("firstName"), {theme: 'jGrowlSuccess'});
////                            Settings.showProfile();
//                        },
//
//                        error: function (model, response) {
//                            $.jGrowl("Error saving " + model.get("firstName"), {theme: 'jGrowlError'});
//                            console.error("Error Model: " + model.toJSON());
//                            console.error("Error Response: " + response.statusText);
////                            Settings.showProfile();
//                        }
//                    });
//                });
//
//            },
//
//
//            showUserInfoSection: function (user) {
////                console.dir(user);
//                var userInfoView = new Settings.views.UserInfo({
//                    model: user
//                });
//                this.layout.profileRegion.show(userInfoView);
//            },
//
//            showChangePasswordSection: function (user) {
//                var changePasswordView = new Settings.views.ChangePassword({
//                    model: Application.request(Application.GET_PASSWORD)
//                });
//                this.layout.changePasswordRegion.show(changePasswordView);
//
//                this.listenTo(changePasswordView, Settings.changePasswordEvt, function (view) {
//                    var data = Backbone.Syphon.serialize(view);
//
//                    console.log(data);
//                    user.save(data, {
//                        wait: true,
//                        patch: true,
//                        success: function (model) {
//                            $.jGrowl("Password Changed!!!", {theme: 'jGrowlSuccess'});
//                        },
//
//                        error: function (model, response) {
//                            $.jGrowl("Error changing password", {theme: 'jGrowlError'});
//                            console.error("Error Model: " + model.toJSON());
//                            console.error("Error Response: " + response.statusText);
//                        }
//                    });
//                });
//            },

            getLayout: function () {
                return new Settings.views.Layout();
            }
        });
    })
});