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

//            regions : {
//                profileRegion: "#profileSection",
//                changePasswordRegion: "#changePasswordSection",
//                adminRegion: "#adminSection"
//            }

            regions: {
                settingTabRegion: "#settingTabs",
                settingContentRegion: "#settingContent"
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


        //Header tabs

        var tabHtml = "<a href='#'><%=args.text%></a>";
        Settings.views.Tab = Application.Views.ItemView.extend({
            tagName: "li",

            template: function(serialized_model) {
                return _.template(tabHtml,
                    {text: serialized_model.text},
                    {variable: 'args'});
            },

            events: {
                "click": "showView"
            },

            select: function() {
                this.$el.addClass("active")
            },

            unSelect: function() {
                this.$el.removeClass("active")
            },

            showView: function(evt) {
                evt.preventDefault();
                console.log("Show Tab Content: " + this.model.get('text'));
                this.trigger(Settings.TAB_SELECTED, this);
            }

        });

        Settings.views.TabContainer = Application.Views.CompositeView.extend({
            template: "settings/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Settings.views.Tab,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Settings.TAB_SELECTED, function(childView){
                    that.trigger(Settings.TAB_SELECTED, childView.model.get('id'));
                });
            },

            events: {
                "click #createEnquiry" : "createEnquiry"
            },

            createEnquiry: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CREATE_STUDENT);
            },

            unSelectAll: function() {
                this.children.each(function(tab){
                    tab.unSelect();
                });
            },

            selectTabView: function(tabId) {
                this.unSelectAll();
                var tabView = this.children.find(function(tab){
                    return tab.model.get('id') == tabId;
                });

                tabView.select();
            }

        });














        Settings.views.UserInfo = Application.Views.ItemView.extend({
//            className: "someClass",
            tagName: "section",
            template: "settings/templates/userInfo",

            serializeData: function(){
                var data = this.model.toJSON();
//                data.firstName = data.user.firstName;
//                data.lastName = data.user.lastName;
//                data.phoneNumber = data.user.phoneNumber;
//                data.email = data.user.email;
//                data.address = data.user.address;
                data.role = data.user.role;
                return data;
            }
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