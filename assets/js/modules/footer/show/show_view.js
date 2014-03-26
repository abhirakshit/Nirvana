define([
    "modules/footer/show/show_setup"
], function () {
    Application.module("Footer.Show", function (Show, Application, Backbone, Marionette, $, _) {
        Show.views.Layout = Application.Views.Layout.extend({
            template: "footer/show/show_layout"
        });
    });
});