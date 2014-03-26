define([
    "modules/sidebar/list/list_setup"
], function () {
    Application.module("Sidebar.List", function (List, Application, Backbone, Marionette, $, _) {

        List.views.SideBarTab = Application.Views.ItemView.extend({
            template: "sidebar/list/listTab",
            tagName: "li",

            initialize: function() {
                this.$el.prop("id", this.model.get("id"));
            },

            events: {
                "click": "clicked"
            },

            select: function() {
                this.$el.addClass("active")
            },

            unSelect: function() {
                this.$el.removeClass("active")
            },

            clicked: function(event) {
                event.preventDefault();
                Application.execute(Application.SHOW_MODULE, this.model.get("id"));
            }
        });

        List.views.SidebarOptions = Application.Views.CompositeView.extend({
            template: "sidebar/list/listContainer",
            itemView: List.views.SideBarTab,
            itemViewContainer: "#main-nav",

//            initialize: function(){
//                var that = this;
//                this.on("itemview:sidebar-navtab:clicked", function(childView, msg){
////                console.log("Show Module: " + childView.model.get("id"))
//                    that.trigger("collectionview:itemview:sidebar-navtab:clicked", childView.model.get("id"));
//                });
//            },

            unSelectAll: function() {
                this.children.each(function(tab){
                    tab.unSelect();
                });
            },

            selectTabView: function(id) {
                this.unSelectAll();
                var tabView = this.children.find(function(tab){
                    return tab.model.get('id') == id;
                });

                tabView.select();
            }

        });
    });
});
