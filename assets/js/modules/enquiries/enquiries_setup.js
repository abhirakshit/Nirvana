define([], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {
        this.prefix = "Enquiries";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };
        // This has been added to only keep class naming consistent with views.
        this.models = {};
        this.collections = {};
    });
});