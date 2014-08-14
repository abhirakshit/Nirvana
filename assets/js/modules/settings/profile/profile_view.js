define([], function () {
    Application.module("Settings.Profile", function (Profile, Application, Backbone, Marionette, $, _) {

        //Setup
        this.prefix = "Profile";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        Profile.changePasswordModalFormId = "changePasswordModal";
        Profile.changePasswordEvt = "changePasswordEvt";

        Profile.views.Layout = Application.Views.Layout.extend({
            template: "settings/profile/templates/profile_layout",
            regions: {
                profileRegion: "#profile"
            }
        });

        Profile.views.Profile = Application.Views.ItemView.extend({
            template: "settings/profile/templates/profile_view",

            events: {
                "click #changePasswordBtn": "showChangePasswordModal"
            },

            serializeData: function(){
                var data = this.model.toJSON();
                data.modalId = this.options.modalId;
                return data;
            },

            showChangePasswordModal: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CHANGE_PASSWORD, this.model);
            },

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupProfile();
            },

            setupProfile: function() {
                Profile.setupEditableBox(this.$el, this.model, "firstName", "FirstName", this.model.get('firstName'), 'text', null, 'right');
                Profile.setupEditableBox(this.$el, this.model, "lastName", "LastName", this.model.get('lastName'), 'text', null, 'right');
                Profile.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Profile.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Profile.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
            }
        });

        Profile.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
                model.save(id, value, {
                    wait: true,
                    patch: true,
                    success: function (updatedStudent) {
                        console.log("Saved on server!!");
//                        Application.execute(Show.UPDATE_HISTORY_EVT, updatedStudent);
                    },

                    error: function (x, response) {
                        console.log("Error on server!! -- " + response.msg);
                        return response.msg;
                    }
                })
            };

            Application.Views.setupEditableBox(el, id, emptyText, initialValue, type, source, placement, successCB);
        };

        Profile.views.ChangePassword = Application.Views.ItemView.extend({
            template: "settings/templates/change_password",
            events: {
                "click #update": "changePassword"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            changePassword: function(event) {
                event.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(Application.Views.trimFormData(data));

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Profile.changePasswordModalFormId);
                    this.trigger(Profile.changePasswordEvt, this, data);
                }
            }
        });
    })
});