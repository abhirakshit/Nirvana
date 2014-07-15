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


        Settings.changePasswordModalFormId = "changePasswordModal";
        Settings.changePasswordEvt = "changePasswordEvt";


        Settings.views.Admin_Layout = Application.Views.Layout.extend({
            template: "settings/templates/admin_layout",

            regions : {
                addTopicRegion: "#addTopic",
                addSchoolRegion: "#addSchool",
                addCountryRegion: "#addCountry"
            }
        });

        Settings.views.Layout = Application.Views.Layout.extend({
            template: "settings/templates/settings_layout",

            regions: {
                settingTabRegion: "#settingTabs",
                settingContentRegion: "#settingContent",
                adminRegion: "#adminSection"
            }
        });

        Settings.views.Profile = Application.Views.ItemView.extend({
            template: "settings/templates/profile_view",

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
                Settings.setupEditableBox(this.$el, this.model, "firstName", "FirstName", this.model.get('firstName'), 'text', null, 'right');
                Settings.setupEditableBox(this.$el, this.model, "lastName", "LastName", this.model.get('lastName'), 'text', null, 'right');
                Settings.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text', null, 'right');
                Settings.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Settings.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea', null, 'right');
            }
        });

        Settings.views.Admin = Application.Views.ItemView.extend({
            template: "settings/templates/admin_view",

            events: {
                "click #createTopicBtn": "createTopic"
            },

            createTopic: function(evt) {
                evt.preventDefault();
                this.trigger(Settings.CREATE_TOPIC);
            }

        });


        //Header tabs

        var tabHtml = "<a href='#'><%=args.text%></a>";
        Settings.views.Tab = Application.Views.ItemView.extend({
            template: "views/templates/tab",
            tagName: "li",

//            template: function(serialized_model) {
//                return _.template(tabHtml,
//                    {text: serialized_model.text},
//                    {variable: 'args'});
//            },

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
//            template: "settings/templates/tab_container",
            template: "views/templates/tab_container",
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

        Settings.views.ChangePassword = Application.Views.ItemView.extend({
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
                this.model.set(data);

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Settings.changePasswordModalFormId);
                    this.trigger(Settings.changePasswordEvt, this, data);
                }
            }
        });



        Settings.setupEditableBox = function(el, model, id, emptyText, initialValue, type, source, placement){
            var successCB = function (response, value) {
                console.log("[" + id + ":" + value + "]");
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



//        Settings.views.UserInfo = Application.Views.ItemView.extend({
////            className: "someClass",
//            tagName: "section",
//            template: "settings/templates/userInfo",
//
//            serializeData: function(){
//                var data = this.model.toJSON();
//                data.role = data.user.role;
//                return data;
//            }
//        });
//
//        Settings.views.ChangePassword = Application.Views.ItemView.extend({
//            template: "settings/templates/change_password",
//            events: {
//                "click #changePassword": "changePassword",
//                "click #cancelBtn": "toggleChangePassword",
//                "click #changePasswordBtn": "toggleChangePassword"
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//            },
//
//            changePassword: function(event) {
//                event.preventDefault();
//                var data = Backbone.Syphon.serialize(this);
//                this.model.set(data);
//                console.log(this.model.isValid(true));
//                if (!this.model.isValid(true))
//                    return;
//
//                this.trigger(Settings.changePasswordEvt, this);
//                this.toggleChangePassword(event);
//            },
//
//            toggleChangePassword: function(event) {
//                event.preventDefault();
//                this.$el.find("#changePasswordContainer").fadeToggle();
//            }
//        });
//
//        Settings.views.CreateAdmin = Application.Views.ItemView.extend({
//            template: "settings/templates/create_admin",
//
//            events: {
//                "click #createAdmin": "createAdmin",
//                "click #cancelBtn": "toggleViewVisibility",
//                "click #createAdminBtn": "toggleViewVisibility"
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//            },
//
//            toggleViewVisibility: function(event) {
//                event.preventDefault();
//                this.$el.find("#createAdminContainer").fadeToggle();
//            },
//
//            createAdmin: function(evt) {
//                evt.preventDefault();
//                this.trigger(Settings.createAdminEvt, this);
//            }
//
//        });
//
//        Settings.views.CreateSchool = Application.Views.ItemView.extend({
//            template: "settings/templates/create_school",
//
//            events: {
//                "click #createSchool": "createSchool",
//                "click #cancelBtn": "toggleViewVisibility",
//                "click #createSchoolBtn": "toggleViewVisibility"
//            },
//
//            onRender: function() {
//                Backbone.Validation.bind(this);
//            },
//
//            toggleViewVisibility: function(event) {
//                event.preventDefault();
//                this.$el.find("#createSchoolContainer").fadeToggle();
//            },
//
//            createSchool: function(evt) {
//                evt.preventDefault();
//                this.trigger(Settings.createSchoolEvt, this);
//            }
//
//        });
//
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