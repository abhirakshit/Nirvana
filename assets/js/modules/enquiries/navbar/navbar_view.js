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

            showView: function(evt) {
                evt.preventDefault();
                console.log("Show Tab Content: " + this.model.get('text'));
            }
        });


//        var tabContainerHtml = ""
        Navbar.views.TabContainer = Application.Views.CompositeView.extend({
//            className: "nav nav-pills",
//            className: "nav nav-tabs nav-justified",
            className: "nav nav-tabs pull-left",
            tagName: "ul",
            itemView: Navbar.views.Tab,
            template: function(serialized_model) {
                return _.template("");
            }

//            onRender: function() {
//                this.$el.append('<span class="hidden-sm">Left</span>');
//            }
        })
    });
});