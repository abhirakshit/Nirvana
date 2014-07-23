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
                    model: user,
                    modalId: Show.addUserModalFormId
                });

                this.listenTo(userDropDownCollectionView, Application.CREATE_USER, this.createUser);

                this.listenTo(userDropDownCollectionView, Application.SHOW_PROFILE, function() {
                    Application.execute(Application.SETTINGS_SHOW);
                });

                this.show(userDropDownCollectionView, {
                    region: this.layout.userDropDownRegion
                })
            },


            getRoleTypes: function() {
                var adminRoleTypes = ["admin", "student", "staff", "enquiry"];
                var userRoleTypes = ["student", "staff", "enquiry"];
                if (Application.USER_IS_ADMIN) {
                    return adminRoleTypes;
                }

                return userRoleTypes;
            },

            createUser: function() {
                //Show Modal Dialog
                var newStudent = Application.request(Application.GET_USER);
                newStudent.attributes.modalId = Show.addUserModalFormId;
                var addUserModalView = new Show.views.addUserForm({
                    model: newStudent,
                    roleTypes: this.getRoleTypes()
                });

                var that = this;
                addUserModalView.on(Show.CREATE_USER, function(modalFormView, data){
                    modalFormView.model.save(data, {
                        wait: true,
                        patch: true,
                        success: function(newUser){
                            console.log("Saved on server!!");
                            console.dir(newUser);
                            that.showUser(newUser, data.role);

                            //TODO: Update enquiry collection (Assigned to me or all)
                        },

                        error: function(x, response) {
                            console.log("Error on server!! -- " + response.text);
                            return response;
                        }
                    });
                });
                Application.modalRegion.show(addUserModalView);
            },

            getDropDownOptions: function() {
                if (Application.USER_IS_ADMIN)
                    return this.getAdminDropDownOptions();

                return this.getUserDropDownOptions();
            },

            getUserDropDownOptions: function() {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: "user"}),
                    new Application.Entities.Model({optionId:"logout", optionUrl: Application.LOGOUT, optionText: "Logout", iconClass: "power-off"})
                ])
            },

            getAdminDropDownOptions: function() {
                return new Application.Entities.Collection([
                    new Application.Entities.Model({optionId:"profile", optionUrl: "#user/profile", optionText: "Profile", iconClass: "user"}),
                    new Application.Entities.Model({optionId:"admin", optionUrl: "#admin", optionText: "Admin", iconClass: "cog"}),
                    new Application.Entities.Model({optionId:"logout", optionUrl: Application.LOGOUT, optionText: "Logout", iconClass: "power-off"})
                ])
            },

            showUser: function(user, role) {
                if (Application.ENQUIRY_ROLE == role) {
                    Application.execute(Application.ENQUIRY_SHOW, this.layout.enqContentRegion, user.id);
                } else if (Application.STUDENT_ROLE == role) {
                    Application.execute(Application.STUDENT_SHOW, this.layout.enqContentRegion, user.id);
                } else if (Application.ADMIN_ROLE == role) {
                    Application.execute(Application.STAFF_SHOW, this.layout.enqContentRegion, user.id);
                } else if (Application.STAFF_ROLE == role) {
                    Application.execute(Application.STAFF_SHOW, this.layout.enqContentRegion, user.id);
                }
            }
        })
    });
});