define([
], function () {
    Application.module("Enquiries.Navbar", function (Navbar, Application, Backbone, Marionette, $, _) {

        this.prefix = "Navbar";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };



        var tabHtml = "<a href='#'><%=args.text%></a>";
        Navbar.views.Tab = Application.Views.ItemView.extend({
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
            }

        });

        var tabContainerHtml = '<ul id="tabsUL" class="nav nav-tabs pull-left"></ul>' +
            '<span id="createEnquiry" class="badge bg-primary"><a href="#"><i class="fa fa-plus"></i> New Enquiry</a></span>';
        Navbar.views.TabContainer = Application.Views.CompositeView.extend({
            tagName: "span",
            itemViewContainer: "#tabsUL",

            itemView: Navbar.views.Tab,
            template: function(serialized_model) {
                return _.template(tabContainerHtml);
            },

            events: {
                "click #createEnquiry" : "createEnquiry"
            },

            createEnquiry: function(evt) {
                evt.preventDefault();
                console.log("Create new enquiry...");
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