define([], function () {
    Application.module("Settings.Admin", function (Admin, Application, Backbone, Marionette, $, _) {

        //Setup
        this.prefix = "Settings";
        this.templatePath = "js/modules/";
        this.views = {};

        this.template = function (str) {
            return this.prefix + '-' + str;
        };




    })
});