define([
    "modules/enquiries/enquiries_setup"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {

        Enquiries.views.Layout = Application.Views.Layout.extend({
            template: "enquiries/templates/enquiries_layout",
            regions: {
                enqTabRegion: "#enqTabs",
                enqContentRegion: "#enqContent"
//                enqShowRegion: "#enqShow"
            }
        });

        var tabHtml = "<a href='#'><%=args.text%></a>";
        Enquiries.views.Tab = Application.Views.ItemView.extend({
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
                this.trigger(Enquiries.TAB_SELECTED, this);
            }

        });

        Enquiries.views.TabContainer = Application.Views.CompositeView.extend({
            template: "enquiries/templates/tab_container",
            tagName: "span",
            itemViewContainer: "#tabsUL",
            itemView: Enquiries.views.Tab,

            initialize: function(){
                var that = this;
                this.on(Application.CHILD_VIEW + ":" + Enquiries.TAB_SELECTED, function(childView){
                    that.trigger(Enquiries.TAB_SELECTED, childView.model.get('id'));
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

        })
    });
});