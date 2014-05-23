define([], function () {
    Application.module("Payments", function (Payments, Application, Backbone, Marionette, $, _) {
        this.prefix = "Payments";
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