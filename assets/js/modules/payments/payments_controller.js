define([
    "modules/payments/payments_view",
    "modules/entities/user",
    "modules/entities/school",
    "modules/entities/country"
], function () {
    Application.module("Payments", function (Payments, Application, Backbone, Marionette, $, _) {

        Payments.changePasswordEvt = "changePassword";
        Payments.createAdminEvt = "createAdmin";
        Payments.createSchoolEvt = "createSchool";
        Payments.createCountryEvt = "createCountry";


        //Event
        Payments.TAB_SELECTED = "tab:selected";

        //Enquiry Tab Id's
        Payments.PROFILE_TAB = "profile";
        Payments.ADMIN_TAB = "admin";

        var tabCollection = new Application.Entities.Collection([
            new Application.Entities.Model({text:"Profile", id: Payments.PROFILE_TAB})
//            new Application.Entities.Model({text:"Admin", id: Payments.ADMIN_TAB})
        ]);



        Payments.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showNavTabs();
                    this.showProfile(user);


                });

                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });

            },

            showProfile: function (user) {

                var profileView = new Payments.views.Profile({
                    model: user,
                    modalId: Payments.changePasswordModalFormId
                });

                this.listenTo(profileView, Application.CHANGE_PASSWORD, this.showChangePasswordModal);

                this.layout.settingContentRegion.show(profileView);
            },


            showChangePasswordModal: function(user) {
                var changePassword = Application.request(Application.GET_CHANGE_PASSWORD_USER, user.get('user').id);
                changePassword.attributes.modalId = Payments.changePasswordModalFormId;
                var changePasswordModalView = new Payments.views.ChangePassword({
                    model: changePassword
                });

                var that = this;
                changePasswordModalView.on(Payments.changePasswordEvt, function(modalFormView, data){
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
                var tabContainerView = new Payments.views.TabContainer({
                    collection: tabCollection
                });
                this.layout.settingTabRegion.show(tabContainerView);
                if (tabId) {
                    tabContainerView.selectTabView(tabId);
                    Application.navigate(Payments.rootRoute + "/" +tabId);
                }

            },



            getLayout: function () {
                return new Payments.views.Layout();
            }
        });
    })
});