define([
    "modules/footer/show/show_view"
], function () {
    Application.module("Footer.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                this.layout = this.getLayout();
                this.show(this.layout);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }
        });
    });
});