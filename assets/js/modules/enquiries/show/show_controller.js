define([
    "modules/enquiries/show/show_view"
], function () {
    Application.module("Enquiries.Show", function (Show, Application, Backbone, Marionette, $, _) {

        Show.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showStudent(user)
                });


                this.show(this.layout, {
                    loading: {
                        entities: user
                    }
                });
            },

            showStudent: function (user) {
                var personalView = new Show.views.Personal({
                    model: user
                });
                this.layout.personalRegion.show(personalView);
            },

            getLayout: function () {
                return new Show.views.Layout();
            }

        });


    });
});
