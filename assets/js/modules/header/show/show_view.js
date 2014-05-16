define([
    "modules/header/show/show_setup"
], function(){
    Application.module("Header.Show", function(Show, Application, Backbone, Marionette, $, _) {
        Show.addUserModalFormId = 'addUserModal';
        Show.CREATE_USER = "CREATE_USER";

        Show.views.Layout = Application.Views.Layout.extend({
            template: "header/show/templates/show_layout",

            regions: {
                appLabelRegion: "#app-label",
                navTabsRegion: "#header-nav-tabs",
                addUserRegion: "#add-user",
                userDropDownRegion: "#user-dropdown"
            }
        });


        Show.views.AddUserBtn = Application.Views.ItemView.extend({
            template: "header/show/templates/add_user_btn",
            tagName: "span",
            className: "navbar-form navbar-left input-s-lg m-t m-l-n-xs hidden-xs"
        });

        var appLabelHtml = '<img src="images/logo.png" class="m-r-sm"><%=args.appLabel%><span class="beta">beta</span>';
        Show.views.AppLabel = Application.Views.ItemView.extend({
            tagName: "a",
            className: "navbar-brand",
            id: "appLabel",

            template: function(serialized_model) {
                return _.template(appLabelHtml,
                    {appLabel: serialized_model.appLabel},
                    {variable: 'args'});
            },

            events: {
                "click #appLabel": "showAppHome"
            },

            showAppHome: function(evt) {
                evt.preventDefault();
                console.log("Show App home");
            }

        });


        var userDropDownOptionHtml = '<a href="<%=args.optionUrl%>"><i class="fa fa-<%=args.iconClass%>"></span>&nbsp<%=args.optionText%></a>';
        Show.views.UserDropDownOption = Marionette.ItemView.extend({
            tagName: "li",

            initialize: function() {
                this.$el.prop("id", this.model.get("optionId"));
            },

            template: function(serialized_model) {
                return _.template(userDropDownOptionHtml,{
                    optionUrl: serialized_model.optionUrl,
                    optionText: serialized_model.optionText,
                    iconClass: serialized_model.iconClass
                }, {variable: "args"})
            }
        });


        Show.views.UserDropDownCollection = Marionette.CompositeView.extend({
            template: "header/show/templates/userDropDownBtn",
            className: "nav navbar-nav navbar-right m-n hidden-xs nav-user user",
            tagName: "ul",
            itemView: Show.views.UserDropDownOption,
            itemViewContainer: "#user-actions",


            serializeData: function(){
                var data = this.model.toJSON();
                data.modalId = this.options.modalId;
                return data;
            },

            onRender: function() {
                this.$el.find("#logout").before('<li class="divider"></li>')
            },

            events: {
                "click #addUser" : "addUser",
                "click #profile": Application.SHOW_PROFILE,
                "click #admin": Application.SHOW_ADMIN,
                "click #logout": Application.LOGOUT
            },

            addUser: function(evt) {
                evt.preventDefault();
                this.trigger(Application.CREATE_USER);
            },

            showProfile: function(event) {
                event.preventDefault();
                Application.request(Application.SHOW_PROFILE);
            },

            showAdmin: function() {
                event.preventDefault();
                Application.request(Application.SHOW_ADMIN);
            },

            logout: function() {
                event.preventDefault();
                Application.request(Application.LOGOUT);
            }
        });

        Show.views.addUserForm = Application.Views.ItemView.extend({
            template: "header/show/templates/add_user_form",

            events: {
                "click #createNewUser" : "createNewUser"
            },

            onRender: function() {
                Backbone.Validation.bind(this);

//                console.log("Add picker");

                this.renderRoleSelect(this.options.roleTypes, "#role");

                //Add datetime field
                Application.Views.addDateTimePicker(this.$el.find('#followUpDiv'));

                //TODO Add Assigned to


                //TODO Add status

            },

            renderRoleSelect :function (list, element) {
                var that = this;
                _.each(list, function(value){
                    that.$el.find(element).append("<option value='" + value + "'>" + value + "</option>");
                });
            },

            createNewUser: function(evt) {
                evt.preventDefault();
                var data = Backbone.Syphon.serialize(this);
                this.model.set(data);

                var isValid = this.model.isValid(true);
                if (isValid) {
                    Application.Views.hideModal(Show.addUserModalFormId);
                    this.trigger(Show.CREATE_USER, this, data);
                }
            }

        });


    });
});