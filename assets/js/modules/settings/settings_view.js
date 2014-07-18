define([], function(){
    Application.module("Settings", function(Settings, Application, Backbone, Marionette, $, _) {
        //Setup
        this.prefix = "Settings";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };

        Settings.views.Layout = Application.Views.Layout.extend({
            template: "views/templates/page_layout",
            regions: {
                tabsRegion: "#tabs",
//                addButtonRegion: "#addButton",
                contentRegion: "#content"
            }

        });

        //Header tabs

        var tabHtml = "<a href='#'><%=args.text%></a>";
        Settings.views.Tab = Application.Views.ItemView.extend({
            template: "views/templates/tab",
            tagName: "li",

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
    })
});