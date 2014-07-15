define([
    "modules/settings/profile/profile_view"
], function () {
    Application.module("Settings.Profile", function (Profile, Application, Backbone, Marionette, $, _) {

        Profile.Controller = Application.Controllers.Base.extend({
            initialize: function() {
                var user = Application.request(Application.GET_LOGGED_USER);
                var allTopics = Application.request(Application.GET_TOPICS);
                var allServices = Application.request(Application.GET_SERVICES);

                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function(){
//                    this.setupTabContent(user, allTopics, allServices);
                    this.showProfile(user);
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user, allTopics, allServices]
                    }
                });
            },

            showProfile: function (user) {
                var profileView = new Profile.views.Profile({
                    model: user,
                    modalId: Profile.changePasswordModalFormId
                });

                this.listenTo(profileView, Application.CHANGE_PASSWORD, this.showChangePasswordModal);
                this.layout.profileRegion.show(profileView);
            },

            showChangePasswordModal: function(user) {
                var changePassword = Application.request(Application.GET_CHANGE_PASSWORD_USER, user.get('user').id);
                changePassword.attributes.modalId = Profile.changePasswordModalFormId;
                var changePasswordModalView = new Profile.views.ChangePassword({
                    model: changePassword
                });

                var that = this;
                changePasswordModalView.on(Profile.changePasswordEvt, function(modalFormView, data){
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



            getLayout: function () {
                return new Profile.views.Layout();
            }
        })
    })
});