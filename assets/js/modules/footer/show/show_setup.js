define([], function () {
    Application.module("Footer.Show", function (Show, Application, Backbone, Marionette, $, _) {
        this.prefix = "Footer.Show";
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