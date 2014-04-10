define([], function(){
    Application.module("Settings", function(Settings, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Settings";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        // This has been added to only keep class naming consistent with views.
        this.models = {};
        this.collections = {};
        //*************


        Settings.views.Layout = Application.Views.Layout.extend({
            template: "settings/templates/settings_layout",

            regions : {
                profileRegion: "#profileSection",
                changePasswordRegion: "#changePasswordSection",
                adminRegion: "#adminSection"
            }
        });

        Settings.views.Admin_Layout = Application.Views.Layout.extend({
            template: "settings/templates/admin_layout",

            regions : {
                addAdminRegion: "#addAdmin",
                addSchoolRegion: "#addSchool",
                addCountryRegion: "#addCountry"
            }
        });


        Settings.views.UserInfo = Application.Views.ItemView.extend({
            className: "someClass",
            tagName: "section",
            template: "settings/templates/userInfo"
        });

        Settings.views.ChangePassword = Application.Views.ItemView.extend({
            template: "settings/templates/change_password",
            events: {
                "click #changePassword": "changePassword",
                "click #cancelBtn": "toggleChangePassword",
                "click #changePasswordBtn": "toggleChangePassword"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            changePassword: function(event) {
                event.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);
                console.log(this.model.isValid(true));
                if (!this.model.isValid(true))
                    return;

                this.trigger(Settings.changePasswordEvt, this);
                this.toggleChangePassword(event);
            },

            toggleChangePassword: function(event) {
                event.preventDefault();
                this.$el.find("#changePasswordContainer").fadeToggle();
            }
        });

        Settings.views.CreateAdmin = Application.Views.ItemView.extend({
            template: "settings/templates/create_admin",

            events: {
                "click #createAdmin": "createAdmin",
                "click #cancelBtn": "toggleViewVisibility",
                "click #createAdminBtn": "toggleViewVisibility"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            toggleViewVisibility: function(event) {
                event.preventDefault();
                this.$el.find("#createAdminContainer").fadeToggle();
            },

            createAdmin: function(evt) {
                evt.preventDefault();
                this.trigger(Settings.createAdminEvt, this);
            }

        });

        Settings.views.CreateSchool = Application.Views.ItemView.extend({
            template: "settings/templates/create_school",

            events: {
                "click #createSchool": "createSchool",
                "click #cancelBtn": "toggleViewVisibility",
                "click #createSchoolBtn": "toggleViewVisibility"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            toggleViewVisibility: function(event) {
                event.preventDefault();
                this.$el.find("#createSchoolContainer").fadeToggle();
            },

            createSchool: function(evt) {
                evt.preventDefault();
                this.trigger(Settings.createSchoolEvt, this);
            }

        })

        Settings.views.CreateCountry = Application.Views.ItemView.extend({
            template: "settings/templates/create_country",

            events: {
                "click #createCountry": "createCountry",
                "click #cancelBtn": "toggleViewVisibility",
                "click #createCountryBtn": "toggleViewVisibility"
            },

            onRender: function() {
                Backbone.Validation.bind(this);
            },

            toggleViewVisibility: function(event) {
                event.preventDefault();
                this.$el.find("#createCountryContainer").fadeToggle();
            },

            createCountry: function(evt) {
                evt.preventDefault();
                this.trigger(Settings.createCountryEvt, this);
            }

        })
    })
});