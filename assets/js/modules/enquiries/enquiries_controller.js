define([
    "modules/enquiries/enquiries_view",
    "modules/enquiries/navbar/navbar_app",
    "modules/entities/user"
], function () {
    Application.module("Enquiries", function (Enquiries, Application, Backbone, Marionette, $, _) {

        Enquiries.Controller = Application.Controllers.Base.extend({
            initialize: function () {
                var user = Application.request(Application.GET_LOGGED_USER);
                this.layout = this.getLayout();

                this.listenTo(this.layout, Application.SHOW, function () {
                    this.showNavBar();
                    this.showTab();
                });

                this.show(this.layout, {
                    loading: {
                        entities: [user]
                    }
                });
            },

            showNavBar: function () {
                Application.execute(Application.ENQUIRIES_NAV_SHOW, this.layout.enqTabRegion);
            },

            showTab: function () {
                Application.execute(Application.ENQUIRIES_CONTENT_SHOW, this.layout.enqContentRegion);
            },

            getLayout: function () {
                return new Enquiries.views.Layout();
            }

        });


    });
});
