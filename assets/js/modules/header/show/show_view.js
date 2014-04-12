define([
    "modules/header/show/show_setup"
], function(){
    Application.module("Header.Show", function(Show, Application, Backbone, Marionette, $, _) {
        Show.views.Layout = Application.Views.Layout.extend({
            template: "header/show/templates/show_layout",

            regions: {
                appLabelRegion: "#app-label",
                navTabsRegion: "#header-nav-tabs",
                userDropDownRegion: "#user-dropdown"
            }
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


//            serializeData: function(){
//                var data = this.model.toJSON();
//                data.name = data.user.name;
////                data.headingTitle = this.options.headingTitle;
////                data.editorId = this.options.editorId;
//                return data;
//            },

            onRender: function() {
                this.$el.find("#logout").before('<li class="divider"></li>')
            },

            events: {
                "click #profile": Application.SHOW_PROFILE,
                "click #admin": Application.SHOW_ADMIN,
                "click #logout": Application.LOGOUT
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
        })


    });
});