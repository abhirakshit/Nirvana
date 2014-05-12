define([
], function () {
    Application.module("Students.Show", function (Show, Application, Backbone, Marionette, $, _) {


        this.prefix = "Show";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };


        Show.views.Layout = Application.Views.Layout.extend({
            initialize: function () {console.log('I am in student:show view');},
            template: "students/show/templates/show_layout",
            className: "someClass",
            regions: {
                personalRegion: "#personal",
                careerRegion: "#career",
                locationRegion: "#location",
                adminRegion: "#admin",
                historyRegion: "#history"
            }
        });


        Show.views.Personal = Application.Views.ItemView.extend({
            template: "students/show/templates/personal_view",

            onRender: function() {
                Backbone.Validation.bind(this);
                this.setupPersonalView();
            },

            setupPersonalView: function() {
                Show.setupEditableBox(this.$el, this.model, "firstName", "John", this.model.get('firstName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "lastName", "", this.model.get('lastName'), 'text');
                Show.setupEditableBox(this.$el, this.model, "phoneNumber", "Enter Phone", this.model.get('phoneNumber'), 'text');
                Show.setupEditableBox(this.$el, this.model, "email", "Enter Email", this.model.get('email'), 'text');
                Show.setupEditableBox(this.$el, this.model, "address", "Enter Address", this.model.get('address'), 'textarea');
            }
        });



    });
});