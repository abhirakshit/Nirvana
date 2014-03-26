define([], function () {
    Application.module("Sidebar.List", function (List, Application, Backbone, Marionette, $, _) {
        this.prefix = "Sidebar.List";
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
