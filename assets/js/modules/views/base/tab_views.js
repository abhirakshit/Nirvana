define([
    "modules/views/base/base_setup"
], function(){
    Application.module("Views.Base", function(Base, Application, Backbone, Marionette, $, _) {

        Base.views.Tab = Application.Views.ItemView.extend({
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
//                console.log("Show Tab Content: " + this.model.get('text'));
                this.trigger(Application.TAB_SELECTED, this);
            }

        });

        Base.views.TabContainer = Application.Views.CompositeView.extend({
            template: "views/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Base.views.Tab,

            initialize: function(){
                var that = this;

                this.on(Application.CHILD_VIEW + ":" + Application.TAB_SELECTED, function(childView){
                    that.trigger(Application.TAB_SELECTED, childView.model.get('id'));
                });
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


    });
});